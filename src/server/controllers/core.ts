import path from "path";
import { CoreStartResponse, Response } from "../models/interfaces";
import { runXrayInThread } from "../services/utils/core";
import { PortManger } from "../services/utils/ports";
export async function handleCore(username: string): Response<string> {
  if (!username) throw new Error("❌ No username provided.");
  if (!path.join(process.cwd(), "configs", username, "combined.json"))
    throw new Error("❌ No combined.json file found.");

  let pid = runXrayInThread(
    path.join(process.cwd(), "configs", username, "combined.json")
  );
  PortManger.add(username, pid);
  return {
    code: 200,
    message: `Core started for ${username} with PID ${pid}`,
  };
}

export async function stopCore(username: string): Promise<Response<string>> {
  let pid = PortManger.get(username);
  if (!pid) throw new Error("❌ No PID provided.");

  try {
    process.kill(pid);
    PortManger.remove(username);
    return {
      code: 200,
      message: `Core stopped for PID ${pid}`,
    };
  } catch (error) {
    console.error("❌ Error stopping core:", error);
    return {
      code: 500,
      message: "Error stopping core",
    };
  }
}
