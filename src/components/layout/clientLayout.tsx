"use client";
import {
  DayNightToggle,
  LanguageToggle,
} from "@/components/ui/switcher/switcher";
import { Kdam_Thmor_Pro } from "next/font/google";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../../app/globals.css";
import TabSwitcher from "@/components/ui/switcher/tabSwitcher"; // adjust import path

const kdamThmorPro = Kdam_Thmor_Pro({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kdam",
});

type Props = {
  children: ReactNode;
  activeTab: "status" | "access" | "latency";
  onTabChange: (tab: "status" | "access" | "latency") => void;
};

export default function ClientLayout({
  children,
  activeTab,
  onTabChange,
}: Props) {
  const [isDayMode, setIsDayMode] = useState(false);
  const { locale } = useRouter();
  const isRTL = locale === "fa";
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const lang_knb = document.querySelectorAll(".lang-toggle-knob")!;
    if (isDayMode) {
      root.classList.remove("dark");
      lang_knb.forEach((el) => el.classList.remove("dark"));
      lang_knb.forEach((el) => el.classList.add("light"));
      setIsDark(true);
    } else {
      root.classList.add("dark");
      lang_knb.forEach((el) => el.classList.add("dark"));
      lang_knb.forEach((el) => el.classList.remove("light"));
      setIsDark(false);
    }
  }, [isDayMode]);

  return (
    <div
      className={`landing-container w-full min-h-screen transition-colors duration-300 p-6 lg:p-12 ${kdamThmorPro.variable}`}
    >
      {/* Top row: Language and Day/Night */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <LanguageToggle initialLang={isRTL ? "fa" : "en"} />
        
        <img
          className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md"
          src="/polnet.jpg"
          alt="profile"
        ></img>

        <DayNightToggle
          onToggle={() => setIsDayMode(!isDayMode)}
          initialIsDay={false}
        />
      </div>
      <div className="w-full text-center mt-2">
        <span className={`text-gray-600 dark:text-300 text-lg font-semibold ${isDayMode ? "text-black" : "text-white"}`}>
          polnet Services Monitoring
        </span>
      </div>

      <div className="flex justify-center mt-4 lg:mt-6">
        <div className="w-[180px] h-[60px] lg:w-[200px] lg:h-[80px]">
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={onTabChange}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Children (your page content) */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
