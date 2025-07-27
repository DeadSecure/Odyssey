// pages/polnet.tsx
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClientStatusWrapper from "@/components/ui/clientWrapper";
import ClientLayout from "@/components/layout/clientLayout";
import { use, useEffect, useState } from "react";
// import statusData from ../configs/polnet/
export default function PolnetPage() {
  const [activeTab, setActiveTab] = useState<"status" | "access" | "latency">(
    "access"
  );

  useEffect(() => {
    const tab_knob = document.querySelector(".tab-knob")!;
    // This runs only on the client side

    if (
      !tab_knob.classList.contains("dark") ||
      !tab_knob.classList.contains("light")
    ) {
      const mode = document.querySelector(".toggle-knob")!.classList;
      console.log("desicion making", mode);
      if (mode.contains("dark")) {
        tab_knob.classList.add("dark");
        tab_knob.classList.remove("light");
  
      }
      if (mode.contains("light")) {
        tab_knob.classList.add("light");
        tab_knob.classList.remove("dark");

      }
    }
  });
  return (
    <ClientLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <ClientStatusWrapper statusBars={[]} />
    </ClientLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
