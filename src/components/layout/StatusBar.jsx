import React from "react";
import { fmtTime, cambScale } from "../../utils/readingHelpers";

export default function StatusBar({
  timerSec,
  running,
  setRunning,
  answered,
  total,
  scoreEst,
  focusMode
}) {
  const getTimerColorClass = () => {
    if (timerSec <= 180) return "text-danger";
    if (timerSec <= 600) return "text-warning";
    return "text-text";
  };

  const { level, color } = cambScale(Math.round((scoreEst / 32) * answered));

  return (
    <div className={`bg-[#FAFAF9] border-b border-border py-1.75 px-5 flex items-center justify-between gap-3 sticky z-[198] ${
      focusMode ? "top-[54px]" : "top-[92px] lg:top-[38px]"
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-[14px]">🕐</span>
        <span className={`font-bold text-[1.05em] ${getTimerColorClass()} font-mono tracking-wider`}>
          {fmtTime(timerSec)}
        </span>
        <button
          onClick={() => setRunning((r) => !r)}
          className="bg-transparent border border-border-light rounded-sm px-2 py-0.5 cursor-pointer text-[0.75em] font-semibold text-text-muted hover:bg-slate-50 transition-colors"
        >
          {running ? "⏸ Pause" : "▶ Resume"}
        </button>
      </div>

      <div className="text-[0.84em] text-text-muted font-medium">
        <span className="text-primary font-bold">{answered}</span> of {total} answered
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border-light bg-white">
        <span className="text-[0.72em] text-text-muted">Est. level</span>
        <span className="font-bold text-[0.85em]" style={{ color }}>
          {level}
        </span>
      </div>
    </div>
  );
}
