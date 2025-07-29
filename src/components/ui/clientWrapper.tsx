"use client";
import React from "react";
import StatusAccordion from "./statusAccordion";
import { statusBar } from "@/server/models/client/status";

export default function ClientStatusWrapper({
  statusBars,
}: {
  statusBars: statusBar[];
}) {
  const left = statusBars.filter((_, i) => i % 2 === 0);
  const right = statusBars.filter((_, i) => i % 2 !== 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-12">
      <br />
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        <div className="flex flex-col gap-6 w-full lg:w-1/2 items-center">
          {left.map((item, i) => (
            <StatusAccordion key={i} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-6 w-full lg:w-1/2 items-center">
          {right.map((item, i) => (
            <StatusAccordion key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
