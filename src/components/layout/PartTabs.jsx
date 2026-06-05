import React from "react";

const PICONS = ["📝", "🔗", "📖", "✂️", "🔤", "✏️"];

export default function PartTabs({ current, setCurrent, getProgress }) {
  const getDotClass = (p) => {
    const g = getProgress(p);
    if (g === "complete") return "bg-success";
    if (g === "in_progress") return "bg-warning";
    return "bg-slate-300";
  };

  return (
    <div className="bg-white border-b border-border flex overflow-x-auto sticky top-[54px] lg:top-0 z-[199] shadow-[0_1px_4px_rgba(0,0,0,0.04)] scrollpanel">
      {[1, 2, 3, 4, 5, 6].map((p) => (
        <button
          key={p}
          onClick={() => setCurrent(p)}
          className={`flex items-center gap-1.5 p-[11px_15px] border-none bg-transparent cursor-pointer border-b-[2.5px] whitespace-nowrap transition-all duration-150 shrink-0 text-[0.83em] ${
            current === p
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-text-muted font-normal hover:text-primary"
          }`}
        >
          <span>{PICONS[p - 1]}</span>
          <span>Part {p}</span>
          <span className={`w-1.75 h-1.75 rounded-full shrink-0 ${getDotClass(p)}`}></span>
        </button>
      ))}
    </div>
  );
}
