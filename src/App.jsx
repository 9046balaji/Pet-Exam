import { useState, useEffect, useRef } from "react";
import { EXAM_DATA, ALL_QIDS } from "./data/readingData";

/* ── Layout ── */
import Navbar, { TopHeader } from "./components/layout/Navbar";
import PartTabs from "./components/layout/PartTabs";
import StatusBar from "./components/layout/StatusBar";
import BottomBar from "./components/layout/BottomBar";
import ResultsScreen from "./components/layout/ResultsScreen";

/* ── Parts ── */
import { Part1Left, Part1Right } from "./components/reading/Part1";
import { Part2Left, Part2Right } from "./components/reading/Part2";
import { Part3Left, Part3Right } from "./components/reading/Part3";
import { Part4Left, Part4Right } from "./components/reading/Part4";
import { Part5Left, Part5Right } from "./components/reading/Part5";
import { Part6Left, Part6Right } from "./components/reading/Part6";

/* ── Writing ── */
import WritingPaper from "./components/writing/WritingPaper";

/* ── Profile & History ── */
import ProfileAnalytics from "./components/profile/ProfileAnalytics";
import AttemptHistory from "./components/profile/AttemptHistory";


/* ═══════════════════════════════════════════════════════════
   Main PETPrep Exam App
   ═══════════════════════════════════════════════════════════ */

export default function App() {
  /* ── State ── */
  const [currentPart, setCurrentPart] = useState(1);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [focusMode, setFocusMode] = useState(false);

  /* Mode switcher state */
  const [paperMode, setPaperMode] = useState("reading"); // "reading" | "writing"
  const [writingPart, setWritingPart] = useState(1); // 1 | 2
  const [isSidebarOpen, setSidebarOpen] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth > 1024 : true)
  );

  /* Timer */
  const [timerSec, setTimerSec] = useState(0);
  const [running, setRunning] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTimerSec(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  /* Part 3 active paragraph highlight */
  const [activePara, setActivePara] = useState(null);

  /* ── Helpers ── */
  const setAnswer = (id, val) => setAnswers(a => ({ ...a, [id]: val }));
  const toggleFlag = (id) =>
    setFlagged(f => {
      const next = new Set(f);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const answered = Object.values(answers).filter(v => v && v.toString().trim() !== "").length;
  const total = ALL_QIDS.length;
  const scoreEst = Object.keys(answers).reduce((n, id) => {
    const val = answers[id];
    if (!val || val.toString().trim() === "") return n;
    // check correctness across all parts
    const allQs = [
      ...EXAM_DATA.part1.questions,
      ...EXAM_DATA.part2.questions,
      ...EXAM_DATA.part3.questions,
    ];
    const found = allQs.find(q => q.id === id);
    if (found && val === found.correct) return n + 1;
    // part 4 sentences
    const p4 = EXAM_DATA.part4;
    if (p4 && p4.sentences) {
      const s = p4.sentences.find(s => `q4_${s.n}` === id);
      if (s && val === s.correct) return n + 1;
    }
    // part 5 gaps
    const p5g = EXAM_DATA.part5.gaps.find(g => g.id === id);
    if (p5g && val === p5g.correct) return n + 1;
    // part 6 gaps
    const p6g = EXAM_DATA.part6.gaps.find(g => g.id === id);
    if (p6g && val.toString().toLowerCase().trim() === p6g.correct.toLowerCase().trim()) return n + 1;
    return n;
  }, 0);

  const getProgress = (p) => {
    const ids = ALL_QIDS.filter(q => q.part === p).map(q => q.id);
    const done = ids.filter(id => answers[id] && answers[id].toString().trim() !== "").length;
    if (done === 0) return "none";
    if (done === ids.length) return "complete";
    return "in_progress";
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setRunning(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setFlagged(new Set());
    setSubmitted(false);
    setCurrentPart(1);
    setTimerSec(0);
    setRunning(true);
    setActivePara(null);
  };

  const renderLeft = () => {
    const props = { fontScale, answers, setAnswer: (id, v) => setAnswer(id, v) };
    switch (currentPart) {
      case 1: return <Part1Left fontScale={fontScale} />;
      case 2: return <Part2Left fontScale={fontScale} />;
      case 3: return <Part3Left activePara={activePara} fontScale={fontScale} />;
      case 4: return <Part4Left answers={answers} setAnswer={(id, v) => setAnswer(id, v)} fontScale={fontScale} />;
      case 5: return <Part5Left answers={answers} setAnswer={(id, v) => setAnswer(id, v)} fontScale={fontScale} />;
      case 6: return <Part6Left answers={answers} setAnswer={(id, v) => setAnswer(id, v)} fontScale={fontScale} />;
      default: return null;
    }
  };

  const renderRight = () => {
    const base = {
      answers,
      setAnswer: (id, v) => setAnswer(id, v),
      flagged,
      toggleFlag: (id) => toggleFlag(id),
      submitted,
    };
    switch (currentPart) {
      case 1: return <Part1Right {...base} />;
      case 2: return <Part2Right {...base} />;
      case 3: return <Part3Right {...base} setActivePara={setActivePara} />;
      case 4: return <Part4Right answers={answers} />;
      case 5: return <Part5Right {...base} />;
      case 6: return <Part6Right {...base} />;
      default: return null;
    }
  };

  /* ═══════════════════════════════════════════════════════════
     LAYOUT
     ═══════════════════════════════════════════════════════════ */
  return (
    <div
      className={`flex bg-surface ${paperMode === "writing" ? "h-screen overflow-hidden" : "min-h-screen"}`}
      style={{ fontSize: `${fontScale}em` }}
    >
      {/* Sidebar nav */}
      <Navbar
        fontScale={fontScale}
        setFontScale={setFontScale}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        currentPart={currentPart}
        setCurrentPart={setCurrentPart}
        paperMode={paperMode}
        setPaperMode={setPaperMode}
        writingPart={writingPart}
        setWritingPart={setWritingPart}
        getProgress={getProgress}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          paperMode === "writing" ? "h-screen overflow-hidden" : ""
        } ${isSidebarOpen && !focusMode ? "lg:pl-64" : "lg:pl-0"}`}
      >
        {/* Top Header */}
        <TopHeader
          fontScale={fontScale}
          setFontScale={setFontScale}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          currentPart={currentPart}
          paperMode={paperMode}
          setPaperMode={setPaperMode}
          writingPart={writingPart}
          setSidebarOpen={setSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />

        {paperMode === "reading" ? (
          <>
            {/* Status bar */}
            <StatusBar
              timerSec={timerSec}
              running={running}
              setRunning={setRunning}
              answered={answered}
              total={total}
              scoreEst={scoreEst}
              focusMode={focusMode}
            />

            {/* Part tabs */}
            {!focusMode && (
              <PartTabs
                current={currentPart}
                setCurrent={setCurrentPart}
                getProgress={getProgress}
              />
            )}

            {/* Two-panel workspace */}
            <div
              className="flex flex-col lg:flex-row gap-5 max-w-[1400px] w-full mx-auto"
              style={{ padding: "24px 20px 100px" }}
            >
              {/* Left panel — Reading Material */}
              <div className="flex-1 min-w-0">{renderLeft()}</div>

              {/* Right panel — Questions */}
              <div className="w-full lg:w-[420px] shrink-0">{renderRight()}</div>
            </div>

            {/* Bottom bar */}
            <BottomBar
              currentPart={currentPart}
              setCurrent={setCurrentPart}
              answers={answers}
              flagged={flagged}
              allAnswered={answered === total}
              onSubmit={handleSubmit}
            />
          </>
        ) : paperMode === "writing" ? (
          <WritingPaper
            fontScale={fontScale}
            currentPart={writingPart}
            setCurrentPart={setWritingPart}
            focusMode={focusMode}
            setFocusMode={setFocusMode}
          />
        ) : paperMode === "profile" ? (
          <ProfileAnalytics
            fontScale={fontScale}
            setPaperMode={setPaperMode}
            setWritingPart={setWritingPart}
          />
        ) : paperMode === "history" ? (
          <AttemptHistory
            fontScale={fontScale}
            setPaperMode={setPaperMode}
            setWritingPart={setWritingPart}
          />
        ) : null}
      </div>
    </div>
  );
}
