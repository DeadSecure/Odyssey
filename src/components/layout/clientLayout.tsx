"use client";
import {
  DayNightToggle,
  LanguageToggle,
} from "@/components/ui/switcher/switcher";
import {
  cloneElement,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import "../../app/globals.css";
import TabSwitcher from "@/components/ui/switcher/tabSwitcher"; // adjust import path
import { useTranslation } from "next-i18next";
import { latencyBar, AccessBar } from "@/server/models/client/bars";

type Props = {
  children: ReactElement<{
    isRtl: boolean;
    bars: { AccessBars?: AccessBar[]; latencyBars?: latencyBar[] };
  }>;
  activeTab: "status" | "access" | "latency";
  onTabChange: (tab: "status" | "access" | "latency") => void;
  name: string;
  logo: string;
  bars: {
    AccessBars: AccessBar[];
    latencyBars: latencyBar[];
  };
};

export default function ClientLayout({
  children,
  activeTab,
  onTabChange,
  name,
  logo,
  bars,
}: Props) {
  const [isDayMode, setIsDayMode] = useState(false);
  const { locale } = useRouter();
  const isRTL = locale === "fa";
  const [isDark, setIsDark] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    const root = document.documentElement;
    const lang_knb = document.querySelectorAll(".lang-toggle-knob")!;
    const sl_bar = document.querySelectorAll(".sl-bar")!;
    const sl_bar_items = document.querySelectorAll(".sl-bar-items-bg")!;
    const sl_bar_item = document.querySelectorAll(".sl-bar-item")!;

    if (isDayMode) {
      root.classList.remove("dark");
      lang_knb.forEach((el) => el.classList.remove("dark"));
      lang_knb.forEach((el) => el.classList.add("light"));
      sl_bar.forEach((el) => el.classList.remove("dark"));
      sl_bar_items.forEach((el) => el.classList.remove("dark"));
      sl_bar_item.forEach((el) => el.classList.remove("dark"));
      setIsDark(true);
    } else {
      root.classList.add("dark");
      lang_knb.forEach((el) => el.classList.add("dark"));
      lang_knb.forEach((el) => el.classList.remove("light"));
      sl_bar.forEach((el) => el.classList.add("dark"));
      sl_bar_items.forEach((el) => el.classList.add("dark"));
      sl_bar_item.forEach((el) => el.classList.add("dark"));
      setIsDark(false);
    }
  }, [isDayMode]);

  return (
    <div
      className={`landing-container w-full min-h-screen transition-colors duration-300 p-6 lg:p-12 `}
    >
      {/* Top row: Language and Day/Night */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <LanguageToggle initialLang={isRTL ? "fa" : "en"} />

        <img
          className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] rounded-full overflow-hidden shadow-lg"
          src={`${logo}`}
          alt="profile"
        ></img>

        <DayNightToggle
          onToggle={() => setIsDayMode(!isDayMode)}
          initialIsDay={false}
        />
      </div>
      <div className="w-full text-center mt-2">
        <span
          style={{
            fontFamily: `${isRTL ? "var(--font-vazir)" : "var(--font-kdam)"}`,
          }}
          className={`text-gray-600 dark:text-300 text-lg font-semibold ${
            isDayMode ? "text-black" : "text-white"
          }`}
        >
          {name} {t("monitoringText")}
        </span>
      </div>

      <div className="flex justify-center mt-4 lg:mt-6">
        <div className="w-[180px] h-[60px] lg:w-[200px] lg:h-[80px]">
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={onTabChange}
            isDark={isDark}
            isRTL={isRTL}
          />
        </div>
      </div>

      {/* Children (your page content) */}
      <div className="mt-6">
        {cloneElement(children, {
          isRtl: isRTL,
          bars: {
            AccessBars:
              activeTab.toLowerCase() === "access" ? bars.AccessBars : [],
            latencyBars:
              activeTab.toLowerCase() === "latency" ? bars.latencyBars : [],
          },
        })}
      </div>
    </div>
  );
}
