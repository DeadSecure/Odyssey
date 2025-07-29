import { FlagsMap } from "../../models/sources/flagsMap";
import { curlFormat, SitesTestResponse } from "../../models/interfaces";
import { spawn } from "child_process";
import { t } from "i18next";

function runCurlCommand(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("curl", args, { env: process.env });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => (stdout += data.toString()));
    child.stderr.on("data", (data) => (stderr += data.toString()));

    child.on("close", () => {
      if (stderr || !stdout) return reject(stderr || "No output");
      resolve(stdout.trim());
    });
  });
}

export async function testSite(
  site: string,
  port: number
): Promise<SitesTestResponse> {
  console.log(`Testing: ${site}`);

  const curlArgs = [
    "-o",
    "/dev/null",
    "-s",
    "-w",
    curlFormat,
    "--socks5-hostname",
    `localhost:${port}`,
    site,
  ];

  const ipArgs = [
    "-s",
    "--socks5-hostname",
    `localhost:${port}`,
    "http://ip-api.com/json",
  ];

  try {
    const [curlOutput, ipOutput] = await Promise.all([
      runCurlCommand(curlArgs),
      runCurlCommand(ipArgs),
    ]);

    const parsedCurl: SitesTestResponse = JSON.parse(curlOutput);
    const parsedIp =
      typeof ipOutput === "object" ? ipOutput : JSON.parse(ipOutput);

    if (!parsedIp.query || !parsedIp.country) throw new Error("Bad IP data");

    parsedCurl.ip = parsedIp.query;
    parsedCurl.country = getCountryCode(parsedIp.country);

    return parsedCurl;
  } catch (err) {
    console.warn(`Failed testing ${site}:`, err);
    return {
      namelookup: -1,
      connect: -1,
      starttransfer: -1,
      total: -1,
      url: site,
      config_name: "",
      config_raw: "",
      country: "",
      ip: "",
      category: "" as any,
    };
  }
}

function getCountryCode(name: string): string {
  return FlagsMap[name as keyof typeof FlagsMap] ?? "Unknown";
}

