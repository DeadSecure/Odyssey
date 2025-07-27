// pages/polnet.tsx
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClientStatusWrapper from "@/components/ui/clientWrapper";
import ClientLayout from "@/components/layout/clientLayout";
import { useEffect, useState } from "react";
import { statusBar } from "@/server/models/client/status";
import { Categories, SitesTestResponse } from "@/server/models/interfaces";
import { parseStatusBars } from "@/server/services/utils/parseAccess";

type Props = {
  statusBars: statusBar[];
};

export default function PolnetPage({ statusBars }: Props) {
  const [activeTab, setActiveTab] = useState<"status" | "access" | "latency">(
    "access"
  );

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
    <ClientLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <ClientStatusWrapper statusBars={statusBars} />
    </ClientLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const params = new URLSearchParams({
    category: Categories.social,
    username: "polnet",
  });

  const res = await fetch(
    `http://localhost:3000/api/access?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // ✅ Parse once
  let res_parse: SitesTestResponse[] = await res.json();

  // ✅ Reuse parsed data
  let statusBars: statusBar[] = await parseStatusBars(res_parse);

  return {
    props: {
      statusBars,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: 60, // optional ISR
  };
};
