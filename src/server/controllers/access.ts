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

export async function handleAccess(
  category: Categories,
  username: string
): Response<SitesTestResponse[]> {
  const sites =
    category === Categories.social
      ? socialRoutes
      : category === Categories.finance
      ? financeRoutes
      : category === Categories.gaming
      ? gamingRoutes
      : devRoutes;

  const ports = await getPortsByUsername(username);

  const promises = ports.map((port) =>
    runWorker(
      path.resolve(process.cwd(), "src/server/services/utils/worker.js"),
      {
        port,
        sites,
        username,
      }
    )
  );

  const results = (await Promise.all(promises)).flat();

  return {
    code: 200,
    message: results,
  };
}
