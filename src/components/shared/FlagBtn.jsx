import React from "react";

export default function FlagBtn({ on, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`bg-none border-none cursor-pointer text-[1.1em] transition-colors duration-150 px-0.5 shrink-0 ${
        on ? "text-warning" : "text-[#D1D5DB]"
      }`}
      title="Flag question"
    >
      ⚑
    </button>
  );
}
