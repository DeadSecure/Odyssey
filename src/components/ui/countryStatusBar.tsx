// const CountryStatusBar = ({
//   name,
//   percentage,
//   flagUrl,
// }: {
//   name: string;
//   percentage: number;
//   flagUrl: string;
// }) => {
//   return (
//     <div className="flex justify-between items-center bg-gray-800 text-white p-2 rounded-lg">
//       <div className="text-lg">{name}</div>
//       <div className="flex items-center">
//         <span className="text-sm">{percentage}</span>
//         <img src={flagUrl} alt={`${name} flag`} className="w-6 h-6 ml-2" />
//       </div>
//     </div>
//   );
// };

// export default CountryStatusBar;

import React from 'react';

type Props = {
  name: string;
  percentage: number;
  flagUrl: string;
};

const CountryStatus: React.FC<Props> = ({ name, percentage, flagUrl }) => {
  return (
    <div className="flex items-center gap-3 bg-[#1e2a38] text-white px-4 py-2 rounded-xl shadow-md w-fit">
      <span className="font-medium text-m">{name}</span>
      <span className="text-green-400 font-semibold text-sm">{percentage}%</span>
      <img
        src={flagUrl}
        alt="flag"
        className="w-6 h-4 object-cover rounded-sm"
      />
      <span className="text-gray-400 text-xs">▾</span>
    </div>
  );
};

export default CountryStatus;
