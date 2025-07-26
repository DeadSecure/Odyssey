import React, { useState } from "react";
import Image from "next/image";
import "./../../../app/globals.css";

export const DayNightToggle = ({
  onToggle,
  initialIsDay = false,
}: {
  onToggle: (isDay: boolean) => void;
  initialIsDay?: boolean;
}) => {
  const [isDay, setIsDay] = useState(initialIsDay);

  const handleToggle = () => {
    const newIsDay = !isDay;
    setIsDay(newIsDay);
    onToggle(newIsDay);
  };

  return (
    <button
      onClick={handleToggle}
      aria-pressed={isDay}
      role="switch"
      aria-label="Toggle Day/Night Mode"
      className="toggle-button relative flex items-center rounded-full cursor-pointer"
      style={{ width: "120px", height: "60px" }}
    >
      {/* Sliding knob */}
      <div
        className={`toggle-knob ${
          isDay ? "light" : "dark"
        } absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full`}
        style={{
          width: "48px",
          height: "48px",
          transform: isDay ? "translateX(66px)" : "translateX(6px)", // 120 - 48 - padding = 66
        }}
      ></div>

      {/* Background icons (left: moon, right: sun) */}
      <div className="relative z-0 flex justify-between items-center w-full px-3">
        <div
          className="flex items-center justify-center"
          style={{ width: "36px", height: "36px" }}
        >
          <div style={{ width: "36px", height: "36px", position: "relative" }}>
            <Image src="/moon.svg" alt="Moon" fill className="object-contain" />
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ width: "36px", height: "36px" }}
        >
          <div style={{ width: "36px", height: "36px", position: "relative" }}>
            <Image src="/sun.svg" alt="Sun" fill className="object-contain" />
          </div>
        </div>
      </div>
    </button>
  );
};

export const LanguageToggle = ({
  onToggle,
  initialLanguage = "en",
}: {
  onToggle: (lang: "en" | "fa") => void;
  initialLanguage?: "en" | "fa";
}) => {
  const [lang, setLang] = useState<"en" | "fa">(initialLanguage);

  const handleToggle = () => {
    const newLang = lang === "en" ? "fa" : "en";
    setLang(newLang);
    onToggle(newLang);
  };

  return (
    <button
      onClick={handleToggle}
      aria-pressed={lang === "en"}
      role="switch"
      aria-label="Toggle Language"
      className=" toggle-button relative flex items-center rounded-full cursor-pointer"
      style={{
        width: "120px",
        height: "60px",
        // backgroundColor: "var(--toggle-button-bg)",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Sliding knob */}
      <div
        className="lang-toggle-knob toggle-knob absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
        style={{
          width: "48px",
          height: "48px",
          // backgroundColor: "var(--toggle-knob-bg)",
          border: "3px solid var(--toggle-knob-border-color)",
          transform: lang === "en" ? "translateX(6px)" : "translateX(66px)",
          transition: "transform 0.3s ease, background-color 0.3s ease",
          color: "var(--toggle-knob-text)",
          fontWeight: 600,
          fontSize: "18px",
          userSelect: "none",
        }}
      ></div>

      {/* Background labels */}
      <div
        className="toggle-texts relative z-0 flex justify-between items-center w-full px-3"
        style={{
          color: "var(--toggle-icon-light)",
          fontWeight: 600,
          fontSize: "16px",
          userSelect: "none",
        }}
      >
        <span>ENG</span>
        <span style={{ fontSize: "15px" }}>فارسی</span>
      </div>
    </button>
  );
};
