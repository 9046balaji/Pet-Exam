import React from "react";

export default function QNumBadge({ n }) {
  return (
    <span className="w-7 h-7 rounded-full bg-primary text-white font-bold text-[0.82em] flex items-center justify-center shrink-0">
      {n}
    </span>
  );
}
