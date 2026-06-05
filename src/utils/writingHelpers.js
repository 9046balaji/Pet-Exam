/* ════════════════════════════════════════════════════════════════
   WRITING HELPERS — text analysis utilities
════════════════════════════════════════════════════════════════ */

export function wordCount(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function sentenceCount(text) {
  const matches = text.match(/[.!?]+/g);
  return matches ? matches.length : 0;
}

export function paragraphCount(text) {
  return text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim() !== "").length;
}

export function avgSentenceLength(text) {
  const wc = wordCount(text);
  const sc = sentenceCount(text);
  return sc > 0 ? Math.round(wc / sc) : 0;
}

export function detectTone(text) {
  const lower = text.toLowerCase();
  const formalSignals = ["dear ", "i am writing", "yours sincerely", "yours faithfully", "i would like to"];
  const informalSignals = ["hi ", "hey ", "thanks", "can't", "don't", "won't", "it's", "i'm", "you're", "we're", "that's", "what's"];
  const formalCount = formalSignals.filter((s) => lower.includes(s)).length;
  const informalCount = informalSignals.filter((s) => lower.includes(s)).length;
  if (formalCount > 0 && informalCount < 2) return "formal";
  if (informalCount >= 2) return "informal";
  return "neutral";
}

export function detectPresentTense(text) {
  const presentPatterns = /\b(am|is|are|have|has|go|goes|do|does|want|wants|think|thinks|know|knows|feel|feels|see|sees|look|looks|come|comes|get|gets|make|makes|take|takes|say|says|tell|tells|run|runs|walk|walks|work|works|play|plays|love|loves|hate|hates|like|likes|need|needs)\b/gi;
  const matches = text.match(presentPatterns);
  return matches ? matches.length : 0;
}

export function formatTimer(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
