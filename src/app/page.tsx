"use client";
import {
  DayNightToggle,
  LanguageToggle,
} from "../components/ui/switcher/switcher";
import { useEffect, useState } from "react";
import "./globals.css";
import { Kdam_Thmor_Pro } from "next/font/google";

const kdamThmorPro = Kdam_Thmor_Pro({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kdam",
});

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
    <div
      className={`landing-container w-full min-h-screen relative transition-colors duration-300 p-6 lg:p-12 ${kdamThmorPro.variable}`}
    >
        {/* Top Toggles */}
    <div className="flex justify-between items-center w-full max-w-7xl mx-auto ">
      <LanguageToggle
        initialLanguage="en"
        onToggle={(lang) => console.log("Lang changed to:", lang)}
      />
      <DayNightToggle onToggle={handleThemeToggle} initialIsDay={false} />
    </div>
    
    <br/>
    {/* Title */}
    <div className="text-center text-4xl lg:text-6xl font-kdam">
      <h1>Odyssey</h1>
    </div>
      {/* Main Flex Container */}
      <div className="flex flex-col flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-0">
        {/* Left Section: Text + Buttons */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl space-y-6">
          <p className="text-lg lg:text-3xl  leading-relaxed lg:left-1/2 lg:relative">
            A unified platform built on <span className="font-bold">X-Ray</span>{" "}
            core to fully monitor x-ray based services.
          </p>
          <div className="flex flex-wrap gap-4 lg:left-1/2 lg:relative">
            <button className="bg-cyan-300 hover:bg-cyan-400 text-black font-medium py-2 px-4 rounded-full transition">
              Purchase
            </button>
            <button className="bg-cyan-300 hover:bg-cyan-400 text-black font-medium py-2 px-4 rounded-full transition">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="lg:w-1/2 flex justify-center h-auto lg:h-[80vh]">
          <img
            src="/odyssey.png"
            alt="Odyssey Statue"
            // className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
