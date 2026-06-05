
import { EXAM_DATA } from "../../data/readingData";
import SectionHead from "../shared/SectionHead";
import TextBadge from "../shared/TextBadge";
import QuestionCard from "../shared/QuestionCard";

export function Part1Left({ fontScale }) {
  const { texts } = EXAM_DATA.part1;
  return (
    <div>
      <SectionHead icon="📝" label="Reading Material" title="Part 1 — Short Texts" />
      <p className="text-[0.88em] text-text-muted mb-5">{EXAM_DATA.part1.instructions}</p>

      {/* SMS */}
      <div className="qcard mb-4">
        <TextBadge n={1} note="Text message" />
        <div className="max-w-[90%] ml-auto">
          <div className="text-[0.75em] text-slate-400 text-right mb-1">Sam → Alex</div>
          <div 
            className="rt bg-[#DCF8C6] dark:bg-emerald-950/80 dark:text-emerald-100 rounded-[16px_16px_4px_16px] p-[12px_16px] leading-[1.75]" 
            style={{ fontSize: `${fontScale}em` }}
          >
            {texts[0].content}
          </div>
          <div className="text-[0.72em] text-slate-400 text-right mt-1">✓ Delivered · 6:12 PM</div>
        </div>
      </div>

      {/* Shop notice */}
      <div className="qcard mb-4">
        <TextBadge n={2} note="Shop notice" />
        <div 
          className="rt border-[2.5px] border-text bg-[#FFFEF0] dark:bg-[#2A291A] rounded py-3.5 px-4.5 text-center" 
          style={{ fontSize: `${fontScale}em` }}
        >
          <div className="font-ui font-extrabold text-[1.1em] tracking-[0.4px] mb-1.5">{texts[1].title}</div>
          {texts[1].content}
        </div>
      </div>

      {/* Email */}
      <div className="qcard mb-4">
        <TextBadge n={3} note="Email" />
        <div className="bg-[#F8FAFF] dark:bg-[#1E2538] border border-slate-300 dark:border-slate-700 rounded-lg p-[12px_16px]">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2 mb-2.5 flex flex-col gap-0.5">
            <div className="text-[0.78em] text-slate-500 dark:text-slate-400">
              <b className="font-semibold">From:</b> {texts[2].from}
            </div>
            <div className="text-[0.78em] text-slate-700 dark:text-slate-300">
              <b className="font-semibold">Subject:</b> {texts[2].subject}
            </div>
          </div>
          <div 
            className="rt leading-[1.7] whitespace-pre-line" 
            style={{ fontSize: `${fontScale * 0.88}em` }}
          >
            {texts[2].content}
          </div>
        </div>
      </div>

      {/* School announcement */}
      <div className="qcard mb-4">
        <TextBadge n={4} note="School announcement" />
        <div 
          className="rt bg-[#FFFBE6] dark:bg-amber-950/20 border-2 border-[#F6C90E] rounded p-[14px_16px]" 
          style={{ fontSize: `${fontScale}em` }}
        >
          <div className="font-ui font-bold text-center mb-1.5 text-[1.05em]">{texts[3].title}</div>
          {texts[3].content}
        </div>
      </div>

      {/* Road sign */}
      <div className="qcard mb-4">
        <TextBadge n={5} note="Road sign" />
        <div 
          className="bg-blue-700 text-white rounded-lg p-[16px_20px] text-center font-bold whitespace-pre-line leading-[1.9] tracking-[0.3px]" 
          style={{ fontSize: `${fontScale}em` }}
        >
          {texts[4].content}
        </div>
      </div>
    </div>
  );
}

export function Part1Right({ answers, setAnswer, flagged, toggleFlag, submitted }) {
  return (
    <div>
      <SectionHead icon="❓" label="Questions" title="Questions 1–5" />
      {EXAM_DATA.part1.questions.map((q, i) => (
        <QuestionCard 
          key={q.id} 
          qNum={i + 1} 
          question={q} 
          ans={answers[q.id]}
          setAnswer={(v) => setAnswer(q.id, v)} 
          flagged={flagged.has(q.id)}
          toggleFlag={() => toggleFlag(q.id)} 
          submitted={submitted} 
          delay={i * 60} 
          opts4={false} 
        />
      ))}
    </div>
  );
}
