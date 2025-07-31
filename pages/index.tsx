"use client";
import {
  DayNightToggle,
  LanguageToggle,
} from "@/components/ui/switcher/switcher";
import { useEffect, useState } from "react";
import "../src/app/globals.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import router, { useRouter } from "next/router";

export default function Home() {
  const [isDayMode, setIsDayMode] = useState(false);
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const isRTL = locale === "fa";

  useEffect(() => {
    const root = document.documentElement;
    const lang_knb = document.querySelectorAll(".lang-toggle-knob")!;
    if (isDayMode) {
      root.classList.remove("dark");
      lang_knb.forEach((el) => el.classList.remove("dark"));
      lang_knb.forEach((el) => el.classList.add("light"));
    } else {
      root.classList.add("dark");
      lang_knb.forEach((el) => el.classList.add("dark"));
      lang_knb.forEach((el) => el.classList.remove("light"));
    }
  }, [isDayMode]);

  return (
    <div
      className={`landing-container w-full min-h-screen relative transition-colors duration-300 p-6 lg:p-12`}
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
      <div className="text-center text-4xl lg:text-6xl">
        <h1 style={{ fontFamily: "var(--font-kdam)" }}>Odyssey</h1>
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
            } `}
            style={{
              fontFamily: `${isRTL ? "var(--font-vazir)" : "var(--font-kdam)"}`,
            }}
          >
            {t("description")}
          </p>
          <div className="flex flex-wrap gap-4 lg:left-1/2 lg:relative">
            <button
              style={{
                fontFamily: `${
                  isRTL ? "var(--font-vazir)" : "var(--font-kdam)"
                }`,
              }}
              className="bg-cyan-300 hover:bg-cyan-400 text-black font-medium py-2 px-4 rounded-full transition"
            >
              {t("purchase")}
            </button>
            <button
              onClick={() =>
                isRTL ? router.push("/fa/polnet") : router.push("/polnet")
              }
              style={{
                fontFamily: `${
                  isRTL ? "var(--font-vazir)" : "var(--font-kdam)"
                }`,
              }}
              className="bg-cyan-300 hover:bg-cyan-400 text-black font-medium py-2 px-4 rounded-full transition"
            >
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
