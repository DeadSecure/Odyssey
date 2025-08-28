import { spawn } from "child_process";
import path from "path";

/**
 * Spawns a new Xray-core process fully detached from the wizard.
 * @param configPath - Path to the JSON config file
 */
export function runXrayInThread(configPath: string): number {
  const fullPath = path.resolve(configPath);

  const child = spawn(
    "./src/server/services/core/xrayCore/xray",
    ["run", "-config", fullPath],
    {
      stdio: "ignore",  
      detached: true, 
      shell: true,
    }
  );

  child.unref(); 
  if (child.pid) {
    console.log(`✔ Xray started (PID: ${child.pid})`);
    return child.pid;
  } else {
    throw new Error("Failed to start Xray process");
  }
}
