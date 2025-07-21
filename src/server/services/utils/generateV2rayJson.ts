import * as process from "process";
import { URL } from "url";
import * as fs from "fs/promises";
import * as path from "path";

interface VmessLink {
  add: string;
  aid?: string;
  host?: string;
  id: string;
  net: string;
  path?: string;
  port: number;
  ps?: string;
  scy?: string;
  tls?: string;
  type?: string;
  v?: string;
}

interface VlessLink {
  address: string;
  port: number;
  id: string;
  host?: string;
  path?: string;
  security?: string;
  type?: string;
  headerType?: string;
}

export function decodeVmessLink(link: string): VmessLink {
  const base64 = link.replace("vmess://", "").trim();
  const jsonStr = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(jsonStr);
}

export function decodeVlessLink(link: string): VlessLink {
  const url = new URL(link);
  return {
    address: url.hostname,
    port: Number(url.port),
    id: url.username,
    host: url.searchParams.get("host") || undefined,
    path: url.searchParams.get("path") || undefined,
    security: url.searchParams.get("security") || "none",
    type: url.searchParams.get("type") || "tcp",
    headerType: url.searchParams.get("headerType") || "none",
  };
}

export function generateV2rayConfigFromLink(
  link: string,
  inboundPort: number
): any {
  if (link.startsWith("vmess://")) {
    const vmess = decodeVmessLink(link);
    return generateV2rayConfigFromVmess(vmess, inboundPort);
  } else if (link.startsWith("vless://")) {
    const vless = decodeVlessLink(link);
    return generateV2rayConfigFromVless(vless, inboundPort);
  } else {
    throw new Error("Unsupported link type");
  }
}

function generateV2rayConfigFromVmess(
  vmess: VmessLink,
  inboundPort: number
): any {
  return {
    inbounds: [
      {
        listen: "127.0.0.1",
        port: inboundPort,
        protocol: "socks",
        settings: {
          auth: "noauth",
          udp: true,
        },
        tag: "socks",
      },
    ],
    outbounds: [
      {
        protocol: "vmess",
        settings: {
          vnext: [
            {
              address: vmess.add,
              port: vmess.port,
              users: [
                {
                  id: vmess.id,
                  alterId: parseInt(vmess.aid || "0"),
                  security: vmess.scy || "auto",
                },
              ],
            },
          ],
        },
        streamSettings: {
          network: vmess.net,
          security: vmess.tls === "none" ? "none" : vmess.tls || "none",
          [`${vmess.net}Settings`]: {
            header: {
              type: vmess.type || "none",
              request: {
                path: vmess.path ? [vmess.path] : [],
                headers: {
                  Host: vmess.host ? [vmess.host] : [],
                },
              },
            },
          },
        },
        tag: "proxy",
      },
      { protocol: "freedom", tag: "direct" },
      { protocol: "blackhole", tag: "block" },
    ],
  };
}

function generateV2rayConfigFromVless(
  vless: VlessLink,
  inboundPort: number
): any {
  return {
    inbounds: [
      {
        listen: "127.0.0.1",
        port: inboundPort,
        protocol: "socks",
        settings: {
          auth: "noauth",
          udp: true,
        },
        tag: "socks",
      },
    ],
    outbounds: [
      {
        protocol: "vless",
        settings: {
          vnext: [
            {
              address: vless.address,
              port: vless.port,
              users: [
                {
                  id: vless.id,
                  encryption: "none",
                },
              ],
            },
          ],
        },
        streamSettings: {
          network: vless.type,
          security: vless.security,
          [`${vless.type}Settings`]: {
            header: {
              type: vless.headerType,
              request: {
                path: vless.path ? [decodeURIComponent(vless.path)] : [],
                headers: {
                  Host: vless.host ? [vless.host] : [],
                },
              },
            },
          },
        },
        tag: "proxy",
      },
      { protocol: "freedom", tag: "direct" },
      { protocol: "blackhole", tag: "block" },
    ],
  };
}

interface V2RayConfig {
  inbounds: Array<any>;
  outbounds: Array<any>;
  routing?: {
    rules: Array<any>;
  };
}

export async function combineConfigs(username: string): Promise<V2RayConfig> {
  let jsons_path = path.join(process.cwd(), "configs", username, "json");
  const entries = await fs.readdir(jsons_path, { withFileTypes: true });
  // Filter to get only files (not subdirectories)
  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((file) => path.join(jsons_path, file.name));

  const combinedConfig: V2RayConfig = {
    inbounds: [],
    outbounds: [],
    routing: {
      rules: [],
    },
  };

  for (const file of filenames) {
    // Read & parse each config
    const content = await fs.readFile(file, "utf-8");
    const config: V2RayConfig = JSON.parse(content);

    const baseName = path.basename(file, path.extname(file));
    console.log(file);

    // Modify inbound tags
    const newInbounds = config.inbounds.map((inbound, index) => {
      // New tag pattern: <filename>_in
      return {
        ...inbound,
        tag: `${baseName}_in${index > 0 ? `_${index}` : ""}`,
      };
    });
    // Modify outbound tags
    const newOutbounds = config.outbounds.map((outbound, index) => {
      // New tag pattern: <filename>_out
      return {
        ...outbound,
        tag: `${baseName}_out${index > 0 ? `_${index}` : ""}`,
      };
    });

    combinedConfig.inbounds.push(...newInbounds);
    combinedConfig.outbounds.push(...newOutbounds);

    // Add routing rules: map inbound tags to outbound tags one-to-one
    for (let i = 0; i < newInbounds.length; i++) {
      // If there's corresponding outbound for this inbound index, map it
      if (newOutbounds[i]) {
        combinedConfig.routing!.rules.push({
          type: "field",
          inboundTag: [newInbounds[i].tag],
          outboundTag: newOutbounds[i].tag,
        });
      } else {
        // If no corresponding outbound, route inbound to freedom (direct)
        combinedConfig.routing!.rules.push({
          type: "field",
          inboundTag: [newInbounds[i].tag],
          outboundTag: "direct",
        });
      }
    }
  }

  // Ensure freedom and blackhole are present for fallback
  const hasFreedom = combinedConfig.outbounds.some((o) => o.tag === "direct");
  if (!hasFreedom) {
    combinedConfig.outbounds.push({
      protocol: "freedom",
      tag: "direct",
    });
  }
  const hasBlackhole = combinedConfig.outbounds.some((o) => o.tag === "block");
  if (!hasBlackhole) {
    combinedConfig.outbounds.push({
      protocol: "blackhole",
      tag: "block",
    });
  }

  return combinedConfig;
}
