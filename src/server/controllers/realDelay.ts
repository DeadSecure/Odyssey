import {
  Categories,
  RelayDelayResponse,
  SitesTestResponse,
} from "../models/interfaces";

import { testSite } from "../services/utils/access";
import { Response } from "../models/interfaces";
import { realDelayRoutes } from "../models/sources/realDelay";
export async function handleRealDelay(): Response<RelayDelayResponse[]> {
  let sites = realDelayRoutes;
  let results: RelayDelayResponse[] = [];
  for (const site of sites) {
    try {
      let res = await testSite(site.domain);
      console.log("result", res);
      results.push({
        host_name: site.name,
        real_delay: res.total ,
      });
      console.log("results", results);
    } catch (error) {
      continue;
    }
  }

  return {
    code: 200,
    message: results,
  };
}
