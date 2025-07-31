import { latencyBar, statusBar } from "@/server/models/client/status";
import { Categories, SitesTestResponse } from "@/server/models/interfaces";

export async function parseStatusBars(
  site_res: SitesTestResponse[]
): Promise<statusBar[]> {
  const statusMap: Record<
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
    if (!statusMap[name]) {
      statusMap[name] = {
        name,
        country,
        site: {},
        totalTests: 0,
        successCount: 0,
      };
    }

    const entry = statusMap[name];

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

  // Convert map to array of statusBar with final percentage
  return Object.values(statusMap).map((entry) => ({
    name: entry.name,
    country: entry.country,
    site: entry.site,
    percentage: Math.round((entry.successCount / entry.totalTests) * 100),
  }));
}

async function parseLatencyBars(
  site_res: SitesTestResponse[]
): Promise<latencyBar[]> {
  const latencyMap: Record<
    string,
    {
      name: string;
      country: string;
      site: Record<string, number>;
      totalTests: number;
      successCount: number;
    }
  > = {};

  for (const item of site_res) {
    const name = item.config_name ?? "Unknown";
    const country = item.country ?? "Unknown";
    const latency = (item.starttransfer + item.total) / 2;
    const url = item.url;

    // Create entry if not exist
    if (!latencyMap[name]) {
      latencyMap[name] = {
        name,
        country,
        site: { [url]: latency },
        totalTests: 0,
        successCount: 0,
      };
    }

    const entry = latencyMap[name];
 
    // Count total and successful tests
    entry.totalTests++;
    if (latency > 0) {
      entry.successCount++;
    }
  }

  console.log(latencyMap);

  // Convert map to array of statusBar with final percentage
  return Object.values(latencyMap).map((entry) => ({
    name: entry.name,
    country: entry.country,
    site: entry.site,
    latency: Math.round(entry.successCount / entry.totalTests),
  }));
}
