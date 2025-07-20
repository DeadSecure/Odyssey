import { curlFormat, SitesTestResponse } from "@/server/models/interfaces";
import { exec } from "child_process";





function testSite(site: string): Promise<SitesTestResponse> {
  return new Promise((resolve, reject) => {
    console.log(`Testing: ${site}`);

    const cmd = `curl -o /dev/null -s -w "${curlFormat}" --socks5 localhost:1080 "${site}"`;

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
      console.log(stdout);
      resolve(formatted_res);
    });
  });
}

