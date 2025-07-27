import React from "react";

type Props = {
  name: string;
  percentage: number;
  flagUrl: string;
};

const CountryStatus: React.FC<Props> = ({ name, percentage, flagUrl }) => {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#1e2a38] text-white px-4 py-2 rounded-xl shadow-md w-full">
      <span className="font-medium text-sm flex-1 truncate">{name}</span>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-green-400 font-semibold text-sm">
          {percentage}%
        </span>
        <img
          src={flagUrl}
          alt="flag"
          className="w-6 h-4 object-cover rounded-sm"
        />
        <span className="text-gray-400 text-xs">▾</span>
      </div>
    </div>
  );
};

export default CountryStatus;
