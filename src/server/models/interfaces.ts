export const curlFormat = `{"namelookup": %{time_namelookup}, "connect": %{time_connect}, "starttransfer": %{time_starttransfer}, "total": %{time_total}, "size_upload": %{size_upload}, "size_download": %{size_download}, "speed_upload": %{speed_upload}, "speed_download": %{speed_download}, "url": "%{url}", "ip": "%{remote_ip}"}`;

export interface SitesTestResponse {
  namelookup: number;
  connect: number;
  starttransfer: number;
  total: number;
  url: string;
  config_name?: string;
  config_raw?: string;
  country?: string;
  ip: string;
  category: Categories;
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
  json?: any;
  port?: number;
}

export interface RelayDelayResponse {
  host_name: string;
  config_name: string;
  config_raw: string;
  real_delay: number;
}

export interface CoreStartResponse {
  port: number;
  name: string;
}
