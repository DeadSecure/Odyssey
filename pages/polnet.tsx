// pages/polnet.tsx
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClientBarsWrapper from "@/components/ui/clientWrapper";
import ClientLayout from "@/components/layout/clientLayout";
import { useEffect, useState } from "react";
import { latencyBar, AccessBar, statusBar } from "@/server/models/client/bars";
import { Categories, SitesTestResponse } from "@/server/models/interfaces";
import { parseAccessBars } from "@/server/services/utils/parser";
import {
  mockAccessBars,
  mockLatencyBars,
  mockStatusBars,
} from "@/server/models/client/mocks";

type Props = {
  AccessBars: AccessBar[];
};

export default function PolnetPage({ AccessBars }: Props) {
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
  }, []);

  return (
    <ClientLayout
      name="polnet"
      logo="/polnet.jpg"
      bars={{
        AccessBars: mockAccessBars,
        latencyBars: mockLatencyBars,
        statusBars: mockStatusBars,
      }}
    >
      <ClientBarsWrapper />
    </ClientLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // const params = new URLSearchParams({
  //   category: "all",
  //   username: "polnet",
  // });

  // const res = await fetch(
  //   `http://localhost:3000/api/access?${params.toString()}`,
  //   {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   }
  // );

  // // ✅ Parse once
  // let res_parse: SitesTestResponse[] = await res.json();

  // // ✅ Reuse parsed data
  // let AccessBars: AccessBar[] = await parseAccessBars(res_parse);

  return {
    props: {
      mockAccessBars,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: 60, // optional ISR
  };
};
