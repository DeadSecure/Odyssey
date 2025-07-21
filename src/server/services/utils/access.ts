import { curlFormat, SitesTestResponse } from "@/server/models/interfaces";
import { exec } from "child_process";

export function testSite(site: string, port: number): Promise<SitesTestResponse> {
  return new Promise((resolve, reject) => {
    console.log(`Testing: ${site}`);

    const cmd = `curl -o /dev/null -s -w ${curlFormat} --socks5 localhost:${port} "${site}"`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error testing ${site}:`, error.message);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Stderr for ${site}:`, stderr);
      }

      let formatted_res: SitesTestResponse = JSON.parse(stdout);
      if (!formatted_res) {
        reject(new Error("Invalid response from curl"));
      }
      resolve(formatted_res);
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
