export const curlFormat = [
  "namelookup: %{time_namelookup}s",
  "connect: %{time_connect}s",
  "starttransfer: %{time_starttransfer}s",
  "total: %{time_total}s",
  "",
].join("\n");

export interface SitesTestResponse {
  namelookup: number;
  connect: number;
  starttransfer: number;
  total: number;  
  url: string;
}