import { GetStaticProps } from "next";
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

      if (!res[`${config.name}_core`]) {
        console.error(
          `❌ Service ${config.name} is not running, start it before stopping it.`
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
      logo={`/profilePic/${config.name}.png`}
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
  const logger = new FSLogger(`${config.name}Logs`);
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
};