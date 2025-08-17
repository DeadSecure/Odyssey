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
  const dbPath = path.resolve(process.cwd(), "configs", username, "db.sqlite");
  const db = new Database(dbPath);

  let statusResult = getLast60ChartsGroupedByCategory(db);

  let accessWitLatencyResult = getGroupedCharts(db);

  db.close();

  return {
    code: 200,
    message: {
      access: parseAccessBars(accessWitLatencyResult),
      status: statusResult,
    },
  };
}
