import path from "path";
import { CoreStartResponse, Response } from "../models/interfaces";
import { runXrayInThread } from "../services/utils/core";
export async function handleCore(username: string): Response<string> {
  if (!username) throw new Error("❌ No username provided.");
  if (!path.join(process.cwd(), "configs", username, "combined.json"))
    throw new Error("❌ No combined.json file found.");

  let pid = runXrayInThread(
    path.join(process.cwd(), "configs", username, "combined.json")
  );

  return {
    code: 200,
    message: `Core started for ${username} with PID ${pid}`,
  };
}
