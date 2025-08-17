#!/usr/bin/env ts-node

import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import axios from "axios";

function showLogo() {
  const text = figlet.textSync("ODYSSEY", { font: "Big" });
  console.log(gradient.pastel.multiline(text));
}

async function waitForServer(url: string, retries = 20, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(url);
      console.log("🗿 Odyssey Base server running");
      return;
    } catch {
      console.log(`⏳ Waiting for server... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Server did not start in time");
}

let devProcess: ReturnType<typeof spawn> | null = null;

async function main() {
  try {
    showLogo();
    console.log("\n🚀 Welcome to the Odyssey Service Setup Wizard\n");

    // Step 1: Ask user
    const { subLink, name, tgSupportId } = await inquirer.prompt([
      {
        type: "input",
        name: "subLink",
        message: "Enter the config link:",
        validate: (input) =>
          input.trim() !== "" || "Config link cannot be empty",
      },
      {
        type: "input",
        name: "name",
        message: "Enter a name for this service:",
        validate: (input) => input.trim() !== "" || "Name cannot be empty",
      },
      {
        type: "input",
        name: "tgSupportId",
        message: "Enter the Telegram support id (eg. @PolNetSupport):",
        validate: (input) =>
          input.trim() !== "" || "Telegram support id cannot be empty",
      },
      {
        type: "confirm",
        name: "pic",
        message: (answers) =>
          `make sure your profile pic is in: public/profilePic/${answers.name}.png then press Enter`,
      },
    ]);

    // Step 2: Start server
    console.log("\n▶️ Starting Odyssey server...");
    devProcess = spawn("npm", ["run", "dev"], { stdio: "inherit" });

    devProcess.on("error", (err) => {
      console.error("❌ Failed to start dev server:", err.message);
      process.exit(1);
    });
    devProcess.on("exit", (code) => {
      if (code !== 0) {
        console.error(`❌ Dev server exited with code ${code}`);
      }
    });

    await waitForServer("http://localhost:3000/api/health").catch((err) => {
      console.error("❌ Server did not respond in time:", err.message);
      process.exit(1);
    });

    // Step 3: API call
    try {
      await axios.post("http://localhost:3000/api/config", {
        url: subLink,
        name,
      });
    } catch (err: any) {
      console.error("⚠️ Failed to send config:", err.message);
    }

    // Step 4: BreathDelay
    let BreathDelay = 60; // default
    const dirPath = `./configs/${name}/json`;
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
      <ClientBarsWrapper />
    </ClientLayout>
  );
}
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let access_and_status = await fetchAccessAndStatusBars(config.name);
  const logger = new FSLogger("polnetLogs");
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
  "name": "${name}",
  "subscription_link": "${subLink}",
  "tg_support_link": "https://t.me/${tgSupportId.replace("@", "")}"
}`;
    try {
      if (!fs.existsSync(path.join(process.cwd(), `pages/${name}`))) {
        fs.mkdirSync(path.join(process.cwd(), `pages/${name}`), {
          recursive: true,
        });
      }
      const generatedFile = path.join(process.cwd(), `pages/${name}/index.tsx`);
      fs.writeFileSync(generatedFile, page_content);
      console.log(`✅ Generated ${name} home page`);
      const configFile = path.join(process.cwd(), `pages/${name}/config.json`);
      fs.writeFileSync(configFile, config_content);
      console.log(`✅ Generated ${name} config file`);
    } catch (err: any) {
      console.error("⚠️ Failed to generate file:", err.message);
    }

    // Step 6: Background request
    setTimeout(async () => {
      try {
        console.log(`\n starting ${name} monitoring services...`);
        const res = await axios.post(
          "http://localhost:3000/api/runCore",
          new URLSearchParams({
            username: name,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log("✅ Service responded:", res.data);
      } catch (err: any) {
        console.error("⚠️ Could not reach service yet:", err.message);
      } finally {
        console.log(
          `⏳ Waiting ${BreathDelay} seconds for server to stabilize...`
        );
        await new Promise((r) => setTimeout(r, BreathDelay * 1000));

        console.log(
          `\n🎉 ${name} monitoring services started successfully! See it at: http://localhost:3000/${name}\n`
        );
      }
    }, 5000);

    devProcess.on("spawn", () => {
      console.log(
        `\n🎉 Service started successfully! See it at: http://localhost:3000/\n`
      );
    });
  } catch (err: any) {
    console.error("❌ Fatal error:", err.message);
    process.exit(1);
  }
}

// global safety nets
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err.message);
});

function shutdown(signal: string) {
  console.log(`\n🛑 Caught ${signal}, shutting down gracefully...`);

  if (devProcess) {
    console.log("⏹ Stopping Base odyssey server...");
    devProcess.kill("SIGTERM"); // send TERM to child
  }

  // Give child a moment to exit, then exit self
  setTimeout(() => {
    console.log("👋 Goodbye!");
    process.exit(0);
  }, 500);
}

process.on("SIGINT", () => shutdown("SIGINT")); // ctrl+c
process.on("SIGTERM", () => shutdown("SIGTERM")); // kill command

// safety nets
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err.message);
});

main();
