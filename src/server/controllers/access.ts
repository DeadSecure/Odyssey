import { Worker } from "worker_threads";
import path from "path";
import {
  socialRoutes,
  financeRoutes,
  gamingRoutes,
  devRoutes,
} from "@/server/models/sources/sources";
import { Categories, SitesTestResponse, Response } from "../models/interfaces";
import { getPortsByUsername } from "../services/utils/ports";
import { runWorker } from "../services/utils/workerHandler";
import { parseAccessBars } from "../services/utils/parser";
import { convertSitesTestResponseToConfigInput } from "../services/utils/barGenerator";
import { AccessBar, SiteMetadata, statusBar } from "../models/client/bars";
import {
  addChartsWithSlotsBatch,
  getGroupedCharts,
  getLast60ChartsGroupedByCategory,
  setGroupedCharts,
} from "../services/utils/dbOps";
import Database from "better-sqlite3";

export async function handleAccess(
  category: Categories,
  username: string
): Response<{ access: AccessBar[]; status: statusBar }> {
  // const sites: SiteMetadata[] =
  //   category === Categories.social
  //     ? socialRoutes
  //     : category === Categories.finance
  //     ? financeRoutes
  //     : category === Categories.gaming
  //     ? gamingRoutes
  //     : category === Categories.dev
  //     ? devRoutes
  //     : devRoutes.concat(socialRoutes, financeRoutes, gamingRoutes);

  // const ports = await getPortsByUsername(username);

  // const promises = ports.map((port) =>
  //   runWorker(
  //     path.resolve(process.cwd(), "src/server/services/utils/worker.js"),
  //     {
  //       port,
  //       sites,
  //       username,
  //     }
  //   )
  // );

  // const results = (await Promise.all(promises)).flat();

  // console.log("This are are the parsed results");

  // console.log("converting to access chart ...");

  // let converted = convertSitesTestResponseToConfigInput(results, sites);

  // console.log("adding to db ...");

  // addChartsWithSlotsBatch(converted, db);

  // console.log("done");
  // console.log("setting the access result in the db ...");

  // setGroupedCharts(db, results);
  // console.log("done");

  const dbPath = path.resolve(process.cwd(), "configs", username, "db.sqlite");
  const db = new Database(dbPath);

  let statusResult = getLast60ChartsGroupedByCategory(db);

  let accessWitLatencyResult = getGroupedCharts(db);

  console.log("here are the latency bars", accessWitLatencyResult);

  db.close();

  return {
    code: 200,
    message: {
      access: parseAccessBars(accessWitLatencyResult),
      status: statusResult,
    },
  };
}
