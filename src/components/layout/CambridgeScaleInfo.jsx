import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   CambridgeScaleInfo — Visual explanation of the Cambridge Scale
   Shows when user clicks the "Est. level" badge in StatusBar.
   ═══════════════════════════════════════════════════════════════ */

const BANDS = [
  { range: "Below 120", label: "Pre-A1", color: "#9CA3AF", desc: "Basic understanding only" },
  { range: "120–139", label: "A2", color: "#E17055", desc: "Elementary level — can handle simple situations" },
  { range: "140–152", label: "B1", color: "#6C5CE7", desc: "PET Pass — independent user" },
  { range: "153–159", label: "B1+", color: "#6C5CE7", desc: "PET Merit — strong B1 performance" },
  { range: "160–170", label: "B2", color: "#00B894", desc: "PET Distinction — FCE entry level" },
];

export default function CambridgeScaleInfo({ currentScore, currentLevel, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[997] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeScaleIn 250ms ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-extrabold text-text text-base flex items-center gap-2">
              <span className="text-lg">📊</span> Cambridge Scale
            </h3>
            <p className="text-[0.75em] text-text-muted mt-0.5">
              How PET scores map to CEFR levels
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Visual Scale */}
        <div className="mb-5">
          <div className="flex rounded-xl overflow-hidden h-8 border border-border">
            {BANDS.map((band, i) => (
              <div
                key={band.label}
                className="flex items-center justify-center text-[0.65em] font-bold text-white relative"
                style={{
                  background: band.color,
                  flex: i === 0 ? 1 : i === 1 ? 1.5 : 1,
                  opacity: currentLevel === band.label ? 1 : 0.6,
                }}
              >
                {band.label}
                {currentLevel === band.label && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent" style={{ borderTopColor: band.color }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[0.65em] text-text-light font-medium">100</span>
            <span className="text-[0.65em] text-text-light font-medium">120</span>
            <span className="text-[0.65em] text-text-light font-medium">140</span>
            <span className="text-[0.65em] text-text-light font-medium">160</span>
            <span className="text-[0.65em] text-text-light font-medium">170</span>
          </div>
        </div>

        {/* Band details */}
        <div className="space-y-2">
          {BANDS.map((band) => (
            <div
              key={band.label}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                currentLevel === band.label
                  ? "border-primary bg-primary/5"
                  : "border-transparent"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: band.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[0.82em] font-bold text-text">{band.label}</span>
                  <span className="text-[0.7em] text-text-light font-medium">{band.range}</span>
                </div>
                <p className="text-[0.72em] text-text-muted">{band.desc}</p>
              </div>
              {currentLevel === band.label && (
                <span className="text-[0.7em] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  You
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Current score */}
        {currentScore && (
          <div className="mt-4 pt-4 border-t border-border text-center">
            <span className="text-[0.75em] text-text-muted">Your estimated score: </span>
            <span className="text-[1em] font-extrabold text-primary">{currentScore}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ScaleBadge — Clickable badge that opens the info modal
   Used in StatusBar to replace the plain text level indicator
   ═══════════════════════════════════════════════════════════════ */
export function ScaleBadge({ level, color, score }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowInfo(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border-light bg-card hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
        title="Click to learn about the Cambridge Scale"
      >
        <span className="text-[0.72em] text-text-muted">Est. level</span>
        <span className="font-bold text-[0.85em]" style={{ color }}>
          {level}
        </span>
        <span className="text-[0.6em] text-text-light group-hover:text-primary transition-colors">ⓘ</span>
      </button>
      {showInfo && (
        <CambridgeScaleInfo
          currentScore={score}
          currentLevel={level}
          onClose={() => setShowInfo(false)}
        />
      )}
    </>
  );
}
