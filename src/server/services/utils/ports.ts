import * as net from "net";
import path from "path";
import fs from "fs";
import { Config } from "@/server/models/interfaces";
/**
 * Finds a free TCP port by letting the OS assign one.
 */
function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref(); // Don't block the event loop
    server.on("error", reject);

    server.listen(0, () => {
      const address = server.address();
      if (typeof address === "object" && address?.port) {
        const port = address.port;
        server.close(() => resolve(port));
      } else {
        reject(new Error("Failed to get port"));
      }
    });
  });
}

/**
 * Finds a specific number of unique free ports.
 */
export async function findMultipleFreePorts(count: number): Promise<number[]> {
  const ports: Set<number> = new Set();

  while (ports.size < count) {
    try {
      const port = await findFreePort();
      ports.add(port);
    } catch (err) {
      console.error("Error finding port:", err);
    }
  }

  return Array.from(ports);
}

export async function getPortsByUsername(username: string): Promise<number[]> {
  let ports_path = path.join(
    process.cwd(),
    "configs",
    username,
    "json/ports.json"
  );
  if (!fs.existsSync(ports_path)) {
    throw new Error("No ports.json file found");
  }
  let ports: number[] = JSON.parse(fs.readFileSync(ports_path, "utf-8"));
  return ports;
}

export async function getConfigLinkByPort(
  username: string,
  port: number
): Promise<Config> {
  let configs_path = path.join(
    process.cwd(),
    "configs",
    username,
    username,
    ".json"
  );
  if (!fs.existsSync(configs_path)) {
    throw new Error(`No ${username}.json file found`);
  }
  let configs: Config[] = JSON.parse(fs.readFileSync(configs_path, "utf-8"));
  let config = configs.find((config) => config.port === port);
  if (!config) {
    throw new Error("No config found for port");
  }
  return config;
}
