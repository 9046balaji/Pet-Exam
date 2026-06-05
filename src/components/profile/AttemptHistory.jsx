import { useState, useEffect } from "react";

export default function AttemptHistory({
  fontScale = 1,
  setPaperMode,
  setWritingPart,
  setCurrentView
}) {
  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem("petPrepAttempts");
    return saved ? JSON.parse(saved) : [];
  });

  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Sync state if localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      const savedAttempts = localStorage.getItem("petPrepAttempts");
      if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const totalAttempts = attempts.length;

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const handleClearHistory = () => {
    localStorage.removeItem("petPrepAttempts");
    setAttempts([]);
    localStorage.removeItem("petPrepStudyPlan");

    // Reset stats in profile
    const savedProfile = localStorage.getItem("petPrepProfile");
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      p.xp = 0;
      p.level = 1;
      p.studyStreakDays = 0;
      p.totalStudyMinutes = 0;
      p.lastStudyDate = null;
      localStorage.setItem("petPrepProfile", JSON.stringify(p));
    }
    setShowConfirmClear(false);
  };

  const handleLoadAttempt = (att) => {
    // Save draft in progress
    if (att.part === 1) {
      localStorage.setItem("petPrepPart1Draft", att.draft);
      localStorage.setItem("petPrepPart1Status", "draft");
    } else {
      localStorage.setItem("petPrepPart2Draft", att.draft);
      localStorage.setItem("petPrepPart2Status", "draft");
      localStorage.setItem("petPrepPart2Choice", att.taskType);
    }
    // Switch to practice mode, writing paper, and corresponding part
    setWritingPart(att.part);
    setPaperMode("writing");
    if (setCurrentView) setCurrentView("practice");
  };

  const getScoreColor = (total) => {
    if (total >= 16) return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" };
    if (total >= 12) return { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-200" };
    if (total >= 8) return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
    return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
  };

  return (
    <div
      className="min-h-screen bg-surface overflow-y-auto"
      style={{ padding: "24px 20px 100px", fontSize: `${fontScale}em` }}
    >
      <div className="max-w-[1000px] mx-auto pb-12">
        {/* History Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-text">Exam Attempts Log</h2>
            <p className="text-xs text-text-muted font-medium">Showing {totalAttempts} submissions, ordered chronologically (newest first)</p>
          </div>
          {totalAttempts > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Clear All History
            </button>
          )}
        </div>

        {totalAttempts === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-16 text-center shadow-sm">
            <span className="text-5xl mb-4 select-none block">📋</span>
            <h3 className="font-extrabold text-text text-lg mb-2">No attempt logs</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto mb-6">
              Submit your writing practice drafts in the practice tab to register logs in your B1 progress dashboard.
            </p>
            <button
              onClick={() => { setPaperMode("writing"); setWritingPart(1); if (setCurrentView) setCurrentView("practice"); }}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow hover:shadow-md"
            >
              Go to Practice
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts
              .slice()
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((att) => {
                const scoreColor = getScoreColor(att.totalScore);
                const isExpanded = expandedAttempt === att.id;

                return (
                  <div
                    key={att.id}
                    className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-300"
                  >
                    {/* Summary Card Row */}
                    <div
                      onClick={() => setExpandedAttempt(isExpanded ? null : att.id)}
                      className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-surface transition-all select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">
                          {att.taskType === "email" ? "✉️" : att.taskType === "story" ? "📖" : "📝"}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-text text-sm capitalize">
                              Part {att.part} — {att.taskType}
                            </h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${scoreColor.bg} ${scoreColor.text} border ${scoreColor.border}`}>
                              {att.totalScore}/20 • {att.bandLabel?.replace(" (B1)", "")?.replace(" (B2 Level)", "")}
                            </span>
                          </div>
                          <p className="text-xs text-text-light font-medium mt-0.5">{formatDate(att.timestamp)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-light font-mono hidden md:inline truncate max-w-xs">
                          "{att.draft.substring(0, 45)}..."
                        </span>
                        <button className="text-text-muted text-xs font-bold bg-surface hover:bg-border p-2 rounded-xl">
                          {isExpanded ? "Collapse" : "Review"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="border-t border-border bg-surface/50 p-6 space-y-6 animate-[fadeIn_0.2s_ease]">
                        {/* Grid: Stats Overview & Custom Circular Gauges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-card p-4 rounded-xl border border-border flex flex-col items-center justify-center">
                            <span className="text-[10px] text-text-light font-bold uppercase tracking-wider mb-2">Content</span>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="text-purple-500" strokeWidth="3" strokeDasharray={`${(att.scores?.content / 5) * 100}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                              <span className="font-bold text-sm text-purple-600">{att.scores?.content}/5</span>
                            </div>
                          </div>

                          <div className="bg-card p-4 rounded-xl border border-border flex flex-col items-center justify-center">
                            <span className="text-[10px] text-text-light font-bold uppercase tracking-wider mb-2">Comm. Achievement</span>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="text-teal-500" strokeWidth="3" strokeDasharray={`${(att.scores?.communicative / 5) * 100}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                              <span className="font-bold text-sm text-teal-600">{att.scores?.communicative}/5</span>
                            </div>
                          </div>

                          <div className="bg-card p-4 rounded-xl border border-border flex flex-col items-center justify-center">
                            <span className="text-[10px] text-text-light font-bold uppercase tracking-wider mb-2">Organisation</span>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="text-amber-500" strokeWidth="3" strokeDasharray={`${(att.scores?.organisation / 5) * 100}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                              <span className="font-bold text-sm text-amber-600">{att.scores?.organisation}/5</span>
                            </div>
                          </div>

                          <div className="bg-card p-4 rounded-xl border border-border flex flex-col items-center justify-center">
                            <span className="text-[10px] text-text-light font-bold uppercase tracking-wider mb-2">Language</span>
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="text-red-500" strokeWidth="3" strokeDasharray={`${(att.scores?.language / 5) * 100}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                              <span className="font-bold text-sm text-red-500">{att.scores?.language}/5</span>
                            </div>
                          </div>
                        </div>

                        {/* Side-by-side Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                          {/* Draft Lined Paper */}
                          <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute left-6 top-0 w-0.5 h-full bg-pink-200/50" />
                            <h5 className="font-extrabold text-xs text-text-light uppercase tracking-wider mb-4 select-none">Submitted Writing Draft</h5>
                            <div className="font-serif text-text text-sm leading-loose whitespace-pre-wrap pl-6 min-h-[160px]">
                              {att.draft}
                            </div>
                          </div>

                          {/* Checklist/Feedback bullet points */}
                          <div className="lg:col-span-2 space-y-4">
                            {/* Strengths */}
                            <div className="bg-card p-4 rounded-xl border border-border">
                              <h5 className="font-bold text-xs text-green-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <span>✓</span> Key Strengths
                              </h5>
                              <ul className="space-y-1.5">
                                {att.feedback?.strengths?.map((str, idx) => (
                                  <li key={idx} className="text-xs text-text-muted flex items-start gap-2 leading-relaxed">
                                    <span className="text-green-500 font-bold shrink-0">•</span>
                                    <span>{str}</span>
                                  </li>
                                )) || <li className="text-xs text-text-light italic">No recorded strengths.</li>}
                              </ul>
                            </div>

                            {/* Improvements */}
                            <div className="bg-card p-4 rounded-xl border border-border">
                              <h5 className="font-bold text-xs text-amber-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <span>⚠️</span> Areas to Improve
                              </h5>
                              <ul className="space-y-1.5">
                                {att.feedback?.improvements?.map((imp, idx) => (
                                  <li key={idx} className="text-xs text-text-muted flex items-start gap-2 leading-relaxed">
                                    <span className="text-amber-500 font-bold shrink-0">•</span>
                                    <span>{imp}</span>
                                  </li>
                                )) || <li className="text-xs text-text-light italic">No recorded improvements.</li>}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Annotations */}
                        {att.feedback?.annotations && att.feedback.annotations.length > 0 && (
                          <div className="bg-card p-4 rounded-xl border border-border">
                            <h5 className="font-bold text-xs text-text uppercase tracking-wider mb-3">Annotation Breakdowns</h5>
                            <div className="space-y-2.5">
                              {att.feedback.annotations.map((ann, idx) => (
                                <div key={idx} className="p-2.5 bg-surface border border-border rounded-xl text-xs flex flex-col md:flex-row md:items-center gap-2 justify-between">
                                  <div>
                                    <span className="font-mono bg-red-50 text-red-600 border border-red-100 rounded px-1.5 py-0.5 mr-2 font-bold">{ann.phrase}</span>
                                    <span className="text-text-light capitalize">({ann.type})</span>
                                  </div>
                                  <div className="text-indigo-600 font-bold">
                                    💡 Suggestion: {ann.suggestion}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action: Reload to editor */}
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => handleLoadAttempt(att)}
                            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                          >
                            🖊 Load Draft in Editor to Revise
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-[fadeIn_0.15s_ease]">
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-border">
            <span className="text-4xl block mb-3">🚨</span>
            <h3 className="font-extrabold text-text text-lg mb-2">Delete all attempt logs?</h3>
            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              This action will permanently erase your writing attempts history log, reset your XP level to Level 1, and clear your study plan. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 bg-surface hover:bg-border text-text rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
