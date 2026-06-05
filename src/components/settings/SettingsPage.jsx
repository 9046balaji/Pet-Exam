import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/useTheme";

/* ═══════════════════════════════════════════════════════════════
   Settings Page — PETPrep
   A full-featured settings hub for theme, font, timer, data, and profile.
   ═══════════════════════════════════════════════════════════════ */

const TIMER_MODES = [
  { value: "countdown", label: "Countdown", desc: "Counts down from a set time (exam-realistic)" },
  { value: "countup", label: "Count Up", desc: "Counts up from zero (free practice)" },
];

const TIMER_DURATIONS = [
  { value: 2700, label: "45 min", desc: "Standard PET Reading" },
  { value: 1800, label: "30 min", desc: "Quick practice" },
  { value: 3600, label: "60 min", desc: "Extended time" },
  { value: 0, label: "Custom", desc: "Set your own" },
];

const TARGET_BANDS = ["Pass", "Merit (B1)", "Distinction (B2)"];

export default function SettingsPage({ fontScale = 1, setPaperMode }) {
  const { theme, toggleTheme } = useTheme();

  /* ── Persisted preferences ── */
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem("petPrepPrefs");
    return saved
      ? JSON.parse(saved)
      : {
          timerMode: "countup",
          timerDuration: 2700,
          customDuration: 45,
          defaultFontScale: 1,
          showPartInstructions: true,
        };
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("petPrepProfile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Jane Doe",
          avatarEmoji: "🎯",
          targetExamDate: "",
          targetBand: "Merit (B1)",
        };
  });

  /* ── Profile editing state ── */
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const nameRef = useRef(null);

  /* ── Danger zone state ── */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState("");

  /* ── Save indicator ── */
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("petPrepPrefs", JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    localStorage.setItem("petPrepProfile", JSON.stringify(profile));
  }, [profile]);

  const updatePref = (key, value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    flashSaved();
  };

  const updateProfile = (key, value) => {
    setProfile((p) => ({ ...p, [key]: value }));
    flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  /* ── Data export ── */
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: JSON.parse(localStorage.getItem("petPrepProfile") || "{}"),
      preferences: JSON.parse(localStorage.getItem("petPrepPrefs") || "{}"),
      attempts: JSON.parse(localStorage.getItem("petPrepAttempts") || "[]"),
      studyPlan: JSON.parse(localStorage.getItem("petPrepStudyPlan") || "null"),
      theme: localStorage.getItem("petPrepTheme") || "light",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `petprep-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Data deletion ── */
  const handleDelete = () => {
    localStorage.removeItem("petPrepAttempts");
    localStorage.removeItem("petPrepStudyPlan");
    setShowDeleteConfirm(false);
    setDeletePhrase("");
    flashSaved();
  };

  const handleFullReset = () => {
    if (deletePhrase !== "RESET") return;
    localStorage.removeItem("petPrepAttempts");
    localStorage.removeItem("petPrepStudyPlan");
    localStorage.removeItem("petPrepProfile");
    localStorage.removeItem("petPrepPrefs");
    localStorage.removeItem("petPrepTheme");
    window.location.reload();
  };

  /* ── Emoji picker (simple grid) ── */
  const EMOJI_OPTIONS = ["🎯", "📚", "✨", "🧠", "🌟", "🦉", "🎓", "💡", "🚀", "🐱", "🌈", "🎨"];

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <div
      className="min-h-screen bg-surface overflow-y-auto"
      style={{ padding: "24px 20px 100px", fontSize: `${fontScale}em` }}
    >
      <div className="max-w-[820px] mx-auto space-y-7">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[1.6em] font-extrabold text-text tracking-tight flex items-center gap-3">
              <span className="bg-primary/10 dark:bg-primary/20 text-primary p-2.5 rounded-xl text-[0.85em]">⚙</span>
              Settings
            </h1>
            <p className="text-[0.85em] text-text-muted mt-1 font-medium">
              Manage your preferences, appearance, and data
            </p>
          </div>
          {/* Save indicator */}
          <div
            className={`transition-all duration-300 text-[0.82em] font-bold px-3.5 py-1.5 rounded-full ${
              saved
                ? "bg-success/15 text-success border border-success/30 opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            ✓ Saved
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
           Section 1 — Profile
           ═══════════════════════════════════════════════════════ */}
        <section className="settings-section" id="settings-profile">
          <div className="settings-section-header">
            <span className="settings-section-icon">👤</span>
            <div>
              <h2 className="settings-section-title">Profile</h2>
              <p className="settings-section-desc">Your identity and exam targets</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Avatar</span>
              <span className="settings-label-hint">Choose your profile emoji</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => updateProfile("avatarEmoji", e)}
                  className={`w-10 h-10 rounded-xl text-[1.3em] flex items-center justify-center transition-all cursor-pointer border-2 ${
                    profile.avatarEmoji === e
                      ? "border-primary bg-primary/10 scale-110 shadow-sm"
                      : "border-transparent hover:border-border hover:bg-surface"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Display Name</span>
              <span className="settings-label-hint">Shown on your profile card</span>
            </div>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  ref={nameRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateProfile("name", nameInput);
                      setEditingName(false);
                    }
                    if (e.key === "Escape") {
                      setNameInput(profile.name);
                      setEditingName(false);
                    }
                  }}
                  className="settings-input w-48"
                  autoFocus
                  maxLength={30}
                />
                <button
                  onClick={() => { updateProfile("name", nameInput); setEditingName(false); }}
                  className="settings-btn-sm settings-btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => { setNameInput(profile.name); setEditingName(false); }}
                  className="settings-btn-sm settings-btn-ghost"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setEditingName(true); setTimeout(() => nameRef.current?.focus(), 50); }}
                className="text-[0.88em] font-semibold text-text hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group"
              >
                {profile.name}
                <span className="text-text-light group-hover:text-primary text-[0.85em] transition-colors">✎</span>
              </button>
            )}
          </div>

          {/* Target Exam Date */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Target Exam Date</span>
              <span className="settings-label-hint">When is your PET exam?</span>
            </div>
            <input
              type="date"
              value={profile.targetExamDate || ""}
              onChange={(e) => updateProfile("targetExamDate", e.target.value)}
              className="settings-input"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Target Band */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Target Band</span>
              <span className="settings-label-hint">Your goal level for the exam</span>
            </div>
            <div className="flex gap-2">
              {TARGET_BANDS.map((band) => (
                <button
                  key={band}
                  onClick={() => updateProfile("targetBand", band)}
                  className={`px-3.5 py-1.5 rounded-lg text-[0.82em] font-bold transition-all cursor-pointer border-2 ${
                    profile.targetBand === band
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-card text-text-muted hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           Section 2 — Appearance
           ═══════════════════════════════════════════════════════ */}
        <section className="settings-section" id="settings-appearance">
          <div className="settings-section-header">
            <span className="settings-section-icon">🎨</span>
            <div>
              <h2 className="settings-section-title">Appearance</h2>
              <p className="settings-section-desc">Theme and font preferences</p>
            </div>
          </div>

          {/* Theme */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Theme</span>
              <span className="settings-label-hint">Choose light or dark mode</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={`settings-theme-btn ${theme === "light" ? "active" : ""}`}
              >
                <span className="text-[1.1em]">☀️</span>
                <span>Light</span>
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`settings-theme-btn ${theme === "dark" ? "active" : ""}`}
              >
                <span className="text-[1.1em]">🌙</span>
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Default Font Size */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Default Font Size</span>
              <span className="settings-label-hint">Reading and question text size</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.85"
                max="1.3"
                step="0.05"
                value={prefs.defaultFontScale}
                onChange={(e) => updatePref("defaultFontScale", parseFloat(e.target.value))}
                className="settings-range w-36"
              />
              <span className="text-[0.82em] font-bold text-text-muted min-w-[48px] text-center tabular-nums">
                {Math.round(prefs.defaultFontScale * 100)}%
              </span>
            </div>
          </div>

          {/* Show Part Instructions */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Part Instructions</span>
              <span className="settings-label-hint">Show instructions before each exam part</span>
            </div>
            <button
              onClick={() => updatePref("showPartInstructions", !prefs.showPartInstructions)}
              className={`settings-toggle ${prefs.showPartInstructions ? "on" : ""}`}
              role="switch"
              aria-checked={prefs.showPartInstructions}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           Section 3 — Timer
           ═══════════════════════════════════════════════════════ */}
        <section className="settings-section" id="settings-timer">
          <div className="settings-section-header">
            <span className="settings-section-icon">⏱️</span>
            <div>
              <h2 className="settings-section-title">Timer</h2>
              <p className="settings-section-desc">Control how the exam timer behaves</p>
            </div>
          </div>

          {/* Timer Mode */}
          <div className="settings-row items-start">
            <div className="settings-label">
              <span className="settings-label-text">Timer Mode</span>
              <span className="settings-label-hint">How the clock runs during exams</span>
            </div>
            <div className="flex gap-3">
              {TIMER_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => updatePref("timerMode", mode.value)}
                  className={`settings-option-card ${prefs.timerMode === mode.value ? "active" : ""}`}
                >
                  <span className="text-[0.88em] font-bold">{mode.label}</span>
                  <span className="text-[0.72em] text-text-muted mt-0.5">{mode.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timer Duration (only for countdown) */}
          {prefs.timerMode === "countdown" && (
            <div className="settings-row items-start">
              <div className="settings-label">
                <span className="settings-label-text">Duration</span>
                <span className="settings-label-hint">Time limit for the reading paper</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {TIMER_DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => updatePref("timerDuration", d.value)}
                      className={`px-3 py-1.5 rounded-lg text-[0.82em] font-bold transition-all cursor-pointer border-2 ${
                        prefs.timerDuration === d.value
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-border bg-card text-text-muted hover:border-primary/40"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                {prefs.timerDuration === 0 && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={prefs.customDuration}
                      onChange={(e) => updatePref("customDuration", parseInt(e.target.value) || 45)}
                      className="settings-input w-20 text-center"
                    />
                    <span className="text-[0.82em] text-text-muted font-medium">minutes</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════
           Section 4 — Data Management
           ═══════════════════════════════════════════════════════ */}
        <section className="settings-section" id="settings-data">
          <div className="settings-section-header">
            <span className="settings-section-icon">💾</span>
            <div>
              <h2 className="settings-section-title">Data Management</h2>
              <p className="settings-section-desc">Export, import, or clear your data</p>
            </div>
          </div>

          {/* Export */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Export Data</span>
              <span className="settings-label-hint">Download all your data as a JSON file</span>
            </div>
            <button onClick={handleExport} className="settings-btn settings-btn-outline" id="settings-export-btn">
              <span>📥</span> Download Backup
            </button>
          </div>

          {/* Delete Attempts */}
          <div className="settings-row">
            <div className="settings-label">
              <span className="settings-label-text">Clear Attempt History</span>
              <span className="settings-label-hint">Remove all saved exam attempts and study plan</span>
            </div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="settings-btn settings-btn-danger-outline"
                id="settings-clear-attempts-btn"
              >
                <span>🗑️</span> Clear Attempts
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="settings-btn settings-btn-danger"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="settings-btn-sm settings-btn-ghost"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           Section 5 — Danger Zone
           ═══════════════════════════════════════════════════════ */}
        <section className="settings-section settings-danger-zone" id="settings-danger">
          <div className="settings-section-header">
            <span className="settings-section-icon" style={{ background: "rgba(225, 112, 85, 0.12)" }}>⚠️</span>
            <div>
              <h2 className="settings-section-title" style={{ color: "var(--color-danger)" }}>Danger Zone</h2>
              <p className="settings-section-desc">Irreversible actions — proceed with caution</p>
            </div>
          </div>

          <div className="settings-row items-start">
            <div className="settings-label">
              <span className="settings-label-text" style={{ color: "var(--color-danger)" }}>Factory Reset</span>
              <span className="settings-label-hint">
                Delete ALL data — profile, attempts, preferences, and theme.
                This action cannot be undone.
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={deletePhrase}
                  onChange={(e) => setDeletePhrase(e.target.value)}
                  placeholder='Type "RESET" to confirm'
                  className="settings-input w-48 text-[0.85em]"
                  id="settings-reset-input"
                />
                <button
                  onClick={handleFullReset}
                  disabled={deletePhrase !== "RESET"}
                  className="settings-btn settings-btn-danger disabled:opacity-40 disabled:cursor-not-allowed"
                  id="settings-reset-btn"
                >
                  Reset Everything
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-[0.75em] text-text-light font-medium">
            PETPrep v0.1.0 · All data stored locally in your browser
          </p>
          <button
            onClick={() => setPaperMode("reading")}
            className="mt-3 text-[0.82em] text-primary font-bold hover:underline cursor-pointer"
          >
            ← Back to Practice
          </button>
        </div>
      </div>
    </div>
  );
}
