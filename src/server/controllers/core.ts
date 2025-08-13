import path from "path";
import { Categories, CoreStartResponse, Response } from "../models/interfaces";
import { runXrayInThread } from "../services/utils/core";
import { PortManger } from "../services/utils/ports";
import { startTester } from "../services/utils/testerHandler";
export async function handleCore(username: string): Response<string> {
  if (!username) throw new Error("❌ No username provided.");
  if (!path.join(process.cwd(), "configs", username, "combined.json"))
    throw new Error("❌ No combined.json file found.");

  let core_pid = runXrayInThread(
    path.join(process.cwd(), "configs", username, "combined.json")
  );

  let tester_pid = startTester({
    username: username,
    intervalMs: 60000,
  });

  PortManger.add(`${username}_core`, core_pid);
  PortManger.add(`${username}_tester`, tester_pid.worker.threadId);

  return {
    code: 200,
    message: `${username} service started 
    Core PID: ${core_pid}
    tester PID: ${tester_pid.worker.threadId}`,
  };
}

export async function stopCore(username: string): Promise<Response<string>> {
  let core_pid = PortManger.get(`${username}_core`);
  if (!core_pid) throw new Error("❌ No PID provided.");
  let tester_pid = PortManger.get(`${username}_tester`);
  if (!tester_pid) throw new Error("❌ No tester PID found.");

  try {
    process.kill(core_pid);
    process.kill(tester_pid);
    PortManger.remove(`${username}_core`);
    PortManger.remove(`${username}_tester`);
    return {
      code: 200,
      message: `${username} service stopped !`,
    };
  } catch (error) {
    console.error("❌ Error stopping core:", error);
    return {
      code: 500,
      message: "Error stopping core",
    };
  }
}
