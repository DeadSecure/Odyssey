import {
  Categories,
  RelayDelayResponse,
  SitesTestResponse,
} from "../models/interfaces";

import { testSite } from "../services/utils/access";
import { Response } from "../models/interfaces";
import { realDelayRoutes } from "../models/sources/realDelay";
import {
  getConfigLinkByPort,
  getPortsByUsername,
} from "../services/utils/ports";
import { runWorker } from "../services/utils/workerHandler";
import path from "path";

export async function handleRealDelay(
  username: string
): Response<SitesTestResponse[]> {
  let sites = realDelayRoutes;

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
