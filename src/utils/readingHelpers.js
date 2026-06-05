import { EXAM_DATA } from "../data/readingData";

export const fmtTime = (s) => 
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function computeResults(answers) {
  let correct = 0, incorrect = 0, skipped = 0;
  const rows = [];
  
  const add = (qNum, part, text, given, right, exp) => {
    const norm = (v) => (v || "").toLowerCase().trim();
    const s = !given || norm(given) === "" ? "skip" : norm(given) === norm(right) ? "ok" : "bad";
    if (s === "ok") correct++;
    else if (s === "bad") incorrect++;
    else skipped++;
    rows.push({ qNum, part, text, given: given || "—", right, exp, s });
  };

  EXAM_DATA.part1.questions.forEach((q, i) => 
    add(i + 1, 1, q.text, answers[q.id], q.correct, q.explanation)
  );

  EXAM_DATA.part2.questions.forEach((q, i) => {
    const b = EXAM_DATA.part2.books.find(x => x.id === q.correct);
    add(i + 6, 2, `${q.name}: which book?`, answers[q.id], q.correct, `${q.correct} — ${b?.title}. ${q.explanation}`);
  });

  EXAM_DATA.part3.questions.forEach((q, i) => 
    add(i + 11, 3, q.text, answers[q.id], q.correct, q.explanation)
  );

  [1, 2, 3, 4, 5].forEach(n => {
    const corr = EXAM_DATA.part4.answers[n];
    const s = EXAM_DATA.part4.sentences.find(x => x.id === corr);
    add(n + 15, 4, `Gap ${n}`, answers[`q4_${n}`], corr, `${corr}: "${s?.text.slice(0, 55)}…" — ${EXAM_DATA.part4.explanations[n]}`);
  });

  EXAM_DATA.part5.gaps.forEach((g, i) => {
    const o = g.opts.find(x => x.l === g.correct);
    add(i + 21, 5, `Gap ${g.n}: best word`, answers[g.id], g.correct, `${g.correct} (${o?.w}) — ${g.explanation}`);
  });

  EXAM_DATA.part6.gaps.forEach((g, i) => 
    add(i + 27, 6, `Gap ${g.n}: write one word`, answers[g.id], g.correct, g.explanation)
  );

  return { rows, correct, incorrect, skipped };
}

export function cambScale(correct) {
  const p = correct / 32;
  if (p >= 0.875) return { score: 170, grade: "Grade A", level: "B2", color: "#00B894" };
  if (p >= 0.75) return { score: 162, grade: "Grade B", level: "B2", color: "#00B894" };
  if (p >= 0.625) return { score: 154, grade: "Grade B", level: "B1", color: "#6C5CE7" };
  if (p >= 0.5) return { score: 146, grade: "Grade C", level: "B1", color: "#6C5CE7" };
  if (p >= 0.375) return { score: 136, grade: "Fail", level: "A2", color: "#E17055" };
  return { score: 122, grade: "Fail", level: "Below A2", color: "#E17055" };
}
