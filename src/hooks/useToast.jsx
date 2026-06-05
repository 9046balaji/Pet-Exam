import { useState, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   useToast — Lightweight toast notification system
   Usage:
     const { toast, ToastContainer } = useToast();
     toast("Message here", "success"); // "success" | "info" | "warn"
   ═══════════════════════════════════════════════════════════════ */

export default function useToast() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const toast = useCallback((message, type = "info") => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const ToastContainer = () =>
    toasts.length > 0 ? (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1001] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-xl shadow-lg text-sm font-semibold backdrop-blur-md border pointer-events-auto ${
              t.type === "success"
                ? "bg-success/90 text-white border-success/30"
                : t.type === "warn"
                ? "bg-warning/90 text-text border-warning/30"
                : "bg-card/95 text-text border-border"
            }`}
            style={{ animation: "slideUpFade 300ms ease" }}
          >
            {t.type === "success" ? "✅" : t.type === "warn" ? "⚠️" : "ℹ️"}{" "}
            {t.message}
          </div>
        ))}
      </div>
    ) : null;

  return { toast, ToastContainer };
}
