import {
  Categories,
  RelayDelayResponse,
  SitesTestResponse,
} from "../models/interfaces";

import { testSite } from "../services/utils/access";
import { Response } from "../models/interfaces";
import { realDelayRoutes } from "../models/sources/realDelay";
import { getConfigLinkByPort, getPortsByUsername } from "../services/utils/ports";

export async function handleRealDelay(
  username: string
): Response<RelayDelayResponse[]> {
  let ports = await getPortsByUsername(username);
  let sites = realDelayRoutes;
  let results: RelayDelayResponse[] = [];
  
  for (const port of ports) {
    for (const site of sites) {
      try {
        let res = await testSite(site.domain, port);
        let config = await getConfigLinkByPort(username, port);
        results.push({
            host_name: site.name,
            real_delay: res.total,
            config_name: config.name,
            config_raw: config.raw
        });
      } catch (error) {
        continue;
      }
    }
  }

  return {
    code: 200,
    message: results,
  };
}
