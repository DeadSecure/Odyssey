"use client";
import React, { useEffect, useState } from "react";
import {
  latencyBar,
  AccessBar,
  statusBar,
  StatusTab,
  StatusTabWrapper,
} from "@/server/models/client/bars";
import CategoriesTabSwitcher, { Tab } from "./switcher/statusTabSwitcher";
import { CategorySwitch } from "./switcher/statusCategorySwitcher";
import {
  flattenCharts,
  StatusBarGroupRenderer,
  StatusChartsWrapper,
} from "./statusChart";

type Props = {
  item: statusBar;
  isRtl?: boolean;
  isDark?: boolean;
  onStatusTabChange?: (tab: Tab) => void;
  statusTab?: Tab;
};

export default function StatusAccordion({
  item,
  isRtl,
  isDark,
  onStatusTabChange,
  statusTab,
}: Props) {
  const [open, setOpen] = useState(false);
  const [border, setBorder] = useState("rounded-xl");
  const [currentStatusTab, setCurrentStatusTab] = useState<StatusTabWrapper>(
    item[statusTab!]
  );

  const handleTabChange = (tab: Tab) => {
    onStatusTabChange!(tab);
    setCurrentStatusTab(item[tab]);
  };

  useEffect(() => {
  }, [isRtl]);
  return (
    <div className={`${isDark ? "text-black" : "text-wite"}`}>
      <br />
      <br />
      <CategoriesTabSwitcher
        activeTab={statusTab!}
        onTabChange={handleTabChange}
        isDark={isDark}
        isRtl={isRtl}
      />
      <br />
      <div className="flex flex-wrap justify-center gap-y-4">
        {currentStatusTab[0].chart[0].slots.map(
          ({ site_name: category, color }) => (
            <CategorySwitch
              key={category}
              label={category}
              initialState={true}
              knobColor={color}
              isDark={isDark}
            />
          )
        )}
      </div>
      <StatusChartsWrapper input={flattenCharts(currentStatusTab)} />
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
