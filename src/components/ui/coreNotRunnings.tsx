import React from "react";

interface CoreDownOverlayProps {
  link: string;
}

export default function CoreDownOverlay({ link }: CoreDownOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 backdrop-blur-md bg-red-900/60" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          🚨 Core Not Running
        </h1>
        <p className="text-xl text-red-200">
          Please contact support to resolve the issue.
        </p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <button className="px-6 py-3 bg-white/90 text-red-800 font-semibold rounded-2xl shadow-lg hover:bg-white">
            Contact Support
          </button>
        </a>
      </div>
    </div>
  );
}
