import {
  statusBar,
  StatusTabWrapper,
  StatusTab,
} from "@/server/models/client/bars";
import React from "react";

// Reuse your types
type BarSegment = { color: string; up: boolean };
type ChartData = Record<string, BarSegment[]>;

type StatusChartProps = {
  configName: string;
  chartData: ChartData;
};

// Util: convert StatusTab[] to chartData format
function transformToChartData(chart: StatusTab[]): ChartData {
  const result: ChartData = {};

  chart.forEach(({ timestamp, slots }) => {
    result[timestamp] = slots.map((slot) => ({
      color: slot.color,
      up: slot.up,
    }));
  });

  return result;
}

const StatusChart: React.FC<StatusChartProps> = ({ configName, chartData }) => {
  const timeKeys = Object.keys(chartData);

  return (
    <div className="bg-[#1e2a38] text-white p-4 rounded-xl shadow-md mb-6 w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-sm font-semibold">{configName}</span>
        <div className="flex items-center space-x-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span>ONLINE</span>
        </div>
      </div>

      <div className="flex space-x-1 overflow-x-auto">
        {timeKeys.map((time, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1">
            <span className="text-[10px] text-gray-300">{parseTime(time)}</span>
            <div className="w-4 h-24 flex flex-col-reverse items-center">
              {chartData[time].map((seg, i) => (
                <div
                  key={i}
                  className={`${
                    seg.up ? seg.color : "bg-[transparent]"
                  } h-3 w-full rounded-sm`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type Props = {
  data: statusBar;
};

export const StatusBarGroupRenderer: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-10">
      {Object.entries(data).map(([category, configs]) => (
        <div key={category}>
          <h2 className="text-xl font-bold mb-4">{category.toUpperCase()}</h2>
          <div className="space-y-6">
            {configs.map(
              (item: { config_name: string; chart: StatusTab[] }) => {
                const chartData = transformToChartData(item.chart);
                return (
                  <StatusChart
                    key={item.config_name}
                    configName={item.config_name}
                    chartData={chartData}
                  />
                );
              }
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

type FlatStatus = {
  name: string;
  time: string;
  color: string;
  up: boolean;
  site_name: string;
};

export function flattenCharts(wrapper: StatusTabWrapper): FlatStatus[] {
  const flattened: FlatStatus[] = [];

  for (const config of wrapper) {
    for (const chart of config.chart) {
      for (const slot of chart.slots) {
        flattened.push({
          name: config.config_name,
          time: chart.timestamp,
          color: slot.color,
          up: slot.up,
          site_name: slot.site_name,
        });
      }
    }
  }

  return flattened;
}

type Grouped = Record<string, Record<string, [string, string, boolean][]>>;

function groupFlattened(data: FlatStatus[]): Grouped {
  const result: Grouped = {};
  data.forEach(({ name, time, color, site_name, up }) => {
    if (!result[name]) result[name] = {};
    if (!result[name][time]) result[name][time] = [];
    result[name][time].push([color, site_name, up]);
  });
  return result;
}

export const StatusChartsWrapper = ({ input }: { input: FlatStatus[] }) => {
  const grouped = groupFlattened(input);

  return (
    <div className="w-full px-4 flex flex-col gap-6 ">
      {Object.entries(grouped).map(([configName, timeline]) => (
        <div
          key={configName}
          className="bg-[#1e2a38] p-4 rounded-xl shadow-md w-full overflow-x-auto"
        >
          <div className="flex items-center justify-between mb-2  px-2 border-b border-white">
            <span className="text-white text-sm font-semibold uppercase">
              {configName}
            </span>
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              ONLINE
            </div>
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {Object.entries(timeline).map(([time, colors]) => (
              <div
                key={time}
                className="flex flex-col items-center text-white text-[10px] space-y-1 border-r border-gray-600 pr-[3px]"
              >
                <br />
                <span>{parseTime(time)}</span>
                <div className="w-4 h-24 flex flex-col-reverse gap-[2px] ">
                  {colors.map((c, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: !c[2] ? c[0] : "transparent" }}
                      className={`w-full h-3 ${c[1]}`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

function parseTime(raw_time: string): string {
  // handle both "2025-08-16 22:45:12" and "2025-08-16, 22:45:12"
  const cleaned = raw_time.replace(",", "");
  const parts = cleaned.split(" ");
  if (parts.length < 2) return ""; // fallback if format unexpected

  const timePart = parts[1];
  const [hour, minute] = timePart.split(":");
  return `${hour}:${minute}`;
}
