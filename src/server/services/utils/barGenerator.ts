import { SiteMetadata } from "../../../server/models/client/bars";
import { ConfigInput, Slot } from "../../../server/models/client/db";
import { SitesTestResponse } from "../../../server/models/interfaces";

export function convertSitesTestResponseToConfigInput(
  responses: SitesTestResponse[],
  siteMetadata: SiteMetadata[],
  timestamp: string = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date())
): ConfigInput[] {
  // Step 1: Build a map from domain to site metadata
  const metadataMap = new Map<string, SiteMetadata>();
  for (const site of siteMetadata) {
    metadataMap.set(new URL(site.domain).hostname, site);
  }

  // Step 2: Group slots by category + config_name
  const grouped = new Map<string, Slot[]>();

  for (const res of responses) {
    const hostname = new URL(res.url).hostname;
    const meta = metadataMap.get(hostname);

    if (!meta) {
      console.warn(`No metadata found for domain: ${hostname}`);
      continue; 
    }

    const key = `${res.category}__${res.config_name ?? "DEFAULT_CONFIG"}`;

    const slot: Slot = {
      site_name: meta.name,
      up: 0 < Number((res.total + res.starttransfer) / 2) ? true : false,
      color: meta.color,
    };

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(slot);
  }

  // Step 3: Convert to ConfigInput[]
  const result: ConfigInput[] = [];

  for (const [key, slots] of grouped.entries()) {
    const [category, config_name] = key.split("__");

    result.push({
      category,
      config_name,
      charts: [
        {
          timestamp,
          slots,
        },
      ],
    });
  }

  return result;
}
