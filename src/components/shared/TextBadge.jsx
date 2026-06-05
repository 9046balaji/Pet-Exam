import React from "react";

export default function TextBadge({ n, note }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-5.5 h-5.5 rounded-full bg-primary text-white font-bold text-[0.78em] flex items-center justify-center">
        {n}
      </span>
      <span className="text-[0.75em] font-semibold text-text-light uppercase tracking-[0.05em]">
        {note}
      </span>
    </div>
  );
}
