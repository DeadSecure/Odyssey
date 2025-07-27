"use client";
import React, { useEffect } from "react";
import "../../../app/globals.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
type Tab = "status" | "access" | "latency";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TabSwitcher: React.FC<Props> = ({ activeTab, onTabChange }) => {
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
  return (
    <div className="flex justify-center w-full">
      {" "}
      {/* full width container and center content */}
      <div className="relative rounded-full toggle-button h-[60px] w-[360px] lg:h-[80px] lg:w-[400px] flex">
        {/* Knob */}
        <div
          className="lang-toggle-knob tab-knob absolute top-0 left-0 h-full rounded-[40px] transition-transform duration-300 ease-in-out"
          style={{
            width: `${knobWidthMobile}px`,
            transform: `translateX(${translateXMobile}px)`,
          }}
        >
          <style jsx>{`
            @media (min-width: 1024px) {
              div {
                width: ${knobWidthLg}px !important;
                transform: translateX(${translateXLg}px) !important;
              }
            }
          `}</style>
        </div>

        {/* Buttons */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative z-10 flex items-center justify-center h-full font-semibold transition-colors duration-200 ${
                isActive ? "text-black" : "text-white"
              }`}
              style={{ width: `${tabWidthMobile}px` }}
            >
              <span className="text-base lg:text-lg">{t(tab)}</span>

              <style jsx>{`
                button {
                  width: ${tabWidthMobile}px;
                }
                @media (min-width: 1024px) {
                  button {
                    width: ${tabWidthLg}px !important;
                  }
                }
              `}</style>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabSwitcher;
