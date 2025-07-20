import https from "https";
import fs from "fs";
import path from "path";

// CLI args: node get-configs.ts no1_javad.txt https://example.com/sub/...
const outputFileName = process.argv[2] || "output.txt";
const inputUrl = process.argv[3] || "";

const configsDir = path.join(process.cwd(), "configs");
const outputPath = path.join(
  configsDir,
  outputFileName.includes(".json") ? outputFileName : outputFileName + ".json"
);

async function fetchAndDecode(): Promise<string> {
  if (!inputUrl) {
    throw new Error("❌ No input URL provided.");
  }

  return new Promise((resolve, reject) => {
    https.get(inputUrl, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const decoded = Buffer.from(data, "base64").toString("utf-8");
          resolve(decoded);
        } catch (err) {
          reject(err);
        }
      });

      res.on("error", (err) => {
        reject(err);
      });
    });
  });
}

function extractVmessConfigs(input: string): { name: string; raw: string }[] {
  const vmessRegex = /vmess:\/\/([^\s]+)/g;
  const matches = [...input.matchAll(vmessRegex)];

  return matches.map(match => {
    const encoded = match[1];
    try {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const json = JSON.parse(decoded);
      return {
        name: json.ps || 'Unnamed',
        raw: match[0]
      };
    } catch {
      return {
        name: 'Invalid VMESS Config',
        raw: match[0]
      };
    }
  });
}

function extractVlessConfigs(input: string): { name: string; raw: string }[] {
  const vlessRegex = /vless:\/\/[^\s]+/g;
  const matches = input.match(vlessRegex) || [];

  return matches.map(link => {
    const name = decodeURIComponent(link.split('#')[1] || 'Unnamed');
    return { name, raw: link };
  });
}

// Combine
function extractAllConfigs(input: string) {
  return {
    vmess: extractVmessConfigs(input),
    vless: extractVlessConfigs(input)
  };
}



(async () => {
  try {
    const decodedContent = await fetchAndDecode();

    // Ensure the configs directory exists
    if (!fs.existsSync(configsDir)) {
      fs.mkdirSync(configsDir);
    }

    const configs = await extractVlessConfigs(decodedContent);
    configs.push(...extractVmessConfigs(decodedContent));
    console.log(`✅ Decoded content:\n`, configs);
    // Save to file inside "configs/"
    fs.writeFileSync(outputPath, JSON.stringify(configs), "utf-8");
    console.log(`✅ Decoded content saved to "${outputPath}"`);
  } catch (error) {
    console.error("❌ Error fetching or decoding:", error);
  }
})();


