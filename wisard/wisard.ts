#!/usr/bin/env ts-node

import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import axios from "axios";
import { exec } from "child_process";
import kill from "tree-kill";
import { promisify } from "util";
import dotenv from "dotenv";
const PID_FILE = path.join(process.cwd(), ".odyssey.pid");

function showLogo() {
  const text = figlet.textSync("ODYSSEY", { font: "Big" });
  console.log(gradient.pastel.multiline(text));
}

async function waitForServer(
  url: string,
  retries = 20,
  delay = 3000
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      let response = await axios.get(url, { timeout: 3000 }); // HEAD request with timeout
      console.log("✔ Server is up!");
      return true;
    } catch {
      console.log(`⏳ Waiting for server... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
      if (i === retries - 1) {
        console.log("❌ Server did not start in time");
        return false;
      }
    }
  }
  throw new Error("Server did not start in time");
}

// Function to start the base Odyssey server
async function startBaseServer() {
  // Check if already running
  if (fs.existsSync(PID_FILE)) {
    const existingPid = parseInt(fs.readFileSync(PID_FILE, "utf-8"));
    try {
      process.kill(existingPid, 0); // check if process exists
      console.log(`⚠️ Odyssey server is already running (PID ${existingPid})`);
      return existingPid;
    } catch {
      console.log("⚠️ Found stale PID file, removing...");
      fs.unlinkSync(PID_FILE);
    }
  }

  console.log("▶️ Starting Odyssey server...");
  const nextPath = execSync("npx --no-install which next", {
    encoding: "utf-8",
  }).trim();

  console.log("nextPath", nextPath);

  const devProcess = spawn(nextPath, ["dev", "--turbo"], {
    cwd: process.cwd(),
    stdio: "ignore",
    detached: true,
  });

  devProcess.unref();
  let pid_tp_write = devProcess.pid?.toString();
  if (!pid_tp_write) {
    console.error("❌ Failed to start Odyssey server: No PID");
    return;
  }
  fs.writeFileSync(PID_FILE, pid_tp_write, "utf-8");
  console.log(`✔ Odyssey server started (PID ${devProcess.pid})`);
  return devProcess.pid;
}

// Function to stop the base Odyssey server
function stopBaseServer() {
  if (!fs.existsSync(PID_FILE)) {
    console.log("⚠️ No PID file found. Odyssey server may not be running.");
    return;
  }

  const pid = parseInt(fs.readFileSync(PID_FILE, "utf-8"));
  try {
    kill(pid, "SIGTERM", (err) => {
      if (err) {
        console.warn("⚠️ Failed to kill Odyssey server:", err.message);
      } else {
        console.log(`🛑 Odyssey server stopped (PID ${pid})`);
        fs.unlinkSync(PID_FILE);
      }
    });
  } catch (err: any) {
    console.warn("⚠️ Error stopping Odyssey server:", err.message);
    fs.unlinkSync(PID_FILE);
  }

  // Kill any Xray processes
  try {
    const { execSync } = require("child_process");
    execSync('pkill -f "xray run -config"');
    console.log("✔ Xray processes stopped.");
  } catch (err: any) {
    console.warn(
      "⚠️ No Xray processes were running or failed to stop:",
      err.message
    );
  }
}

// let devProcess: ReturnType<typeof spawn> | null = null;
async function addService() {
  try {
    let params = {
      subLink: "",
      name: "",
      tgSupportId: "",
    };
    // Step 1: Ask user
    params.subLink = (
      (await inquirer.prompt([
        {
          type: "input",
          name: "subLink",
          message: "Enter the sub link(unlimited in days and traffic):",
          validate: (input) =>
            input.trim() !== "" || "sub link cannot be empty",
        },
      ])) as { subLink: string }
    ).subLink;
    if (params.subLink.trim().toLowerCase() === "back") {
      return;
    }
    params.name = (
      (await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Enter a name for this service:",
          validate: (input) => input.trim() !== "" || "Name cannot be empty",
        },
      ])) as { name: string }
    ).name;

    if (params.name.trim().toLowerCase() === "back") {
      return;
    }
    params.tgSupportId = (
      (await inquirer.prompt([
        {
          type: "input",
          name: "tgSupportId",
          message: "Enter the Telegram support id (eg. @PolNetSupport):",
          validate: (input) => {
            return input.trim() !== "" || "Telegram support id cannot be empty";
          },
        },
      ])) as { tgSupportId: string }
    ).tgSupportId;

    if (params.tgSupportId.trim().toLowerCase() === "back") {
      return;
    }
    await inquirer.prompt([
      {
        type: "confirm",
        name: "pic",
        message: (answers) =>
          `make sure your profile pic is in: public/profilePic/${params.name}.png then press Enter`,
      },
    ]);

    let res = await waitForServer("http://localhost:3000/api/health", 3);

    if (!res) {
      await startBaseServer();
    }

    try {
      await axios.post("http://localhost:3000/api/config", {
        url: params.subLink,
        name: params.name,
      });
    } catch (err: any) {
      console.error(
        "⚠️ Failed to send config:",
        err.message,
        "\ntry deleting and re adding the service details"
      );
    }

    // Step 4: BreathDelay
    let BreathDelay = 60; // default
    const dirPath = `./configs/${params.name}/json`;
    try {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        const count = files.filter((f) =>
          fs.statSync(path.join(dirPath, f)).isFile()
        ).length;
        BreathDelay = count * 10 || BreathDelay;
      } else {
        console.warn(
          "⚠️ Config directory not found, using default BreathDelay",
          "\ntry deleting and re adding the service details"
        );
      }
    } catch (err: any) {
      console.error("⚠️ Could not calculate BreathDelay:", err.message);
    }
    let page_content = `import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClientBarsWrapper from "@/components/ui/clientWrapper";
import ClientLayout from "@/components/layout/clientLayout";
import { useEffect, useState } from "react";
import { latencyBar, AccessBar, statusBar } from "@/server/models/client/bars";
import { Categories, SitesTestResponse } from "@/server/models/interfaces";
import { parseAccessBars } from "@/server/services/utils/parser";
import { FSLogger } from "@/server/services/utils/logger";
import {
  fetchAccessAndStatusBars,
  fetchLatencyBars,
} from "@/server/services/utils/bridge";
type Props = {
  AccessBars: AccessBar[];
  LatencyBars: latencyBar[];
  StatusBars: statusBar;
  breathDelay: number;
};
import raw_config from "./config.json";
import { ProviderConfig } from "@/server/models/client/provider";
import axios from "axios";
import CoreDownOverlay from "@/components/ui/coreNotRunnings";
const config: ProviderConfig = raw_config;

export default function Page({
  AccessBars,
  StatusBars,
  LatencyBars,
  breathDelay,
}: Props) {
  const [accessBars, setAccessBars] = useState<AccessBar[]>(AccessBars);
  const [latencyBars, setLatencyBars] = useState<latencyBar[]>(LatencyBars);
  const [statusBars, setStatusBars] = useState<statusBar>(StatusBars);
  const [coreStatus, setCoreStatus] = useState<boolean>(true);
  
  const [breathDelayToPass, setBreathDelayToPass] =
    useState<number>(breathDelay);
  const [previousBars, setPreviousBars] = useState<{
    AccessBars: AccessBar[];
    LatencyBars: latencyBar[];
    StatusBars: statusBar;
  }>({ AccessBars, LatencyBars, StatusBars });
  const [timeToRender, setTimeToRender] = useState<boolean>(true);
  useEffect(() => {
    const tab_knob = document.querySelector(".tab-knob");
    const mode = document.querySelector(".toggle-knob")?.classList;
    if (tab_knob && mode) {
      if (mode.contains("dark")) {
        tab_knob.classList.add("dark");
        tab_knob.classList.remove("light");
      } else if (mode.contains("light")) {
        tab_knob.classList.add("light");
        tab_knob.classList.remove("dark");
      }
    }
    if (!timeToRender) return;
    const fetchData = async () => {
    const res: Record<string, number> = (
        await axios.get("/api/cores")
      ).data;

      if (!res[\`\${config.name}_core\`]) {
        console.error(
          \`❌ Service \${config.name} is not running, start it before stopping it.\`
        );
        setCoreStatus(false);
        return;
  } else {
        setCoreStatus(true);
  }

      setAccessBars(previousBars.AccessBars);
      setLatencyBars(previousBars.LatencyBars);
      setStatusBars(previousBars.StatusBars);
      const access_and_status = await fetchAccessAndStatusBars(config.name);
      const latency = await fetchLatencyBars(config.name);
      setPreviousBars({
        AccessBars: access_and_status.access,
        LatencyBars: latency,
        StatusBars: access_and_status.status,
      });
      setTimeToRender(false);
      setBreathDelayToPass((prev) =>
        prev === breathDelay ? prev - 1 : breathDelay
      );
      setTimeout(() => setTimeToRender(true), breathDelay * 1000);
    };
    fetchData();
  }, [timeToRender, breathDelay]);
  return (
    <ClientLayout
      name={config.name}
      logo={\`/profilePic/\${config.name}.png\`}
      bars={{
        AccessBars: accessBars,
        latencyBars: latencyBars,
        statusBars: statusBars,
      }}
      delay={breathDelayToPass}
      support_link={config.tg_support_link}
    >
      {coreStatus ? (
              <ClientBarsWrapper />
            ) : (
              <CoreDownOverlay link={config.tg_support_link} />
            )}
    </ClientLayout>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let access_and_status = await fetchAccessAndStatusBars(config.name);
  const logger = new FSLogger(\`\${config.name}Logs\`);
  logger.log({
    access: access_and_status.access,
    status: access_and_status.status,
  });
  let latency = await fetchLatencyBars(config.name);
  return {
    props: {
      AccessBars: access_and_status.access,
      StatusBars: access_and_status.status,
      LatencyBars: latency,
      breathDelay: 40,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: 60,
  };
};`;

    let config_content = `{
  "name": "${params.name}",
  "subscription_link": "${params.subLink}",
  "tg_support_link": "https://t.me/${params.tgSupportId.replace("@", "")}"
}`;
    try {
      if (!fs.existsSync(path.join(process.cwd(), `pages/${params.name}`))) {
        fs.mkdirSync(path.join(process.cwd(), `pages/${params.name}`), {
          recursive: true,
        });
      }
      const generatedFile = path.join(
        process.cwd(),
        `pages/${params.name}/index.tsx`
      );
      fs.writeFileSync(generatedFile, page_content);
      console.log(`✔ Generated ${params.name} home page`);
      const configFile = path.join(
        process.cwd(),
        `pages/${params.name}/config.json`
      );
      fs.writeFileSync(configFile, config_content);
      console.log(`✔ Generated ${params.name} config file`);
    } catch (err: any) {
      console.error("⚠️ Failed to generate file:", err.message);
    }

    console.log(
      `\n ${params.name} monitoring services added successfully!, run it from the main menu\n`
    );
    return;
  } catch (err: any) {
    console.error("❌ Fatal error:", err.message);
    return;
  }
}

async function startService() {
  try {
    const items = fs.readdirSync(path.join(process.cwd(), "pages"), {
      withFileTypes: true,
    });
    const items_list = items
      .filter((item) => item.isDirectory())
      .filter((dir) => dir.name != "api");
    if (items_list.length === 0) {
      console.error("❌ No service found, add one first");
      return;
    }
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Select a Service:",
        choices: [
          ...items_list.map((item) => item.name),
          new inquirer.Separator(),
          "⬅️ Back",
        ],
      },
    ]);

    if (choice === "⬅️ Back") {
      return; // just return to mainMenu
    }

    let server_res = await waitForServer("http://localhost:3000/api/health", 3);

    if (!server_res) {
      await startBaseServer();
    }
    server_res = await waitForServer("http://localhost:3000/api/health", 3);
    if (!server_res) {
      console.error("❌ Server did not start in time");
      return;
    }
    console.log("🗿 Odyssey Base server running");
    // health check the service
    const res: Record<string, number> = (
      await axios.get(`http://localhost:3000/api/cores`)
    ).data;
    if (res[`${choice}_core`]) {
      console.error(
        `❌ Service ${choice} is already running on port ${res[choice]}. stop it first before starting it again.`
      );
      return;
    }

    let BreathDelay = 60; // default
    const dirPath = `./configs/${choice}/json`;
    try {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        const count = files.filter((f) =>
          fs.statSync(path.join(dirPath, f)).isFile()
        ).length;
        BreathDelay = count * 10 || BreathDelay;
      } else {
        console.warn(
          "⚠️ Config directory not found, using default BreathDelay"
        );
      }
    } catch (err: any) {
      console.error("⚠️ Could not calculate BreathDelay:", err.message);
    }
    // Step 6: Background request
    return await new Promise((resolve) => {
      setTimeout(async () => {
        try {
          console.log(`\n🍪 starting ${choice} monitoring services...`);
          const res = await axios.post(
            "http://localhost:3000/api/runCore",
            new URLSearchParams({
              username: choice,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          console.log("✔ Service responded:", res.data);
        } catch (err: any) {
          console.error("⚠️ Could not reach service yet:", err.message);
        } finally {
          console.log(
            `⏳ Waiting ${BreathDelay} seconds for server to stabilize...`
          );
          await new Promise((r) => setTimeout(r, BreathDelay * 1000));

          console.log(
            `\n🎉 ${choice} monitoring services started successfully! See it at: ${process.env.NEXT_PUBLIC_DOMAIN}/${choice}\n`
          );
          await inquirer.prompt([
            {
              type: "confirm",
              name: "back",
              message: (answers) => `Press enter to back to main menu`,
            },
          ]);
        }
        resolve(null);
      }, 5000);
    });
  } catch (err: any) {
    console.error("❌ Fatal error:", err);
    return;
  }
}

async function stopService() {
  await waitForServer("http://localhost:3000/api/health").catch((err) => {
    console.error(
      "❌ Base odyssey Server did not respond in time:",
      err.message,
      "\n Please add a service first"
    );
    return;
  });
  const items = fs.readdirSync(path.join(process.cwd(), "pages"), {
    withFileTypes: true,
  });
  const items_list = items
    .filter((item) => item.isDirectory())
    .filter((dir) => dir.name != "api");
  if (items_list.length === 0) {
    console.error("❌ No service found, add one first");
    return;
  }
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Select a Service:",
      choices: [
        ...items_list.map((item) => item.name),
        new inquirer.Separator(),
        "⬅️ Back",
      ],
    },
  ]);

  if (choice === "⬅️ Back") {
    return; // just return to mainMenu
  }

  // health check the service
  const res: Record<string, number> = (
    await axios.get(`http://localhost:3000/api/cores`)
  ).data;

  if (!res[`${choice}_core`]) {
    console.error(
      `❌ Service ${choice} is not running, start it before stopping it.`
    );
    return;
  }

  console.log(`\n🛑 Stopping ${choice} monitoring services...`);
  // Step 3: API call
  try {
    const res = await axios.post(
      "http://localhost:3000/api/stopCore",
      new URLSearchParams({
        username: choice,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch (err: any) {
    console.error("⚠️ Failed to stop service:", err.message);
  }

  const res_after: Record<string, number> = await axios.get(
    `http://localhost:3000/api/cores`
  );

  if (!res_after[`${choice}_core`]) {
    console.error(`✔ Service ${choice} is stopped successfully!`);
    return;
  } else {
    console.error(
      `❌ could not stop the ${choice} monitoring services: UNKNOWN_ERROR`
    );

    return;
  }
}

async function deleteService() {
  const items = fs.readdirSync(path.join(process.cwd(), "pages"), {
    withFileTypes: true,
  });
  const items_list = items
    .filter((item) => item.isDirectory())
    .filter((dir) => dir.name != "api");

  if (items_list.length === 0) {
    console.error("❌ No service found, add one first");
    return;
  }
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Select a Service:",
      choices: [
        ...items_list.map((item) => item.name),
        new inquirer.Separator(),
        "⬅️ Back",
      ],
    },
  ]);

  if (choice === "⬅️ Back") {
    return; // just return to mainMenu
  }

  try {
    if (fs.existsSync(path.join(process.cwd(), `pages/${choice}`))) {
      fs.rmSync(path.join(process.cwd(), `pages/${choice}`), {
        recursive: true,
      });
    }
    if (fs.existsSync(path.join(process.cwd(), `${choice}Logs`))) {
      fs.rmSync(path.join(process.cwd(), `${choice}Logs`), {
        recursive: true,
      });
    }
    if (fs.existsSync(path.join(process.cwd(), `configs/${choice}`))) {
      fs.rmSync(path.join(process.cwd(), `configs/${choice}`), {
        recursive: true,
      });
    }

    console.log(`✔ Deleted ${choice} service`);
    return;
  } catch (err: any) {
    console.error("⚠️ Failed to delete service:", err.message);
    return;
  }
}

async function runningServices() {
  try {
    const res: Record<string, number> = await axios.get(
      `http://localhost:3000/api/cores`
    );

    console.log(
      res.data ? "✔ runnings services :" : "❌ No Services running.",
      res.data ? res.data : {}
    );

    return;
  } catch (err: any) {
    console.error("⚠️ Could not reach service yet:", err.message);
    return;
  }
}
async function services() {
  const items = fs.readdirSync(path.join(process.cwd(), "pages"), {
    withFileTypes: true,
  });
  const items_list = items
    .filter((item) => item.isDirectory())
    .filter((dir) => dir.name != "api");

  if (items_list.length === 0) {
    console.error("❌ No service found, add one first");
    return;
  }

  console.log(
    "✔ Added services :",
    items_list.map((item) => item.name)
  );
  return;
}

async function CheckAndBuildXrayCore() {
  const execAsync = promisify(exec);

  const goProjectDir = path.resolve(
    process.cwd(),
    "src/server/services/core/xrayCore"
  );
  const outputBinary = path.resolve(goProjectDir, "xray");

  if (!fs.existsSync(outputBinary)) {
    console.error("❌ Xray Core is not built yet.");
    console.log("Building Xray Core...");

    const buildCmd = `CGO_ENABLED=0 go build -o "${outputBinary}" -trimpath -buildvcs=false -ldflags="-s -w -buildid=" -v ./main`;

    try {
      const { stdout, stderr } = await execAsync(buildCmd, {
        cwd: goProjectDir,
      });
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      console.log("✔ Xray binary built successfully at:", outputBinary);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.error("❌ Build failed:", error);
      await new Promise((r) => setTimeout(r, 1000));

      return;
    }
  } else {
    console.log("✔ Xray binary exists at:", outputBinary);
    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function genEnv() {
  if (
    fs.existsSync(path.join(process.cwd(), ".env.local")) ||
    fs.existsSync(path.join(process.cwd(), ".env"))
  ) {
    let existing_env = String(
      fs.readFileSync(path.join(process.cwd(), ".env.local"))
    ).trim();

    if (existing_env.length > 0) {
      console.log("\n Detected a .env.local or .env", existing_env);

      console.log("⚠️ Skipping .env file generation");

      console.log(
        "⚠️ If you want to change the domain, please delete the .env.local and .env file and stop the odyssey(⏻ Stop Odyssey) and run the odyssey again."
      );
      // getting the ok from user
      let ok = await inquirer.prompt([
        {
          type: "confirm",
          name: "ok",
          message: "press enter to continue",
          default: true,
        },
      ]);
      return;
    } else {
      console.log(
        "corrupted .env file detected, delete the .env and .env.local using \n rm .env .env.local \n and run the odyssey again."
      );
      shutdown("manual", true);
      return;
    }
  }

  console.log("\n▶️ Generating fresh env file...");
  let domain = (await inquirer.prompt([
    {
      type: "input",
      name: "domain",
      message:
        "Enter the Domain for the app with http(eg. http://localhost:3000, https://myapp.com):",
      default: "http://localhost:3000",
    },
  ])) as { domain: string };

  let content = `NEXT_PUBLIC_DOMAIN="${domain.domain}"`;

  const targets = [".env.local", ".env"];

  try {
    for (const file of targets) {
      const filePath = path.join(process.cwd(), file);

      fs.writeFileSync(filePath, content, "utf-8");

      if (fs.existsSync(filePath)) {
        console.log(`✔ Updated ${file}`);
      } else {
        console.log(`✔ Created ${file}`);
      }

      // small delay to ensure FS flush in some environments
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return;
  } catch (err: any) {
    console.error(
      `⚠️ Failed to write environment files: ${err.message}, please stop the odyssey(⏻ Stop Odyssey) and try again.`
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    return;
  }
}

async function mainMenu() {
  await CheckAndBuildXrayCore();

  await genEnv();
  dotenv.config();

  console.clear();
  showLogo();
  console.log("\n🚀 Welcome to the Odyssey monitoring service admin wizard \n");
  while (true) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message:
          "Select an option(type back at any step to go back to main menu):",
        choices: [
          "✚ Add Service",
          "🗑️ Delete Service",
          "🚀 Start Service",
          "▐▐ Stop Service core",
          "🔄 Running Services",
          "✔ Added Services",
          "⏻ Stop Odyssey",
          "🏃🚪Exit",
          // "Edit Service", // to be removed
        ],
      },
    ]);

    if (choice === "🏃🚪Exit") {
      shutdown("manual");
      break;
    }

    if (choice === "⏻ Stop Odyssey") {
      shutdown("manual", true);
      break;
    }

    switch (choice) {
      case "✚ Add Service":
        await addService();
        break;
      case "🗑️ Delete Service":
        await deleteService();
        break;
      case "🚀 Start Service":
        await startService();
        break;
      case "▐▐ Stop Service core":
        await stopService();
        break;
      case "🔄 Running Services":
        await runningServices();
        break;
      case "✔ Added Services":
        await services();
        break;
    }
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Shutdown function
function shutdown(signal: string, stopServer = false) {
  console.log(`\n🛑 Caught ${signal}, shutting down gracefully...`);
  if (stopServer) stopBaseServer();
  setTimeout(() => {
    console.log("👋 Goodbye! Type 'odyssey' to reopen this menu");
    process.exit(signal === "manual" ? 0 : 1);
  }, 1000);
}
mainMenu();
