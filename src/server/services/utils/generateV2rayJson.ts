import * as process from 'process';
import { URL } from 'url';

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
    host: url.searchParams.get('host') || undefined,
    path: url.searchParams.get('path') || undefined,
    security: url.searchParams.get('security') || 'none',
    type: url.searchParams.get('type') || 'tcp',
    headerType: url.searchParams.get('headerType') || 'none',
  };
}

export function generateV2rayConfigFromLink(link: string, inboundPort: number): any {
  if (link.startsWith('vmess://')) {
    const vmess = decodeVmessLink(link);
    return generateV2rayConfigFromVmess(vmess, inboundPort);
  } else if (link.startsWith('vless://')) {
    const vless = decodeVlessLink(link);
    return generateV2rayConfigFromVless(vless, inboundPort);
  } else {
    throw new Error('Unsupported link type');
  }
}

function generateV2rayConfigFromVmess(vmess: VmessLink, inboundPort: number): any {
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

function generateV2rayConfigFromVless(vless: VlessLink, inboundPort: number): any {
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
