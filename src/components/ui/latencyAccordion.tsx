"use client";
import React, { useState } from "react";
import { latencyBar, AccessBar } from "@/server/models/client/bars";

type Props = {
  item: latencyBar;
  isRtl?: boolean;
  isDark?: boolean;
};

export default function LatencyAccordion({ item, isRtl }: Props) {
  const [open, setOpen] = useState(false);
  const [border, setBorder] = useState("rounded-xl");

  const latencyClickHandler = () => {
    setOpen(!open);
    if (!open) {
      setBorder("rounded-tl-xl rounded-tr-xl");
    } else {
      setBorder("rounded-xl");
    }
  };

  const [opensiteName, setOpenSiteName] = useState<string | null>(null);

  return (
    <div
      style={{
        fontFamily: `${isRtl ? "var(--font-vazir)" : "var(--font-kdam)"}`,
      }}
      className="w-full max-w-full lg:max-w-[480px]"
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between gap-3 sl-bar dark text-white px-4 py-2 ${border} shadow-md w-full cursor-pointer h-[50px]`}
        onClick={() => latencyClickHandler()}
      >
        <span className="font-medium text-sm flex-1 truncate">{item.name}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`${msColorClass(
              Math.round(item.latency * 1000)
            )} font-semibold text-sm`}
          >
            {Math.round(item.latency * 1000)}ms{" "}
          </span>
          <img
            src={`https://flagsapi.com/${item.country}/flat/64.png`}
            alt="flag"
            className="w-6 h-4 object-cover rounded-sm"
          />
          <span className="text-gray text-lg">{open ? "▴" : "▾"}</span>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div className="sl-bar-items-bg dark rounded-b-xl shadow-inner p-4 space-y-4">
          {Object.entries(item.site).map(([siteName, latency]) => (
            <div key={siteName} className="space-y-1">
              {/* siteName header */}
              <div
                className="flex justify-between items-center text-white font-medium cursor-pointer border-b border-gray-700 py-2 px-4 sl-bar-items-bg dark"
                onClick={() =>
                  setOpenSiteName(opensiteName === siteName ? null : siteName)
                }
              >
                <span>{siteName}</span>
                <span
                  className={`${msColorClass(
                    Math.round(latency * 1000)
                  )}  text-sm`}
                >
                  {" "}
                  {Math.round(latency * 1000)}ms
                </span>
              </div>

              {/* Sites list */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function msColorClass(ms: number): string {
  if (ms <= 0) {
    // zero or error
    return "text-red-600";
  } else if (ms <= 500) {
    // fast
    return "text-green-400";
  } else if (ms <= 1000) {
    // medium → gradient-ish, pick yellow
    return "text-yellow-500";
  } else {
    // slow
    return "text-orange-600";
  }
}

export function percentageColorClass(percentage: number): string {
  if (percentage <= 25) {
    return "text-red-600";
  } else if (percentage <= 50) {
    return "text-orange-600";
  } else if (percentage <= 75) {
    return "text-yellow-500";
  } else if (percentage <= 100) {
    return "text-green-400";
  } else {
    return "text-white-400";
  }
}
