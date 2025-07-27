// components/ui/clientWrapper.tsx
"use client";

import CountryStatusBar from "@/components/ui/countryStatusBar";
import React from "react";
import TabSwitcher from "./switcher/tabSwitcher";

export default function ClientStatusWrapper() {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 justify-center items-center mt-12">
  
      <div className="w-[80vw] lg:w-[40vw]">
        <CountryStatusBar
          name="🇩🇪 GERMANY 🍺 SKY 🏙 TUNNEL ⛏️"
          percentage={100}
          flagUrl="https://flagsapi.com/BE/flat/64.png"
        />
      </div>

      <div className="w-[80vw] lg:w-[40vw]">
        <CountryStatusBar
          name="🇫🇷 FRANCE 🍷 EIFFEL 🗼  UNDERGROUND 🚇"
          percentage={75}
          flagUrl="https://flagsapi.com/FR/flat/64.png"
        />
      </div>
    </div>
  );
}
