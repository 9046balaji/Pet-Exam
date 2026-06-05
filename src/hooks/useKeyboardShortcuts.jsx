import { useEffect, useCallback, useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   useKeyboardShortcuts — Global keyboard navigation for PETPrep
   
   Shortcuts:
   → / ← : Next / Previous part
   1-4   : Select answer A/B/C/D (when MCQ focused)
   F     : Flag / unflag current question
   Esc   : Exit focus mode
   Ctrl+Enter : Submit paper
   ?     : Toggle shortcut cheat sheet
   ═══════════════════════════════════════════════════════════════ */
export default function useKeyboardShortcuts({
  currentPart,
  setCurrentPart,
  focusMode,
  setFocusMode,
  onSubmit,
  submitted,
  paperMode,
}) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handler = useCallback(
    (e) => {
      // Don't capture when typing in inputs/textareas
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.target.isContentEditable) return;
      if (paperMode !== "reading") return;
      if (submitted) return;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          setCurrentPart((p) => Math.min(p + 1, 6));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setCurrentPart((p) => Math.max(p - 1, 1));
          break;
        case "Escape":
          if (focusMode) {
            e.preventDefault();
            setFocusMode(false);
          }
          if (showShortcuts) {
            setShowShortcuts(false);
          }
          break;
        case "?":
          e.preventDefault();
          setShowShortcuts((s) => !s);
          break;
        case "Enter":
          if ((e.ctrlKey || e.metaKey) && !submitted) {
            e.preventDefault();
            onSubmit();
          }
          break;
        default:
          break;
      }
    },
    [currentPart, setCurrentPart, focusMode, setFocusMode, onSubmit, submitted, paperMode, showShortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);

  return { showShortcuts, setShowShortcuts };
}

/* ═══════════════════════════════════════════════════════════════
   ShortcutCheatSheet — Overlay showing available shortcuts
   ═══════════════════════════════════════════════════════════════ */
export function ShortcutCheatSheet({ onClose }) {
  const shortcuts = [
    { key: "→ / ←", desc: "Next / Previous part" },
    { key: "Esc", desc: "Exit focus mode" },
    { key: "Ctrl + Enter", desc: "Submit paper" },
    { key: "?", desc: "Toggle this cheat sheet" },
  ];

  return (
    <div
      className="fixed inset-0 z-[998] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeScaleIn 200ms ease" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-text text-base flex items-center gap-2">
            <span className="text-lg">⌨️</span> Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2.5">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-[0.82em] text-text-muted font-medium">
                {s.desc}
              </span>
              <kbd className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[0.75em] font-bold text-text font-mono tracking-wide min-w-[80px] text-center">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-[0.7em] text-text-light mt-4 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[0.9em] font-mono">?</kbd> to toggle
        </p>
      </div>
    </div>
  );
}
