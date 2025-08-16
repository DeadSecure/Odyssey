import { latencyBar, AccessBar } from "@/server/models/client/bars";
import { Categories, SitesTestResponse } from "@/server/models/interfaces";
import { realDelayRoutes } from "@/server/models/sources/realDelay";

export function parseAccessBars(site_res: SitesTestResponse[]): AccessBar[] {
  const accessMap: Record<
    string,
    {
      name: string;
      country: string;
      site: Record<string, Record<string, number>>;
      totalTests: number;
      successCount: number;
    }
  > = {};

  for (const item of site_res) {
    const name = item.config_name ?? "Unknown";
    const country = item.country ?? "Unknown";
    const latency = (item.starttransfer + item.total) / 2;
    const category = item.category;
    const url = item.url;

    // Create entry if not exist
    if (!accessMap[name]) {
      accessMap[name] = {
        name,
        country,
        site: {},
        totalTests: 0,
        successCount: 0,
      };
    }

    const entry = accessMap[name];

    // Add latency under category/url
    if (!entry.site[category]) {
      entry.site[category] = {};
    }
    entry.site[category][url] = latency;

    // Count total and successful tests
    entry.totalTests++;
    if (latency > 0) {
      entry.successCount++;
    }
  }

  // Convert map to array of AccessBar with final percentage
  return Object.values(accessMap).map((entry) => ({
    name: entry.name,
    country: entry.country,
    site: entry.site,
    percentage: Math.round((entry.successCount / entry.totalTests) * 100),
  }));
}

export function parseLatencyBars(site_res: SitesTestResponse[]): latencyBar[] {
  const latencyMap: Record<
    string,
    {
      name: string;
      country: string;
      site: Record<string, number>;
      totalPings: number[];
    }
  > = {};

  for (const item of site_res) {
    const name = item.config_name ?? "Unknown";
    const country = item.country ?? "Unknown";
    const latency = [(item.starttransfer + item.total) / 2];
    const url = item.src_name;

    // Create entry if not exist
    const existingSites = latencyMap[name]?.site ?? {};
    latencyMap[name] = {
      name,
      country,
      site: { ...existingSites, [url]: latency[0] },
      totalPings: latencyMap[name]?.totalPings
        ? latencyMap[name]?.totalPings.concat(latency)
        : latency,
    };
  }

  let bars: latencyBar[] = [];

  Object.keys(latencyMap).forEach((key) => {
    bars.push({
      name: latencyMap[key].name,
      latency:
        latencyMap[key].totalPings.reduce((a, b) => a + b, 0) /
        latencyMap[key].totalPings.length,
      country: latencyMap[key].country,
      site: latencyMap[key].site,
    });
  });

  return bars;
}
