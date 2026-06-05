import React, { useState, useEffect } from "react";

export function NotesModal({ onClose }) {
  const [notes, setNotes] = useState(() => localStorage.getItem("petPrepNotes") || "");
  useEffect(() => { localStorage.setItem("petPrepNotes", notes); }, [notes]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-amber-50">
          <span className="font-semibold text-amber-800 text-sm">📝 My Notes</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-4 text-sm text-gray-700 resize-none outline-none"
          style={{ minHeight: 200, fontFamily: "Georgia, serif", background: "#FFFEF7" }}
          placeholder="Jot down ideas, key points to cover, vocabulary…"
        />
        <div className="px-4 py-2 border-t border-gray-100 text-right">
          <button onClick={onClose} className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">Done</button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-80 p-6">
        <p className="text-gray-700 mb-4 text-sm">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600">Clear</button>
        </div>
      </div>
    </div>
  );
}
