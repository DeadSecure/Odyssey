import { curlFormat, SitesTestResponse } from "../../models/interfaces";
import { spawn } from "child_process";

export function testSite(site: string, port: number): Promise<SitesTestResponse> {
  return new Promise((resolve) => {
    console.log(`Testing: ${site}`);

    const curlArgs = [
      "-o", "/dev/null",
      "-s",
      "-w", curlFormat,
      "--socks5-hostname", `localhost:${port}`,
      site,
    ];

    const child = spawn("curl", curlArgs, { env: process.env });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", () => {
      if (stderr || !stdout) {
        console.error(`Error testing ${site}: ${stderr}`);
        return resolve({
          namelookup: -1,
          connect: -1,
          starttransfer: -1,
          total: -1,
          url: "",
          config_name: "",
          config_raw: "",
        });
      }

      try {
        const parsed: SitesTestResponse = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (e) {
        console.warn(`Failed to parse response for ${site}:`, e);
        resolve({
          namelookup: -1,
          connect: -1,
          starttransfer: -1,
          total: -1,
          url: "",
          config_name: "",
          config_raw: "",
        });
      }
    });
  });
}


// upload
// curl -s -T 2mb.pdf \
//   -w "{\"speed_upload\": %{speed_upload}, \"time_total\": %{time_total}}\n" \
//   --socks5-hostname localhost:1080 https://httpbin.org/post \
//   -o /dev/null

// download
// curl -o /dev/null -s \
// -w '{"speed_download": %{speed_download}, "speed_upload": %{speed_upload}}\n' \
//  --socks5-hostname localhost:1080 https://cachefly.cachefly.net/2mb.test
