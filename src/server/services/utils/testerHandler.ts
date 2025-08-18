// src/server/services/utils/startMainWorker.ts
import { Worker } from "worker_threads";
import path from "path";
import { Categories } from "@/server/models/interfaces";

export function startTester(opts: {
  username: string;
  intervalMs: number;
}) {
  const workerPath = path.resolve(
    process.cwd(),
    "src/server/services/utils/tester.js" 
  );

  const worker = new Worker(workerPath, {
    workerData: {
      category: "all",
      username: opts.username,
      intervalMs: opts.intervalMs,
    },
  });

  // optional: listen to progress
  worker.on("message", (m) => {
    if (m?.type === "tick:done") {
      console.log("worker tick complete:", m.stats);
    } else if (m?.type === "tick:error") {
      console.error("worker tick error:", m.error);
    } else if (m?.type === "stopped") {
      console.log("worker stopped");
    }
  });

  worker.on("error", (e) => console.error("worker error:", e));
  worker.on("exit", (code) => {
    if (code !== 0) console.error(`worker exited with code ${code}`);
  });
  
  return {
    worker,
    stop: () => worker.postMessage({ type: "stop" }),
  };
}
