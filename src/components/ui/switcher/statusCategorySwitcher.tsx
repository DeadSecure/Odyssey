import React, { useState } from "react";

type CategorySwitchProps = {
  label: string;
  initialState?: boolean;
  knobColor?: string; // Tailwind class, e.g., "bg-gray-400"
  onToggle?: (state: boolean) => void;
  isDark?: boolean;
};

export const CategorySwitch: React.FC<CategorySwitchProps> = ({
  label,
  initialState = false,
  knobColor = "bg-gray-400",
  onToggle,
  isDark,
}) => {
  const [enabled, setEnabled] = useState(initialState);

  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    // onToggle?.(newState);

    let elements = document.querySelectorAll(`.${label}`);
    elements.forEach((el) => {
      if (!enabled) {
        el.classList.remove("switch-transparent");
      } else {
        el.classList.add("switch-transparent");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center sm:w-24 w-20 mx-1 mb-2">
      <span className="text-[12px] text-center font-medium leading-tight">
        {label}
      </span>

      <button
        onClick={toggle}
        className={`w-14 h-7 sm:w-16 sm:h-8 rounded-full flex items-center px-1 transition-colors duration-300`}
        style={{
          backgroundColor: !isDark ? "gray" : "#41aea9",
          opacity: enabled ? "1" : "0.5",
        }}
      >
        <div
          style={{ backgroundColor: knobColor }}
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transform transition-transform duration-300 ${
            enabled ? "translate-x-7 sm:translate-x-8" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
