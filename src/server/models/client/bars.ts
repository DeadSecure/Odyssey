export interface AccessBar {
  name: string;
  percentage: number;
  country: string;
  site: Record<string, Record<string, number>>; // category to site to latency
}

export interface latencyBar {
  name: string;
  latency: number;
  country: string;
  site: Record<string, number>; // category to site to latency
}

export interface statusBar {
  finance: StatusTabWrapper;
  gaming: StatusTabWrapper;
  dev: StatusTabWrapper;
  social: StatusTabWrapper;
}

export type StatusTabWrapper = { config_name: string; chart: StatusTab[] }[];

export type StatusTab = {
  timestamp: string;
  slots: statusBarSlot[];
};
export type statusBarSlot = {
  site_name: string;
  up: boolean;
  color: string;
};

export type SiteMetadata = {
  name: string;
  domain: string;
  category: string;
  color: string;
};
