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
import { latencyBar } from "../models/client/bars";
import { parseLatencyBars } from "../services/utils/parser";

export async function handleRealDelay(
  username: string
): Response<latencyBar[]> {
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

  let results = (await Promise.all(promises)).flat();
  let parsed_results: latencyBar[] = parseLatencyBars(results);
  // console.log("these are the results", parsed_results);

  return {
    code: 200,
    message: parsed_results,
  };
}
