import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   PartInstructions — Shows exam instructions before each part
   Collapsible to a "?" button. Dismissible per session.
   ═══════════════════════════════════════════════════════════════ */

const INSTRUCTIONS = {
  1: {
    title: "Part 1 — Short Texts",
    icon: "📝",
    time: "~5 min",
    questions: "5 questions",
    instruction: "Read five short real-world texts (signs, messages, emails, etc.) and choose the correct answer A, B, or C for each.",
    tip: "Focus on the main purpose or message of each text. Don't get distracted by details that aren't asked about.",
  },
  2: {
    title: "Part 2 — Matching",
    icon: "🔗",
    time: "~7 min",
    questions: "5 questions",
    instruction: "Read descriptions of five people and match each person to the most suitable text (A–H) from a set of eight short texts.",
    tip: "Underline key requirements for each person, then scan the texts for matches. There are 3 extra texts you won't use.",
  },
  3: {
    title: "Part 3 — Long Text",
    icon: "📖",
    time: "~8 min",
    questions: "5 questions",
    instruction: "Read a longer text and answer five multiple-choice questions (A, B, C, or D) about specific details or the writer's opinion.",
    tip: "The questions follow the order of the text. Find the relevant section first, then choose your answer.",
  },
  4: {
    title: "Part 4 — Gapped Text",
    icon: "✂️",
    time: "~8 min",
    questions: "5 questions",
    instruction: "Read a text with five gaps. Choose from eight sentences (A–H) to fill each gap. Three sentences are extra and don't fit anywhere.",
    tip: "Look at the text before and after each gap. Check pronouns, linking words, and topic continuity for clues.",
  },
  5: {
    title: "Part 5 — Multiple Choice Cloze",
    icon: "🔤",
    time: "~7 min",
    questions: "6 questions",
    instruction: "Read a short text with six gaps. For each gap, choose the best word (A, B, C, or D) to complete the sentence.",
    tip: "Think about collocations, grammar patterns, and the overall meaning. Read the whole sentence before choosing.",
  },
  6: {
    title: "Part 6 — Open Cloze",
    icon: "✏️",
    time: "~10 min",
    questions: "6 questions",
    instruction: "Read a short text with six gaps. Write ONE word in each gap to complete the text. No options are given.",
    tip: "Common answers include prepositions, articles, pronouns, and auxiliary verbs. Read the text aloud in your head to check.",
  },
};

export default function PartInstructions({ part, showByDefault = true }) {
  const [dismissed, setDismissed] = useState(!showByDefault);
  const info = INSTRUCTIONS[part];
  if (!info) return null;

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="mb-3 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer flex items-center gap-2 text-[0.8em] font-semibold text-text-muted group"
        title="Show part instructions"
      >
        <span className="text-base group-hover:scale-110 transition-transform">{info.icon}</span>
        <span className="group-hover:text-primary transition-colors">Instructions</span>
      </button>
    );
  }

  return (
    <div className="mb-4 bg-card border border-primary/20 rounded-xl overflow-hidden shadow-sm" style={{ animation: "fadeScaleIn 250ms ease" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{info.icon}</span>
          <div>
            <h3 className="text-[0.9em] font-extrabold text-text tracking-tight">{info.title}</h3>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[0.7em] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{info.questions}</span>
              <span className="text-[0.7em] font-bold text-text-muted">{info.time}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-text-light hover:text-text hover:bg-surface transition-all cursor-pointer text-xs"
          title="Dismiss instructions"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2.5">
        <p className="text-[0.82em] text-text leading-relaxed font-medium">{info.instruction}</p>
        <div className="flex items-start gap-2 bg-warning/8 border border-warning/20 rounded-lg px-3 py-2">
          <span className="text-sm mt-0.5">💡</span>
          <p className="text-[0.78em] text-text-muted leading-relaxed">
            <strong className="text-text font-bold">Tip:</strong> {info.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
