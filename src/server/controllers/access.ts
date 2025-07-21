import { Categories, SitesTestResponse } from "../models/interfaces";
import {
  socialRoutes,
  financeRoutes,
  gamingRoutes,
  devRoutes,
} from "@/server/models/sources/sources";
import { testSite } from "../services/utils/access";
import { Response } from "../models/interfaces";
export async function HandleAccess(
  category: Categories
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

  for (const site of sites) {
    try {
      let res = await testSite(site.domain);
      results.push(res);
    } catch (error) {
      continue;
    }
  }

  return {
    code: 200,
    message: results,
  };
}
