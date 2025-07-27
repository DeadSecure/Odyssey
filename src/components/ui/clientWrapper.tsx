"use client";

import CountryStatusBar from "@/components/ui/countryStatusBar";
import { statusBar } from "@/server/models/client/status";
import React from "react";

export default function ClientStatusWrapper({
  statusBars,
}: {
  statusBars: statusBar[];
}) {
  const leftColumn = statusBars.filter((_, i) => i % 2 === 0);
  const rightColumn = statusBars.filter((_, i) => i % 2 !== 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-12">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2 items-center">
          {leftColumn.map((item, idx) => (
            <div
              key={`left-${idx}`}
              className="w-full max-w-full lg:max-w-[480px] flex-shrink-0"
            >
              <CountryStatusBar
                name={item.name}
                percentage={item.percentage}
                flagUrl={`https://flagsapi.com/${item.country}/flat/64.png`}
              />
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2 items-center w-[700px]">
          {rightColumn.map((item, idx) => (
            <div
              key={`right-${idx}`}
              className="w-full max-w-full lg:max-w-[480px] flex-shrink-0"
            >
              <CountryStatusBar
                name={item.name}
                percentage={item.percentage}
                flagUrl={`https://flagsapi.com/${item.country}/flat/64.png`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
