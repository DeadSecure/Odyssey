import { exec } from "child_process";

const sites = [
  "https://youtube.com",
  "https://instagram.com",
  "https://twitter.com",
];

const curlFormat = [
  "namelookup: %{time_namelookup}s",
  "connect: %{time_connect}s",
  "starttransfer: %{time_starttransfer}s",
  "total: %{time_total}s",
  "",
].join("\n");

function testSite(site: string): Promise<void> {
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
      console.log(stdout);
      resolve();
    });
  });
}

async function main() {
  for (const site of sites) {
    try {
      await testSite(site);
    } catch {
      // Continue with next site on error
    }
  }
}

main();
