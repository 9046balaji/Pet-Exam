import { useState, useEffect } from "react";

export function NotesModal({ onClose }) {
  const [notes, setNotes] = useState(() => localStorage.getItem("petPrepNotes") || "");
  useEffect(() => { localStorage.setItem("petPrepNotes", notes); }, [notes]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl shadow-2xl w-96 overflow-hidden border border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-amber-50 dark:bg-amber-900/20">
          <span className="font-semibold text-amber-800 dark:text-amber-300 text-sm">📝 My Notes</span>
          <button onClick={onClose} className="text-text-light hover:text-text text-lg">✕</button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-4 text-sm text-text resize-none outline-none bg-card"
          style={{ minHeight: 200, fontFamily: "Georgia, serif" }}
          placeholder="Jot down ideas, key points to cover, vocabulary…"
        />
        <div className="px-4 py-2 border-t border-border text-right">
          <button onClick={onClose} className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">Done</button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl shadow-2xl w-80 p-6 border border-border">
        <p className="text-text mb-4 text-sm">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-border text-text-muted text-sm hover:bg-surface">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600">Clear</button>
        </div>
      </div>
    </div>
  );
}
