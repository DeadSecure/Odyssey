"use client";
import React, { useEffect, useState } from "react";
import "../../../app/globals.css";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

type Tab = "status" | "access" | "latency";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isDark: boolean;
};

const TabSwitcher: React.FC<Props> = ({ activeTab, onTabChange, isDark }) => {
  const tabs: Tab[] = ["status", "access", "latency"];
  const containerWidthMobile = 360;
  const containerWidthLg = 400;

  const tabWidthMobile = containerWidthMobile * 0.3; // 108
  const knobWidthMobile = tabWidthMobile * 1.3; // 140.4
  const offsetMobile = (tabWidthMobile - knobWidthMobile) / 2; // -16.2

  const tabWidthLg = containerWidthLg * 0.3; // 120
  const knobWidthLg = tabWidthLg * 1.3; // 156
  const offsetLg = (tabWidthLg - knobWidthLg) / 2; // -18

  const activeIndex = tabs.indexOf(activeTab);

  const translateXMobile = activeIndex * tabWidthMobile + offsetMobile;
  const translateXLg = activeIndex * tabWidthLg + offsetLg;
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  // 🔥 Countdown state
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextUpdateIn((prev) => (prev > 0 ? prev - 1 : 60)); // reset to 60 after reaching 0
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full ">
  <div className="toggle-button relative h-[60px] w-[360px] lg:h-[80px] lg:w-[400px] rounded-full bg-sky-400/60 overflow-hidden flex">
    {/* Knob */}
    <div
      className="absolute top-0 h-full rounded-full lang-toggle-knob transition-transform duration-300 ease-in-out"
      style={{
        width: "33.3333%",
        transform: `translateX(${activeTab === "status" ? "0%" : activeTab === "access" ? "100%" : "200%"})`,
      }} 
    />

    {/* Tabs */}
    {["status", "access", "latency"].map((tab) => {
      const isActive = activeTab === tab;
      return (  
        <button
          key={tab}
          onClick={() => onTabChange(tab as Tab)}
          className={`flex-1 z-10 flex items-center dark  justify-center font-semibold transition-colors duration-200 text-base lg:text-lg ${
            isActive
              ? isDark
                ? "text-white"
                : "text-black"
              : isDark
              ? "text-black"
              : "text-white"
          }`}
        >
          {t(tab)}
        </button>
      );
    })}
  </div>

  {/* Countdown */}
  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
    <span>
      {t("nextUpdateIn", { defaultValue: "Next update in" })} {nextUpdateIn}s
    </span>
    <div
      className="tenor-gif-embed w-10 h-10 rounded-full"
      data-postid="13818761"
      data-share-method="host"
    ></div>
    <script
      type="text/javascript"
      async
      src="https://tenor.com/embed.js"
    ></script>
  </div>
</div>
  );
};

export default TabSwitcher;
