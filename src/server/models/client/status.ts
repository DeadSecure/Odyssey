export interface statusBar {
  name: string;
  percentage: number;
  country: string;
  site: Record<string, Record<string, number>>; // category to site to latency
}
