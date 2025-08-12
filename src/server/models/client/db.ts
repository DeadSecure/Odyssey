export type Slot = {
  site_name: string;
  up: boolean;
  color: string;
};

export type ChartInput = {
  timestamp: string;
  slots: Slot[];
};

export type ConfigInput = {
  category: string;
  config_name: string;
  charts: ChartInput[];
};
