// import { Config } from "@/server/models/interfaces";

interface Config {
  inbounds: Array<Inbound>;
  outbounds: Array<Outbound>;
  routing?: {
    rules?: Array<RoutingRule>;
  };
}

interface Inbound {
  tag: string;
  protocol: string;
  streamSettings?: {
    network?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Outbound {
  tag: string;
  protocol: string;
  streamSettings?: {
    network?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface RoutingRule {
  outboundTag: string;
  [key: string]: any;
}

function removeWsConfigs(config: Config): Config {
  // Helper to detect if an inbound/outbound is WS-based
  function isWsConfig(entry: Inbound | Outbound): boolean {
    const isWsProtocol = entry.protocol === "vless" || entry.protocol === "vmess";
    const isWsNetwork = entry.streamSettings?.network === "ws";
    const hasWsTag = typeof entry.tag === "string" && /ws/i.test(entry.tag);
    return isWsProtocol && (isWsNetwork || hasWsTag);
  }

  // Find all WS tags from inbounds and outbounds to remove them later from routing rules
  const wsInboundTags = new Set(
    config.inbounds.filter(isWsConfig).map((inb) => inb.tag)
  );
  const wsOutboundTags = new Set(
    config.outbounds.filter(isWsConfig).map((outb) => outb.tag)
  );

  // Filter inbounds and outbounds removing WS entries
  const filteredInbounds = config.inbounds.filter((inb) => !isWsConfig(inb));
  const filteredOutbounds = config.outbounds.filter((outb) => !isWsConfig(outb));

  // Filter routing rules referencing removed outbounds
  let filteredRoutingRules = config.routing?.rules ?? [];
  filteredRoutingRules = filteredRoutingRules.filter(
    (rule) => !wsOutboundTags.has(rule.outboundTag)
  );

  // Return new config object
  return {
    ...config,
    inbounds: filteredInbounds,
    outbounds: filteredOutbounds,
    routing: {
      ...config.routing,
      rules: filteredRoutingRules,
    },
  };
}
