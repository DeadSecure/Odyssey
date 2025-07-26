"use client";
import { DayNightToggle, LanguageToggle } from "../components/ui/switcher/switcher";
import { useEffect, useState } from "react";
import "./globals.css";

export default function Home() {
  const [isDayMode, setIsDayMode] = useState(false);

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

  const handleThemeToggle = () => {
    setIsDayMode(!isDayMode);
  };

  return (
    <div className="landing-container w-full min-h-screen relative transition-colors duration-300">
      {/* Toggle positioned at top-right */}
      <div className="absolute top-4 right-4 z-50">
        <DayNightToggle onToggle={handleThemeToggle} initialIsDay={false} />
      </div>

      <div className="absolute top-4 left-4 z-50">
        <LanguageToggle
          initialLanguage="en"
          onToggle={(lang) => console.log("Lang changed to:", lang)}
        />
      </div>


      {/* Centered content (optional) */}
      <div className="flex items-center justify-center h-full">
        <h1 className="text-3xl">Odyssey!</h1>
      </div>
    </div>
  );
}
