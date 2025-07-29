// pages/polnet.tsx
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClientStatusWrapper from "@/components/ui/clientWrapper";
import ClientLayout from "@/components/layout/clientLayout";
import { useEffect, useState } from "react";
import { statusBar } from "@/server/models/client/status";
import { Categories, SitesTestResponse } from "@/server/models/interfaces";
import { parseStatusBars } from "@/server/services/utils/parseAccess";

export const mockStatusBars: statusBar[] = [
  {
    name: "DE • Germany Tunnel",
    country: "DE",
    percentage: 75,
    site: {
      social: {
        "instagram.com": 1.67,
        "youtube.com": 0.234,
      },
      gaming: {
        "steamcommunity.com": 3.12,
      },
    },
  },
  {
    name: "US • USA Tunnel",
    country: "US",
    percentage: 50,
    site: {
      social: {
        "facebook.com": 0.456,
      },
      finance: {
        "paypal.com": 0.289,
        "coinbase.com": 5.12,
      },
    },
  },
  {
    name: "FI • Finland Tunnel",
    country: "FI",
    percentage: 100,
    site: {
      dev: {
        "github.com": 1.45,
        "gitlab.com": 0.52,
      },
      gaming: {
        "epicgames.com": 0.98,
      },
    },
  },
  {
    name: "FR • France Tunnel",
    country: "FR",
    percentage: 60,
    site: {
      social: {
        "twitter.com": 0.350,
      },
      finance: {
        "bankoffrance.fr": 0.220,
      },
      dev: {
        "stackoverflow.com": 0.410,
      },
    },
  },
];

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
      <ClientStatusWrapper statusBars={mockStatusBars} />
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
  // let statusBars: statusBar[] = await parseStatusBars(res_parse);

  return {
    props: {
      mockStatusBars,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: 60, // optional ISR
  };
};
