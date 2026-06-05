import React from "react";
import QNumBadge from "./QNumBadge";
import FlagBtn from "./FlagBtn";

export default function QuestionCard({
  qNum,
  question,
  ans,
  setAnswer,
  flagged,
  toggleFlag,
  submitted,
  delay,
  opts4,
  stopProp
}) {
  const isCorrect = submitted && ans === question.correct;
  const isWrong = submitted && ans && ans !== question.correct;

  return (
    <div className="qcard fu" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start gap-2.5 mb-3">
        <QNumBadge n={qNum} />
        <span className="text-[0.88em] font-medium leading-normal text-text flex-1 pt-0.5">
          {question.text}
        </span>
        <FlagBtn on={flagged} onClick={toggleFlag} />
      </div>
      <div className="flex flex-col gap-1.5">
        {question.options.map((o) => {
          let cls = "chip";
          if (submitted) {
            if (o.l === question.correct) cls = "chip ok";
            else if (ans === o.l && isWrong) cls = "chip bad";
          } else if (ans === o.l) cls = "chip sel";
          return (
            <button
              key={o.l}
              className={cls}
              onClick={(e) => {
                if (stopProp) e.stopPropagation();
                if (!submitted) setAnswer(ans === o.l ? null : o.l);
              }}
            >
              <span className="font-bold w-4.5">{o.l}</span>
              <span>{o.t}</span>
            </button>
          );
        })}
      </div>
      {ans && !submitted && (
        <button
          className="mt-1.5 text-[0.75em] text-[#A0AEC0] bg-transparent border-none cursor-pointer hover:text-text"
          onClick={(e) => {
            if (stopProp) e.stopPropagation();
            setAnswer(null);
          }}
        >
          Clear answer
        </button>
      )}
      {submitted && (
        <div className="mt-2.5 text-[0.8em] bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded-lg px-3 py-2 leading-relaxed">
          <b>Explanation:</b> {question.explanation}
        </div>
      )}
    </div>
  );
}
