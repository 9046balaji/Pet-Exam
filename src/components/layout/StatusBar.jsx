
import { fmtTime, cambScale } from "../../utils/readingHelpers";
import { ScaleBadge } from "./CambridgeScaleInfo";

export default function StatusBar({
  timerSec,
  running,
  setRunning,
  answered,
  total,
  scoreEst,
  focusMode,
  timerMode,
  timerDuration,
  onShowShortcuts,
}) {
  /* ── Countdown-aware time display ── */
  const isCountdown = timerMode === "countdown";
  const displayTime = isCountdown ? Math.max(0, timerDuration - timerSec) : timerSec;
  const remainingPct = isCountdown ? (displayTime / timerDuration) * 100 : 100;

  /* ── Timer color: green → amber → red ── */
  const getTimerState = () => {
    if (!isCountdown) return "normal";
    if (displayTime <= 0) return "expired";
    if (displayTime <= 300) return "critical";   // last 5 min
    if (displayTime <= 900) return "warning";     // last 15 min
    return "normal";
  };

  const timerState = getTimerState();
  const timerColorClass = {
    normal: "text-text",
    warning: "text-warning",
    critical: "text-danger",
    expired: "text-danger",
  }[timerState];

  const timerBgClass = {
    normal: "",
    warning: "bg-warning/8",
    critical: "bg-danger/8 animate-pulse",
    expired: "bg-danger/15",
  }[timerState];

  /* ── Progress bar color for countdown ── */
  const progressColor = {
    normal: "var(--color-primary)",
    warning: "var(--color-warning)",
    critical: "var(--color-danger)",
    expired: "var(--color-danger)",
  }[timerState];

  /* ── Cambridge Scale — use scoreEst directly (FIXED: was using wrong formula) ── */
  const { level, color, score } = cambScale(scoreEst);

  return (
    <div className={`bg-[#FAFAF9] dark:bg-[#16171C] border-b border-border py-1.75 px-5 flex items-center justify-between gap-3 sticky z-[198] ${
      focusMode ? "top-[54px]" : "top-[92px] lg:top-[38px]"
    }`}>
      {/* Timer section */}
      <div className="flex items-center gap-2.5">
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition-colors duration-500 ${timerBgClass}`}>
          <span className="text-[14px]">{timerState === "critical" || timerState === "expired" ? "⏰" : "🕐"}</span>
          <span className={`font-bold text-[1.05em] ${timerColorClass} font-mono tracking-wider transition-colors duration-500`}>
            {fmtTime(displayTime)}
          </span>
        </div>

        {/* Mini progress bar for countdown */}
        {isCountdown && (
          <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${remainingPct}%`, background: progressColor }}
            />
          </div>
        )}

        <button
          onClick={() => setRunning((r) => !r)}
          className="bg-transparent border border-border-light rounded-sm px-2 py-0.5 cursor-pointer text-[0.75em] font-semibold text-text-muted hover:bg-surface dark:hover:bg-slate-800 transition-colors"
        >
          {running ? "⏸ Pause" : "▶ Resume"}
        </button>

        {/* Countdown mode badge */}
        {isCountdown && (
          <span className="text-[0.65em] font-bold text-text-light uppercase tracking-wider hidden md:inline">
            countdown
          </span>
        )}
      </div>

      {/* Center — progress */}
      <div className="text-[0.84em] text-text-muted font-medium">
        <span className="text-primary font-bold">{answered}</span> of {total} answered
      </div>

      {/* Right — scale + keyboard hint */}
      <div className="flex items-center gap-2">
        <ScaleBadge level={level} color={color} score={score} />
        {onShowShortcuts && (
          <button
            onClick={onShowShortcuts}
            className="w-7 h-7 rounded-lg flex items-center justify-center border border-border-light text-text-light hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer text-[0.75em]"
            title="Keyboard shortcuts (?)"
          >
            ⌨️
          </button>
        )}
      </div>
    </div>
  );
}
