"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ClientOnly from "../clientOnly";

export type Tab = "finance" | "dev" | "gaming" | "social";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isDark?: boolean;
  isRtl?: boolean;
  delay?: number;
};

const CategoriesTabSwitcher: React.FC<Props> = ({
  activeTab,
  onTabChange,
  isDark,
  isRtl,
  delay,
}) => {
  const tabs: Tab[] = ["finance", "dev", "gaming", "social"];
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  // Countdown state
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(delay ?? 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextUpdateIn((prev) => (prev > 0 ? prev - 1 : delay ?? 60));
      const script = document.createElement("script");
      script.src = "https://tenor.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }, 1000);

    return () => clearInterval(interval);
  }, [isRtl]);

  const activeIndex = tabs.indexOf(activeTab);
  const knobTranslate = `${activeIndex * 100}%`;
  const knobWidth = `${100 / tabs.length}%`; // 25% for 4 tabs

  return (
    <div className={`flex flex-col items-center w-full`}>
      <div className="toggle-button relative h-[60px] w-[360px] lg:h-[60px] lg:w-[480px] rounded-full bg-sky-400/60 overflow-hidden flex">
        {/* Knob */}
        <div
          className="absolute top-0 h-full rounded-full lang-toggle-knob transition-transform duration-300 ease-in-out"
          style={{
            width: knobWidth,
            transform: `translateX(${knobTranslate})`,
          }}
        />

        {/* Tabs */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              style={{
                fontFamily: `${
                  isRtl ? "var(--font-vazir)" : "var(--font-kdam)"
                }`,
              }}
              className={`flex-1 z-10 flex items-center justify-center font-semibold transition-colors duration-200 text-sm lg:text-base ${
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
    </div>
  );
};

export default CategoriesTabSwitcher;
