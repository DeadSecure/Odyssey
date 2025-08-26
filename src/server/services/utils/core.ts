import { spawn } from "child_process";
import path from "path";

/**
 * Spawns a new Xray-core process with the given config path.
 * @param configPath - Path to the JSON config file
 */
export function runXrayInThread(configPath: string): number {
  const fullPath = path.resolve(configPath);

  const child = spawn(
    "./src/server/services/core/xrayCore/xray",
    ["run", "-config", fullPath],
    {
      stdio: "inherit", // Inherit stdout/stderr so you can see output
      shell: true, // Run in a shell
    }
  );

  child.on("exit", (code) => {
    console.log(`Xray process exited with code ${code}`);
  });

  child.on("error", (err) => {
    console.error("Failed to start Xray process:", err);
  });

  if (child.pid) {
    return child.pid;
  } else {
    throw new Error("Failed to start Xray process");
  }
}
