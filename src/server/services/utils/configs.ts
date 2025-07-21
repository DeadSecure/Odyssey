import https from "https";
import fs from "fs";
import path from "path";
import { Config, ConfigReq } from "@/server/models/interfaces";

export async function fetchRawConfigs(sub_Data: ConfigReq): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(sub_Data.url, (res) => {
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

export function extractVmessConfigs(
  input: string
): { name: string; raw: string }[] {
  const vmessRegex = /vmess:\/\/([^\s]+)/g;
  const matches = [...input.matchAll(vmessRegex)];

  return matches.map((match) => {
    const encoded = match[1];
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const json = JSON.parse(decoded);
      return {
        name: json.ps || "Unnamed",
        raw: match[0],
      };
    } catch {
      return {
        name: "Invalid VMESS Config",
        raw: match[0],
      };
    }
  });
}

export function extractVlessConfigs(
  input: string
): Config[] {
  const vlessRegex = /vless:\/\/[^\s]+/g;
  const matches = input.match(vlessRegex) || [];

  return matches.map((link) => {
    const name = decodeURIComponent(link.split("#")[1] || "Unnamed");
    return { name, raw: link };
  });
}


