import path from "path";
import { Config, ConfigReq } from "../models/interfaces";
import {
  extractVlessConfigs,
  extractVmessConfigs,
  fetchRawConfigs,
} from "../services/utils/configs";
import fs from "fs";
import { Response } from "../models/interfaces";
import { generateV2rayConfigFromLink } from "../services/utils/generateV2rayJson";
import { findMultipleFreePorts } from "../services/utils/ports";

export async function handleConfigs(sub_data: ConfigReq): Response<Config[]> {
  try {
    const configsDir = path.join(process.cwd(), "configs");
    const outputPath = path.join(
      configsDir,
      sub_data.name.includes(".json") ? sub_data.name : sub_data.name + ".json"
    );
    if (!sub_data.url) {
      throw new Error("❌ No input URL provided.");
    }

    const decodedContent = await fetchRawConfigs(sub_data);

    // Ensure the configs directory exists
    if (!fs.existsSync(configsDir)) {
      fs.mkdirSync(configsDir);
    }

    const configs = extractVlessConfigs(decodedContent);
    configs.push(...extractVmessConfigs(decodedContent));
    console.log(`✅ Decoded content:\n`, configs);
    let ports = await findMultipleFreePorts(configs.length);

    // generating the v2ray full jsons
    configs.forEach((config, index) => {
      let v2rayJson = generateV2rayConfigFromLink(config.raw, ports[index]);
      config.json = v2rayJson;
    });

    // Save to file inside "configs/"
    fs.writeFileSync(outputPath, JSON.stringify(configs), "utf-8");
    console.log(`✅ Decoded content saved to "${outputPath}"`);

    return {
      code: 200,
      message: configs,
    };
  } catch (error) {
    console.error("❌ Error fetching or decoding:", error);
    return {
      code: 500,
      message: "Error fetching or decoding",
    };
  }
}
