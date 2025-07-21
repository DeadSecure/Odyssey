import { Categories, SitesTestResponse } from "../models/interfaces";
import {
  socialRoutes,
  financeRoutes,
  gamingRoutes,
  devRoutes,
} from "@/server/models/sources/sources";
import { testSite } from "../services/utils/access";
import { Response } from "../models/interfaces";
import {
  getConfigLinkByPort,
  getPortsByUsername,
} from "../services/utils/ports";
export async function handleAccess(
  category: Categories,
  username: string
): Response<SitesTestResponse[]> {
  let sites =
    category === Categories.social
      ? socialRoutes
      : category === Categories.finance
      ? financeRoutes
      : category === Categories.gaming
      ? gamingRoutes
      : devRoutes;
  let results: SitesTestResponse[] = [];
  let ports = await getPortsByUsername(username);

  console.log(sites);
  for (const port of ports) {
    for (const site of sites) {
      try {
        let res = await testSite(site.domain, port);
        let config = await getConfigLinkByPort(username, port);
        results.push({
          ...res,
          config_name: config.name,
          config_raw: config.raw,
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
