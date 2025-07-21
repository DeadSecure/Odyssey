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

export enum Categories {
  social = "social",
  finance = "finance",
  gaming = "gaming",
  dev = "dev",
}

type ErrorResponse<T> = {
  code: number;
  message: string | T;
};

type SuccessResponse<T> = {
  code: number;
  message: string | T;
};

export type Response<T> = Promise<SuccessResponse<T> | ErrorResponse<T>>;

export interface ConfigReq {
  name: string;
  url: string;
}

export interface Config {
  name: string;
  raw: string;
}