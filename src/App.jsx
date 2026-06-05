import { useState, useEffect, useRef, useCallback } from "react";
import { computeResults, cambScale, fmtTime } from "./utils/readingHelpers";
import { EXAM_DATA, ALL_QIDS } from "./data/readingData";

/* ── Layout ── */
import Navbar, { TopHeader } from "./components/layout/Navbar";
import StatusBar from "./components/layout/StatusBar";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import BottomBar from "./components/layout/BottomBar";
import PartTabs from "./components/layout/PartTabs";
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

/* ── Settings ── */
import SettingsPage from "./components/settings/SettingsPage";

/* ── Hooks ── */
import useKeyboardShortcuts, { ShortcutCheatSheet } from "./hooks/useKeyboardShortcuts";
import useToast from "./hooks/useToast";

/* ── Reading Extras ── */
import PartInstructions from "./components/reading/PartInstructions";


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
  const [paperMode, setPaperMode] = useState("reading"); // "reading" | "writing" | "profile" | "history" | "settings"
  const [writingPart, setWritingPart] = useState(1); // 1 | 2
  const [isSidebarOpen, setSidebarOpen] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth > 1024 : true)
  );

  /* ── Timer (reads prefs from localStorage — reactive on paperMode switch) ── */
  const getTimerPrefs = useCallback(() => {
    try {
      const saved = localStorage.getItem("petPrepPrefs");
      if (saved) {
        const p = JSON.parse(saved);
        return {
          timerMode: p.timerMode || "countup",
          timerDuration: p.timerDuration === 0 ? (p.customDuration || 45) * 60 : (p.timerDuration || 2700),
        };
      }
    } catch {}
    return { timerMode: "countup", timerDuration: 2700 };
  }, []);

  const [timerPrefs, setTimerPrefs] = useState(getTimerPrefs);
  const [timerSec, setTimerSec] = useState(0);
  const [running, setRunning] = useState(true);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const timerRef = useRef(null);

  /* Re-read timer prefs whenever user switches back to reading from settings */
  useEffect(() => {
    if (paperMode === "reading") {
      setTimerPrefs(getTimerPrefs());
    }
  }, [paperMode, getTimerPrefs]);

  useEffect(() => {
    if (running && !submitted) {
      timerRef.current = setInterval(() => setTimerSec(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running, submitted]);

  /* Auto-submit warning when countdown reaches 0 */
  useEffect(() => {
    if (timerPrefs.timerMode === "countdown" && !submitted) {
      const remaining = timerPrefs.timerDuration - timerSec;
      if (remaining <= 0 && running) {
        setRunning(false);
        setShowTimeUpModal(true);
      }
    }
  }, [timerSec, submitted, running, timerPrefs]);

  /* ── Auto-save answers every 10s (F4: 3.2) ── */
  /* Use refs for volatile values to prevent interval reset on every timerSec change */
  const answersRef = useRef(answers);
  const flaggedRef = useRef(flagged);
  const timerSecRef = useRef(timerSec);
  const currentPartRef = useRef(currentPart);
  const paperModeRef = useRef(paperMode);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { flaggedRef.current = flagged; }, [flagged]);
  useEffect(() => { timerSecRef.current = timerSec; }, [timerSec]);
  useEffect(() => { currentPartRef.current = currentPart; }, [currentPart]);
  useEffect(() => { paperModeRef.current = paperMode; }, [paperMode]);

  useEffect(() => {
    const id = setInterval(() => {
      if (Object.keys(answersRef.current).length === 0) return;
      localStorage.setItem("petPrepAutoSave", JSON.stringify({
        answers: answersRef.current,
        flagged: [...flaggedRef.current],
        timerSec: timerSecRef.current,
        currentPart: currentPartRef.current,
        paperMode: paperModeRef.current,
        savedAt: Date.now(),
      }));
    }, 10000);
    return () => clearInterval(id);
  }, []); // Single stable interval — no deps churn

  /* ── Restore session on mount (F4: 3.2) ── */
  const [showRestoreToast, setShowRestoreToast] = useState(false);
  const autoSaveRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("petPrepAutoSave");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.answers && Object.keys(data.answers).length > 0) {
          const age = Date.now() - (data.savedAt || 0);
          if (age < 3600000) { // less than 1 hour old
            autoSaveRef.current = data;
            setShowRestoreToast(true);
          } else {
            localStorage.removeItem("petPrepAutoSave");
          }
        }
      }
    } catch {}
  }, []);

  /* Auto-dismiss restore toast after 15 seconds if ignored */
  useEffect(() => {
    if (!showRestoreToast) return;
    const timeout = setTimeout(() => {
      setShowRestoreToast(false);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [showRestoreToast]);

  const restoreSession = () => {
    if (autoSaveRef.current) {
      setAnswers(autoSaveRef.current.answers || {});
      setFlagged(new Set(autoSaveRef.current.flagged || []));
      setTimerSec(autoSaveRef.current.timerSec || 0);
      setCurrentPart(autoSaveRef.current.currentPart || 1);
    }
    setShowRestoreToast(false);
    localStorage.removeItem("petPrepAutoSave");
  };

  const dismissRestore = () => {
    setShowRestoreToast(false);
    localStorage.removeItem("petPrepAutoSave");
  };

  /* ── beforeunload guard (F4: 3.2) ── */
  useEffect(() => {
    const handler = (e) => {
      if (Object.keys(answers).length > 0 && !submitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [answers, submitted]);

  /* Part 3 active paragraph highlight */
  const [activePara, setActivePara] = useState(null);

  /* ── Toast notifications (F9: Quick Win #6) ── */
  const { toast, ToastContainer } = useToast();

  /* ── Helpers ── */
  const setAnswer = (id, val) => setAnswers(a => ({ ...a, [id]: val }));
  const toggleFlag = (id) =>
    setFlagged(f => {
      const next = new Set(f);
      if (next.has(id)) {
        next.delete(id);
        toast("Flag removed", "info");
      } else {
        next.add(id);
        toast("Question flagged for review", "warn");
      }
      return next;
    });

  const answered = Object.values(answers).filter(v => v && v.toString().trim() !== "").length;
  const total = ALL_QIDS.length;

  /* ── Live score estimate (F7 fix: use scoreEst directly) ── */
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

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setRunning(false);
    localStorage.removeItem("petPrepAutoSave");

    /* ── F3: Persist attempt to localStorage (5.1) ── */
    try {
      const { rows, correct } = computeResults(answers);
      const scale = cambScale(correct);

      // Per-part scores
      const partScores = {};
      [1, 2, 3, 4, 5, 6].forEach(p => {
        const partRows = rows.filter(r => r.part === p);
        partScores[`part${p}`] = {
          correct: partRows.filter(r => r.s === "ok").length,
          total: partRows.length,
        };
      });

      const attempt = {
        id: Date.now(),
        date: new Date().toISOString(),
        testId: 1,
        type: "reading",
        scores: partScores,
        totalCorrect: correct,
        totalQuestions: 32,
        cambridgeScore: scale.score,
        grade: scale.grade,
        level: scale.level,
        timeUsed: timerSec,
      };

      const existing = JSON.parse(localStorage.getItem("petPrepAttempts") || "[]");
      existing.push(attempt);
      localStorage.setItem("petPrepAttempts", JSON.stringify(existing));
    } catch (e) {
      console.error("Failed to persist attempt:", e);
    }
  }, [answers, timerSec]);

  /* ── Retry handler — resets everything for a fresh attempt ── */
  const handleRetry = useCallback(() => {
    setSubmitted(false);
    setAnswers({});
    setFlagged(new Set());
    setTimerSec(0);
    setRunning(true);
    setCurrentPart(1);
    setActivePara(null);
    setTimerPrefs(getTimerPrefs());
  }, [getTimerPrefs]);

  /* ── Keyboard shortcuts (F5: 3.3) — must be AFTER handleSubmit ── */
  const { showShortcuts, setShowShortcuts } = useKeyboardShortcuts({
    currentPart,
    setCurrentPart,
    focusMode,
    setFocusMode,
    onSubmit: handleSubmit,
    submitted,
    paperMode,
  });

  /* ── Read showPartInstructions pref from localStorage ── */
  const getShowInstructions = () => {
    try {
      const saved = localStorage.getItem("petPrepPrefs");
      if (saved) {
        const p = JSON.parse(saved);
        return p.showPartInstructions !== false; // default true
      }
    } catch {}
    return true;
  };

  const renderLeft = () => {
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

  /* Format timer duration for display */
  const fmtDuration = (secs) => {
    const m = Math.floor(secs / 60);
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} minute${m !== 1 ? 's' : ''}`;
  };

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
          submitted ? (
            /* ── Results Screen (F3: wired up) ── */
            <ResultsScreen
              answers={answers}
              onRetry={handleRetry}
            />
          ) : (
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
                timerMode={timerPrefs.timerMode}
                timerDuration={timerPrefs.timerDuration}
                onShowShortcuts={() => setShowShortcuts(true)}
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
                <div className="flex-1 min-w-0">
                  {getShowInstructions() && <PartInstructions part={currentPart} />}
                  <ErrorBoundary section="Reading Material">
                    {renderLeft()}
                  </ErrorBoundary>
                </div>

                {/* Right panel — Questions */}
                <div className="w-full lg:w-[420px] shrink-0">
                  <ErrorBoundary section="Questions">
                    {renderRight()}
                  </ErrorBoundary>
                </div>
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
          )
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
        ) : paperMode === "settings" ? (
          <SettingsPage
            fontScale={fontScale}
            setPaperMode={setPaperMode}
          />
        ) : null}

        {/* ── Time's Up Modal (F2: 3.1) ── */}
        {showTimeUpModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl" style={{animation:'fadeScaleIn 300ms ease'}}>
              <div className="text-5xl mb-4">⏰</div>
              <h2 className="text-xl font-extrabold text-text mb-2">Time's Up!</h2>
              <p className="text-sm text-text-muted mb-6">
                Your {fmtDuration(timerPrefs.timerDuration)} exam time has expired. You can submit your answers now or continue reviewing.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setShowTimeUpModal(false); handleSubmit(); }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-dark transition-colors shadow-md"
                >
                  Submit Now
                </button>
                <button
                  onClick={() => { setShowTimeUpModal(false); setRunning(true); }}
                  className="px-6 py-2.5 rounded-xl border-2 border-border bg-card text-text font-bold text-sm cursor-pointer hover:border-primary transition-colors"
                >
                  Keep Reviewing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Restore Session Toast (F4: 3.2) ── */}
        {showRestoreToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] bg-card border border-border rounded-xl shadow-2xl px-5 py-3.5 flex items-center gap-4 max-w-lg" style={{animation:'slideUpFade 400ms ease'}}>
            <span className="text-2xl">💾</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-text">Previous session found</p>
              <p className="text-xs text-text-muted">You have unsaved answers from a recent session</p>
            </div>
            <button onClick={restoreSession} className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer hover:bg-primary-dark transition-colors">Restore</button>
            <button onClick={dismissRestore} className="px-3 py-1.5 rounded-lg border border-border text-text-muted text-xs font-bold cursor-pointer hover:bg-surface transition-colors">Dismiss</button>
          </div>
        )}
        {/* ── Keyboard Shortcut Cheat Sheet (F5: 3.3) ── */}
        {showShortcuts && (
          <ShortcutCheatSheet onClose={() => setShowShortcuts(false)} />
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
