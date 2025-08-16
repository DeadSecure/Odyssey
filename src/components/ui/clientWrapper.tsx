"use client";
import React from "react";
import AccessAccordion from "./accessAccordion";
import LatencyAccordion from "./latencyAccordion";
import { latencyBar, AccessBar, statusBar } from "@/server/models/client/bars";
import StatusAccordion from "./statusAccordion";
import { Tab } from "./switcher/statusTabSwitcher";

export default function ClientBarsWrapper({
  bars,
  isRtl,
  isDark,
  onStatusTabChange,
  statusTab,
  delay,
}: {
  bars?: {
    AccessBars?: AccessBar[];
    latencyBars?: latencyBar[];
    statusBars?: statusBar;
  };
  isRtl?: boolean;
  isDark?: boolean;
  onStatusTabChange?: (tab: Tab) => void;
  statusTab?: Tab;
  delay?: number;
}) {
  if (bars?.statusBars) {
    return (
      <StatusAccordion
        item={bars.statusBars}
        isRtl={isRtl}
        isDark={isDark}
        onStatusTabChange={onStatusTabChange}
        statusTab={statusTab}
        delay={delay}
      />
    );
  }

  if (bars?.AccessBars?.length) {
    const left = bars.AccessBars.filter((_, i) => i % 2 === 0);
    const right = bars.AccessBars.filter((_, i) => i % 2 !== 0);

    return (
      <div className="w-full max-w-7xl mx-auto px-4 mt-12">
        <br />
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          <div className="flex flex-col gap-6 w-full lg:w-1/2 items-center">
            {left.map((item, i) => (
              <AccessAccordion
                key={i}
                item={item}
                isRtl={isRtl}
                isDark={isDark}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6 w-full lg:w-1/2 items-center">
            {right.map((item, i) => (
              <AccessAccordion
                key={i}
                item={item}
                isRtl={isRtl}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bars?.latencyBars?.length) {
    const left = bars.latencyBars.filter((_, i) => i % 2 === 0);
    const right = bars.latencyBars.filter((_, i) => i % 2 !== 0);

    return (
      <div className="w-full max-w-7xl mx-auto px-4 mt-12">
        <br />
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          <div className="flex flex-col gap-6 w-full lg:w-1/2 items-center">
            {left.map((item, i) => (
              <LatencyAccordion
                key={i}
                item={item}
                isRtl={isRtl}
                isDark={isDark}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6 w-full lg:w-1/2 items-center">
            {right.map((item, i) => (
              <LatencyAccordion
                key={i}
                item={item}
                isRtl={isRtl}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // optional fallback if neither exists
  return null;
}
