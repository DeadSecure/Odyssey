"use client";
import {
  DayNightToggle,
  LanguageToggle,
} from "@/components/ui/switcher/switcher";
import { useEffect, useState } from "react";
import "../src/app/globals.css";
import { Kdam_Thmor_Pro } from "next/font/google";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

const kdamThmorPro = Kdam_Thmor_Pro({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kdam",
});

export default function Home() {
  const [isDayMode, setIsDayMode] = useState(false);
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const isRTL = locale === "fa";

  useEffect(() => {
    const root = document.documentElement;
    const lang_knb = document.querySelector(".lang-toggle-knob")!;
    if (isDayMode) {
      root.classList.remove("dark");
      lang_knb.classList.remove("dark");
      lang_knb.classList.add("light");
    } else {
      root.classList.add("dark");
      lang_knb.classList.add("dark");
      lang_knb.classList.remove("light");
    }
  }, [isDayMode]);

  return (
    <div
      className={`landing-container w-full min-h-screen relative transition-colors duration-300 p-6 lg:p-12 ${kdamThmorPro.variable}`}
    >
      {/* Top Toggles */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto ">
        <LanguageToggle initialLang={`${isRTL ? "fa" : "en"}`} />
        <DayNightToggle
          onToggle={() => setIsDayMode(!isDayMode)}
          initialIsDay={false}
        />
      </div>

      <br />

      {/* Title */}
      <div className="text-center text-4xl lg:text-6xl font-kdam">
        <h1>Odyssey</h1>
      </div>

      {/* Main Flex Container */}
      <div className="flex flex-col flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-0">
        {/* Left Section: Text + Buttons */}
        <div
          dir={isRTL ? "rtl" : "ltr"} // 👈 only this part becomes RTL
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl space-y-6"
        >
          <p
            className={`text-lg lg:text-3xl leading-relaxed lg:left-1/2 lg:relative ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("description")}
          </p>
          <div className="flex flex-wrap gap-4 lg:left-1/2 lg:relative">
            <button className="bg-cyan-300 hover:bg-cyan-400 text-black font-medium py-2 px-4 rounded-full transition">
              {t("purchase")}
            </button>
            <button className="bg-cyan-300 hover:bg-cyan-400 text-black font-medium py-2 px-4 rounded-full transition">
              {t("watchDemo")}
            </button>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="lg:w-1/2 flex justify-center h-auto lg:h-[80vh]">
          <img src="/odyssey.png" alt="Odyssey Statue" />
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
