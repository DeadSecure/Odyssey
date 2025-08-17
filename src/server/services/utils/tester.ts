// src/server/services/utils/mainWorker.ts
import { parentPort, workerData } from "worker_threads";
import path from "path";
import Database from "better-sqlite3";

// ⬇️ adjust these imports to your project structure
import { socialRoutes, financeRoutes, gamingRoutes, devRoutes } from "../../models/sources/sources";
import { Categories } from "../../models/interfaces";
import { getPortsByUsername } from "./ports";
import { addChartsWithSlotsBatch, setGroupedCharts } from "./dbOps"
import { SiteMetadata } from "../../../server/models/client/bars";
import { convertSitesTestResponseToConfigInput } from "./barGenerator";
import { runWorker } from "./workerHandler";


type WorkerData = {
  category: Categories;
  username: string;
  intervalMs: number; 
};

const { category, username, intervalMs } = workerData as WorkerData;

function getSites(category: Categories): SiteMetadata[] {
  return category === Categories.social
    ? socialRoutes
    : category === Categories.finance
    ? financeRoutes
    : category === Categories.gaming
    ? gamingRoutes
    : category === Categories.dev
    ? devRoutes
    : devRoutes.concat(socialRoutes, financeRoutes, gamingRoutes);
}

let stopped = false;
let running = false;

async function doCycle() {
  const sites = getSites(category);

  const ports = await getPortsByUsername(username);

  const promises = ports.map((port) =>
    runWorker(
      path.resolve(process.cwd(), "src/server/services/utils/worker.js"),
      { port, sites, username }
    )
  );

  const results = (await Promise.all(promises)).flat();



  const converted = convertSitesTestResponseToConfigInput(results, sites);


  const dbPath = path.resolve(process.cwd(), "configs", username, "db.sqlite");
  const db = new Database(dbPath);

  addChartsWithSlotsBatch(converted, db);


  setGroupedCharts(db, results);
  parentPort?.postMessage({
    type: "tick:done",
    stats: { ports: ports.length, results: results.length, at: Date.now() },
  });
}

async function loop() {
  if (stopped) return;
  if (running) {
    setTimeout(loop, intervalMs);
    return;
  }
  running = true;
  try {
    await doCycle();
  } catch (err) {
    parentPort?.postMessage({
      type: "tick:error",
      error: err instanceof Error ? err.message : String(err),
    });
  } finally {
    running = false;
    if (!stopped) setTimeout(loop, intervalMs); // schedule next tick
  }
}

// control messages from parent
parentPort?.on("message", (msg) => {
  if (msg?.type === "stop") {
    stopped = true;
    parentPort?.postMessage({ type: "stopped" });
  }
});

// start immediately
loop();
