import path from "path";
import { Config, ConfigReq } from "../models/interfaces";
import {
  extractVlessConfigs,
  extractVmessConfigs,
  fetchRawConfigs,
} from "../services/utils/configs";
import fs from "fs";
import { Response } from "../models/interfaces";
import {
  combineConfigs,
  generateV2rayConfigFromLink,
} from "../services/utils/generateV2rayJson";
import { findMultipleFreePorts } from "../services/utils/ports";
import { setupDb } from "../services/utils/setupDb";

export async function handleConfigs(sub_data: ConfigReq): Response<Config[]> {
  try {
    const configsDir = path.join(process.cwd(), "configs");
    const exclusiveDir = path.join(configsDir, sub_data.name);
    const jsonDir = path.join(exclusiveDir, "json");
    const portsDir = path.join(exclusiveDir, "ports.json");
    const combinedDir = path.join(exclusiveDir, "combined.json");
    const outputPath = path.join(
      exclusiveDir,
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
    if (!fs.existsSync(exclusiveDir)) {
      fs.mkdirSync(exclusiveDir);
    }
    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir);
    }

    const configs = extractVlessConfigs(decodedContent);
    configs.push(...extractVmessConfigs(decodedContent));
    console.log(`✅ Decoded content from sub link:\n`, configs.map(c => `${c.name}\n`));
    let ports = await findMultipleFreePorts(configs.length);

    // generating the v2ray full jsons
    configs.forEach((config, index) => {
      let v2rayJson = generateV2rayConfigFromLink(config.raw, ports[index]);
      config.json = v2rayJson;
      config.port = ports[index];
    });

    // Save to file inside "configs/"
    fs.writeFileSync(outputPath, JSON.stringify(configs), "utf-8");

    // generating and writing the json files
    configs.forEach((config, index) => {
      fs.writeFileSync(
        path.join(jsonDir, config.name + ".json"),
        JSON.stringify(config.json),
        "utf-8"
      );
    });

    // saving the combined file
    let combinedConfig = await combineConfigs(sub_data.name);
    fs.writeFileSync(combinedDir, JSON.stringify(combinedConfig[0]), "utf-8");

    // save the ports.json file
    fs.writeFileSync(portsDir, JSON.stringify(combinedConfig[1]), "utf-8");


    // initiating the db for the config if doesn't exists already
    await setupDb(exclusiveDir); 

    console.log(`✅ Configs saved to "${outputPath}" and "${jsonDir}"`);



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
