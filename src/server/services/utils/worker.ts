import { workerData, parentPort } from "worker_threads";
import { testSite } from "../utils/access";
import { getConfigLinkByPort } from "../utils/ports";

(async () => {
  try {
    const { port, sites, username } = workerData;
    const results = await Promise.all(
      sites.map(
        async (site: { name: string; domain: string; category: string }) => {
          try {
            const res = await testSite(site.domain, port);
            const config = await getConfigLinkByPort(username, port);
            return {
              ...res,
              config_name: config.name,
              config_raw: config.raw,
              category: site.category,
            };
          } catch (err) {
            console.warn(`Error testing site ${site.domain}:`, err);
            return null;
          }
        }
      )
    );
    parentPort?.postMessage(results.filter(Boolean));
  } catch (err) {
    console.error("Fatal worker error:", err);
    process.exit(1); // still exit but with visible reason
  }
})();
