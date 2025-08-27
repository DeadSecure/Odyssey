#!/usr/bin/env ts-node

import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import axios from "axios";
import { exec } from "child_process";
import kill from "tree-kill";
import { promisify } from "util";

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

let devProcess: ReturnType<typeof spawn> | null = null;
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

    let res = await waitForServer("http://localhost:3000/api/health");

    if (!res) {
      // Step 2: Start server
      console.log("\n▶️ Starting Odyssey server...");
      devProcess = spawn("npm", ["run", "dev", "-turbopack"], {
        stdio: "ignore",
        detached: true,
      });
      devProcess.unref(); // <- important!
      devProcess.on("error", (err) => {
        console.error("❌ Failed to start Base odyssey server:", err.message);
        return;
      });
      devProcess.on("exit", (code) => {
        if (code !== 0) {
          console.error(`❌ Base odyssey server exited with code ${code}`);
        }
      });

      await waitForServer("http://localhost:3000/api/health").catch((err) => {
        console.error("❌ Server did not respond in time:", err.message);
        return;
      });
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

    devProcess?.on("spawn", () => {
      console.log(
        `\n 🧜‍♂️ Base odyssey server started successfully! See it at: http://localhost:3000/\n`
      );
    });

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

    let server_res = await waitForServer("http://localhost:3000/api/health");

    if (!server_res) {
      console.log("\n▶️ Starting Odyssey server...");
      devProcess = spawn("npm", ["run", "dev", "-turbopack"], {
        stdio: "ignore",
        detached: true,
      });
      devProcess.unref(); // <- important!
      devProcess.on("error", (err) => {
        console.error("❌ Failed to start Base odyssey server:", err.message);
        return;
      });
      devProcess.on("exit", (code) => {
        if (code !== 0) {
          console.error(`❌ Base odyssey server exited with code ${code}`);
        }
      });

      await waitForServer("http://localhost:3000/api/health").catch((err) => {
        console.error(
          "❌ Base odyssey Server did not respond in time:",
          err.message
        );
        return;
      });
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
    console.error("❌ Fatal error:", err.message);
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

  try {
    if (fs.existsSync(path.join(process.cwd(), ".env.local"))) {
      fs.unlinkSync(path.join(process.cwd(), ".env.local"));
      fs.writeFileSync(path.join(process.cwd(), ".env.local"), content);
      console.log(`✔ Updated .env.local file`);
      await new Promise((r) => setTimeout(r, 1000));

      return;
    } else {
      fs.writeFileSync(path.join(process.cwd(), ".env.local"), content);
      console.log(`✔ Generated .env.local file`);
      await new Promise((r) => setTimeout(r, 1000));

      return;
    }
  } catch (err: any) {
    console.error("⚠️ Failed to generate .env.local file:", err.message);
    await new Promise((r) => setTimeout(r, 1000));

    return;
  }
}

async function mainMenu() {
  await CheckAndBuildXrayCore();

  await genEnv();
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
        await startService();
        break;
      case "🗑️ Delete Service":
        await stopService();
        break;
      // case "Edit Service":
      //   await editService();
      //   break; // to be removed
      case "🚀 Start Service":
        await addService();
        break;
      case "▐▐ Stop Service core":
        await deleteService();
        break;
      case "🔄 Running Services":
        await runningServices();
        break;
    }
  }
}

// global safety nets
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled promise rejection:", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err.message);
  shutdown("uncaughtException");
});

process.on("SIGINT", () => shutdown("SIGINT")); // ctrl+c
process.on("SIGTERM", () => shutdown("SIGTERM")); // kill command

function shutdown(signal: string, stopProcess = false) {
  console.log(`\n🛑 Caught ${signal}, shutting down gracefully...`);

  if (stopProcess && devProcess && devProcess.pid) {
    console.log("⏹ Stopping Base odyssey server...");
    try {
      kill(devProcess.pid, "SIGTERM", (err) => {
        if (err) {
          console.warn("⚠️ Failed to kill dev process:", err.message);
        }
      });
    } catch (err) {
      console.warn(
        "⚠️ Unexpected error while killing process:",
        (err as Error).message
      );
    }
    try {
      console.log("🛑 Stopping any running Xray processes...");
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

  setTimeout(() => {
    console.log("👋 Goodbye!, type odyssey to reopen this menu");
    // exit code: 0 = normal, 1 = error/crash
    process.exit(signal === "manual" ? 0 : 1);
  }, 1000);
}

mainMenu();
