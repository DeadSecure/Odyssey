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
import { parseStatusBars } from "../services/utils/parser";

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
      : category === Categories.dev
      ? devRoutes
      : devRoutes.concat(socialRoutes, financeRoutes, gamingRoutes);

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

  console.log("This are are the parsed results");

  (await parseStatusBars(results)).forEach((status) => {
    console.log(status.site);
  });
  
  return {
    code: 200,
    message: results,
  };
}
