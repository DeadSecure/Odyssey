// pages/polnet.tsx
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

export default function PolnetPage({
  AccessBars,
  StatusBars,
  LatencyBars,
  breathDelay,
}: Props) {
  const [accessBars, setAccessBars] = useState<AccessBar[]>(AccessBars);
  const [latencyBars, setLatencyBars] = useState<latencyBar[]>(LatencyBars);
  const [statusBars, setStatusBars] = useState<statusBar>(StatusBars);

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

    setTimeout(async () => {
      let access_and_status = await fetchAccessAndStatusBars("polnet");
      let latency = await fetchLatencyBars("polnet");
      setAccessBars(access_and_status.access);
      setLatencyBars(latency);
      setStatusBars(access_and_status.status);
    }, breathDelay);
  }, [accessBars, latencyBars, statusBars]);

  return (
    <ClientLayout
      name="polnet"
      logo="/polnet.jpg"
      bars={{
        AccessBars: accessBars,
        latencyBars: latencyBars,
        statusBars: statusBars,
      }}
    >
      <ClientBarsWrapper />
    </ClientLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let access_and_status = await fetchAccessAndStatusBars("polnet");
  const logger = new FSLogger("polnetLogs");

  logger.log({
    access: access_and_status.access,
    status: access_and_status.status,
  });

  let latency = await fetchLatencyBars("polnet");
  return {
    props: {
      AccessBars: access_and_status.access,
      StatusBars: access_and_status.status,
      LatencyBars: latency,
      breathDelay: 60000,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: 60, // optional ISR
  };
};
