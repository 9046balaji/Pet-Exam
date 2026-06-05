import { useState, useEffect } from "react";
import { EXAM_DATA } from "../../data/readingData";

const ALL_QIDS = [
  ...EXAM_DATA.part1.questions.map((q, idx) => ({ id: q.id, part: 1, label: `Q${idx + 1}` })),
  ...EXAM_DATA.part2.questions.map((q, idx) => ({ id: q.id, part: 2, label: `Q${idx + 6}` })),
  ...EXAM_DATA.part3.questions.map((q, idx) => ({ id: q.id, part: 3, label: `Q${idx + 11}` })),
  ...[1, 2, 3, 4, 5].map((n, idx) => ({ id: `q4_${n}`, part: 4, label: `Q${idx + 16}` })),
  ...EXAM_DATA.part5.gaps.map((g, idx) => ({ id: g.id, part: 5, label: `Q${idx + 21}` })),
  ...EXAM_DATA.part6.gaps.map((g, idx) => ({ id: g.id, part: 6, label: `Q${idx + 27}` })),
];

export default function ReviewModal({
  isOpen,
  onClose,
  answers,
  flagged,
  onSubmit,
  setCurrentPart,
}) {
  if (!isOpen) return null;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const totalQuestions = ALL_QIDS.length;
  const answeredCount = ALL_QIDS.filter(
    (q) => answers[q.id] && answers[q.id].toString().trim() !== ""
  ).length;
  const flaggedCount = ALL_QIDS.filter((q) => flagged.has(q.id)).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleJumpToQuestion = (questionId, partNum) => {
    setCurrentPart(partNum);
    onClose();

    // Small delay to allow tab change and layout rendering
    setTimeout(() => {
      const el = document.getElementById(questionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlight-flash");
        setTimeout(() => {
          el.classList.remove("highlight-flash");
        }, 1500);
      }
    }, 120);
  };

  const getPartName = (partNum) => {
    switch (partNum) {
      case 1:
        return "Part 1 — Short Texts";
      case 2:
        return "Part 2 — Matching";
      case 3:
        return "Part 3 — Long Text";
      case 4:
        return "Part 4 — Gapped Text";
      case 5:
        return "Part 5 — Word Choice";
      case 6:
        return "Part 6 — Open Fill";
      default:
        return `Part ${partNum}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-all duration-300">
      <div 
        className="bg-card border border-border text-text rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative animate-fade-in"
        style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-light hover:text-text cursor-pointer transition-colors p-2 rounded-full hover:bg-surface"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border pb-5">
          <div className="text-[0.75em] font-extrabold uppercase tracking-widest text-primary mb-1">
            Submission Check
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-text leading-tight flex items-center gap-2">
            <span>📝</span> Review Your Exam
          </h2>
          <p className="text-text-muted mt-2 text-[0.88em]">
            Double-check your responses and flagged items. Click any question card to jump back and revise.
          </p>
        </div>

        {/* Stats Panels */}
        <div className="px-6 md:px-8 py-4 bg-surface dark:bg-surface/30 grid grid-cols-3 gap-3 md:gap-4 border-b border-border">
          {/* Answered */}
          <div className="bg-card border border-border rounded-xl p-3 md:p-4 text-center shadow-sm flex flex-col justify-center">
            <span className="text-[0.72em] uppercase tracking-wider font-extrabold text-success mb-1">
              Answered
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-success">
              {answeredCount}
            </span>
          </div>

          {/* Flagged */}
          <div className="bg-card border border-border rounded-xl p-3 md:p-4 text-center shadow-sm flex flex-col justify-center">
            <span className="text-[0.72em] uppercase tracking-wider font-extrabold text-warning mb-1">
              Flagged
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-warning">
              {flaggedCount}
            </span>
          </div>

          {/* Unanswered */}
          <div className="bg-card border border-border rounded-xl p-3 md:p-4 text-center shadow-sm flex flex-col justify-center">
            <span className="text-[0.72em] uppercase tracking-wider font-extrabold text-danger mb-1">
              Unanswered
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-danger animate-pulse">
              {unansweredCount}
            </span>
          </div>
        </div>

        {/* Question Sections Grid */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Warning Banner if Unanswered exists */}
          {unansweredCount > 0 && (
            <div className="bg-danger/10 border border-danger/30 rounded-xl px-4 py-3 text-[0.84em] text-danger flex items-start gap-2.5">
              <span className="text-base mt-0.5">⚠️</span>
              <div>
                <span className="font-extrabold">Warning:</span> You have {unansweredCount} unanswered question{unansweredCount !== 1 ? "s" : ""}. We recommend attempting all questions since there is no negative marking in the B1 Preliminary exam.
              </div>
            </div>
          )}

          {[1, 2, 3, 4, 5, 6].map((partNum) => {
            const partQs = ALL_QIDS.filter((q) => q.part === partNum);
            return (
              <div key={partNum} className="space-y-3">
                <h3 className="text-[0.9em] font-extrabold text-text/80 uppercase tracking-wider border-b border-border pb-1.5 flex items-center justify-between">
                  <span>{getPartName(partNum)}</span>
                  <span className="text-[0.8em] font-bold text-text-light capitalize normal-case">
                    {partQs.filter(q => answers[q.id] && answers[q.id].toString().trim() !== "").length} / {partQs.length} done
                  </span>
                </h3>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                  {partQs.map((q) => {
                    const isAnswered = answers[q.id] && answers[q.id].toString().trim() !== "";
                    const isFlagged = flagged.has(q.id);

                    let btnStyles = "border-border bg-card text-text hover:border-primary hover:bg-primary-light/10";
                    let dotColor = "bg-neutral";

                    if (isFlagged) {
                      btnStyles = "border-warning bg-warning/5 text-text hover:bg-warning/10";
                      dotColor = "bg-warning";
                    } else if (isAnswered) {
                      btnStyles = "border-success/30 bg-success/5 text-text hover:bg-success/10";
                      dotColor = "bg-success";
                    } else {
                      btnStyles = "border-dashed border-2 border-border bg-card/40 text-text-light hover:border-primary hover:text-primary";
                      dotColor = "bg-danger";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => handleJumpToQuestion(q.id, partNum)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${btnStyles}`}
                        title={`${q.label} · Part ${partNum}`}
                      >
                        <span className="text-[0.92em] font-extrabold leading-none">{q.label}</span>
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                          <span className="text-[0.7em] font-semibold text-text-light tracking-wide uppercase leading-none">
                            {isFlagged ? "Flag" : isAnswered ? answers[q.id].toString() : "Empty"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3 bg-surface/20">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border text-text font-bold text-[0.88em] hover:bg-surface cursor-pointer transition-all duration-150 text-center"
          >
            Cancel & Keep Practising
          </button>
          <button
            onClick={onSubmit}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-danger hover:bg-danger/90 text-white font-extrabold text-[0.88em] cursor-pointer shadow-lg shadow-danger/25 transition-all duration-150 hover:-translate-y-0.5 text-center"
          >
            Confirm & Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
