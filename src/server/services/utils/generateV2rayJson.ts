import * as process from 'process';

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

export function decodeVmessLink(link: string): VmessLink {
  if (!link.startsWith("vmess://")) {
    throw new Error("Invalid vmess link");
  }

  const base64 = link.replace("vmess://", "").trim();
  const jsonStr = Buffer.from(base64, "base64").toString("utf-8");

  return JSON.parse(jsonStr);
}

export function generateV2rayConfig(vmess: VmessLink, inboundPort: number): any {
  const config = {
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
      {
        protocol: "freedom",
        tag: "direct",
      },
      {
        protocol: "blackhole",
        tag: "block",
      },
    ],
  };

  return config;
}

