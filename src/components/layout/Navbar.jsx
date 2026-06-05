import { useTheme } from "../../context/useTheme";

export default function Navbar({
  currentPart,
  setCurrentPart,
  paperMode = "reading",
  setPaperMode,
  writingPart = 1,
  setWritingPart,
  getProgress,
  isSidebarOpen,
  setSidebarOpen,
  focusMode,
}) {
  const P_LABELS = [
    "Short Texts",
    "Matching",
    "Long Text",
    "Gapped Text",
    "Word Choice",
    "Open Fill"
  ];

  const P_ICONS = ["📝", "🔗", "📖", "✂️", "🔤", "✏️"];

  const getDotClass = (p) => {
    if (!getProgress) return "bg-slate-300";
    const g = getProgress(p);
    if (g === "complete") return "bg-success";
    if (g === "in_progress") return "bg-warning";
    return "bg-white/20";
  };

  if (focusMode) return null;

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[290] lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-[300] w-64 bg-primary-dark text-white flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-xl border-r border-white/5`}
      >
        {/* Sidebar Header: Logo */}
        <div className="h-[54px] px-5 flex items-center border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="bg-white/18 rounded-[9px] p-[5px_8px] text-[18px] leading-none">📚</span>
            <span className="font-extrabold text-[1.1em] tracking-[-0.2px] text-white">PETPrep</span>
          </div>
        </div>

        {/* Sidebar Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollpanel">
          {/* Main Navigation Group */}
          <div>
            <div className="text-white/40 text-[0.68em] font-extrabold tracking-wider px-3 mb-2 uppercase">
              Exam Papers
            </div>
            <nav className="space-y-1">
              {/* Reading Paper Link */}
              <div>
                <button
                  onClick={() => {
                    setPaperMode("reading");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.88em] font-semibold transition-all cursor-pointer text-left ${
                    paperMode === "reading"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-[1.1em]">📚</span>
                  <span>Reading Paper</span>
                </button>
                
                {/* Reading Parts Submenu */}
                {paperMode === "reading" && (
                  <div className="mt-1.5 ml-4 pl-2 border-l border-white/10 space-y-1">
                    {[1, 2, 3, 4, 5, 6].map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setCurrentPart(p);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[0.78em] transition-all cursor-pointer text-left ${
                          currentPart === p
                            ? "bg-white/10 text-white font-bold"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <span className="text-[0.9em]">{P_ICONS[p - 1]}</span>
                          <span className="truncate">Part {p} — {P_LABELS[p - 1]}</span>
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1 ${getDotClass(p)}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Writing Paper Link */}
              <div>
                <button
                  onClick={() => {
                    setPaperMode("writing");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.88em] font-semibold transition-all cursor-pointer text-left ${
                    paperMode === "writing"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-[1.1em]">✍️</span>
                  <span>Writing Paper</span>
                </button>

                {/* Writing Parts Submenu */}
                {paperMode === "writing" && (
                  <div className="mt-1.5 ml-4 pl-2 border-l border-white/10 space-y-1">
                    {[1, 2].map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setWritingPart(p);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[0.78em] transition-all cursor-pointer text-left ${
                          writingPart === p
                            ? "bg-white/10 text-white font-bold"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{p === 1 ? "✉️" : "📄"}</span>
                        <span className="truncate">Part {p} — {p === 1 ? "Email" : "Article / Story"}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Student Dashboard Group */}
          <div>
            <div className="text-white/40 text-[0.68em] font-extrabold tracking-wider px-3 mb-2 uppercase">
              Dashboard
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setPaperMode("profile");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.88em] font-semibold transition-all cursor-pointer text-left ${
                  paperMode === "profile"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-[1.1em]">📊</span>
                <span>Profile & Analytics</span>
              </button>
              <button
                onClick={() => {
                  setPaperMode("history");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.88em] font-semibold transition-all cursor-pointer text-left ${
                  paperMode === "history"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-[1.1em]">📋</span>
                <span>Attempt History</span>
              </button>
            </nav>
          </div>

          {/* Preferences Group has been moved to TopHeader (top-right controls) */}
        </div>

        {/* Sidebar Footer: Student Profile */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-white/3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full bg-white/15 border border-white/10 flex items-center justify-center text-[0.82em] font-bold text-white shadow-sm shrink-0"
              >
                ST
              </div>
              <div className="min-w-0">
                <div className="text-[0.78em] font-bold text-white truncate">Student Account</div>
                <div className="text-[0.68em] text-white/50 truncate">PET Prep Target: B1</div>
              </div>
            </div>

            {/* Settings button */}
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[1.1em] text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer duration-300 hover:rotate-45 shrink-0"
              title="Settings"
            >
              ⚙
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function TopHeader({
  setFontScale,
  focusMode,
  setFocusMode,
  currentPart,
  paperMode = "reading",
  setPaperMode,
  writingPart = 1,
  setSidebarOpen,
  isSidebarOpen,
}) {
  const { theme, toggleTheme } = useTheme();
  const P_LABELS = [
    "Short Texts",
    "Matching",
    "Long Text",
    "Gapped Text",
    "Word Choice",
    "Open Fill"
  ];

  const P_ICONS = ["📝", "🔗", "📖", "✂️", "🔤", "✏️"];

  let breadcrumbHeader = "Writing Paper";
  let breadcrumbActiveLabel = `Part ${writingPart} — ${writingPart === 1 ? "Email" : "Article or Story"}`;
  let breadcrumbActiveIcon = writingPart === 1 ? "✉️" : "📄";

  if (paperMode === "reading") {
    breadcrumbHeader = "Reading Paper";
    breadcrumbActiveLabel = `Part ${currentPart} — ${P_LABELS[currentPart - 1]}`;
    breadcrumbActiveIcon = P_ICONS[currentPart - 1];
  } else if (paperMode === "profile") {
    breadcrumbHeader = "Student Dashboard";
    breadcrumbActiveLabel = "Profile & Analytics";
    breadcrumbActiveIcon = "📊";
  } else if (paperMode === "history") {
    breadcrumbHeader = "Student Dashboard";
    breadcrumbActiveLabel = "Attempt History";
    breadcrumbActiveIcon = "📋";
  }

  return (
    <header className="bg-card border-b border-border px-5 h-[54px] flex items-center justify-between gap-4 sticky top-0 z-[200] shadow-[0_1px_4px_rgba(0,0,0,0.1)] no-print select-none dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
      {/* Left: Toggle + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Toggle Menu Button */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="text-text hover:bg-slate-100 p-1.5 rounded-lg border border-border-light cursor-pointer shrink-0 transition-colors"
          title={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          <span className="text-[1.2em] leading-none block">☰</span>
        </button>

        {/* Breadcrumb */}
        <div className="text-[0.83em] text-text-muted flex items-center gap-1.5 truncate">
          <span className="font-medium truncate">{breadcrumbHeader}</span>
          <span className="opacity-40 text-[0.9em] shrink-0">›</span>
          <span className="font-bold text-primary flex items-center gap-1 truncate shrink-0">
            <span className="text-[1.15em] leading-none">{breadcrumbActiveIcon}</span>
            <span className="truncate">{breadcrumbActiveLabel}</span>
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Font Size */}
        <div className="bg-slate-100/80 dark:bg-slate-700/60 p-0.5 rounded-lg flex items-center border border-border-light gap-0.5 shadow-xs">
          <button
            className="px-2.5 py-1 rounded text-[0.78em] font-extrabold text-text transition-all cursor-pointer hover:bg-card hover:shadow-xs"
            onClick={() => setFontScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))}
            title="Decrease font size"
          >
            A−
          </button>
          <div className="w-[1px] h-3.5 bg-border-light" />
          <button
            className="px-2.5 py-1 rounded text-[0.78em] font-extrabold text-text transition-all cursor-pointer hover:bg-card hover:shadow-xs"
            onClick={() => setFontScale((s) => Math.min(1.3, +(s + 0.1).toFixed(2)))}
            title="Increase font size"
          >
            A+
          </button>
        </div>

        {/* Focus Mode */}
        <button
          className={`px-3 py-1 rounded-lg text-[0.78em] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            focusMode
              ? "bg-warning text-primary-dark shadow-sm border border-warning/10"
              : "text-text-muted border border-border hover:text-text hover:bg-surface dark:hover:bg-slate-700"
          }`}
          onClick={() => setFocusMode((m) => !m)}
        >
          {focusMode ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-[ping_1.5s_infinite]" />
              Focus ON
            </>
          ) : (
            <>⛶ Focus</>
          )}
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-primary-light border border-primary/20 flex items-center justify-center text-[0.78em] font-bold text-primary hover:bg-primary-hover transition-all cursor-pointer"
          title="Student Profile"
          onClick={() => setPaperMode("profile")}
        >
          ST
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[1.1em] text-text-light hover:text-text hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer duration-300"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Settings */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[1.1em] text-text-light hover:text-text hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer duration-300 hover:rotate-45"
          title="Settings"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}
