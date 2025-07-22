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

export async function handleRealDelay(
  username: string
): Response<RelayDelayResponse[]> {
  let ports = await getPortsByUsername(username);
  let sites = realDelayRoutes;
  let results: RelayDelayResponse[] = [];
  console.log(ports, sites);
  for (const port of ports) {
    for (const site of sites) {
      try {
        let res = await testSite(site.domain, port);
        console.log("this is the test site result", res);
        let config = await getConfigLinkByPort(username, port);
        console.log("this is the config link", config);
        results.push({
          host_name: site.name,
          real_delay: res.total,
          config_name: config.name,
          config_raw: config.raw,
        });
      } catch (error) {
        console.log("error", error);
        continue;
      }
    }
  }
  console.log("results");
  console.log(results);
  return {
    code: 200,
    message: results,
  };
}
