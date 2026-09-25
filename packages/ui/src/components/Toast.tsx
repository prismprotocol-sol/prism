"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type ToastTone = "pending" | "success" | "error" | "neutral";

export type Toast = {
  id: string;
  tone: ToastTone;
  title: string;
  description?: ReactNode;
};

type PushInput = Omit<Toast, "id">;

type ToastContextValue = {
  push: (toast: PushInput) => string;
  update: (id: string, patch: Partial<PushInput>) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_DOT: Record<ToastTone, string> = {
  pending: "border border-muted",
  success: "bg-fg",
  error: "border border-muted-2",
  neutral: "border border-line-strong",
};

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const clearTimer = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [clearTimer]
  );

  const scheduleAutoDismiss = useCallback(
    (id: string, tone: ToastTone) => {
      clearTimer(id);
      if (tone === "success" || tone === "neutral") {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
        );
      }
    },
    [clearTimer, dismiss]
  );

  const push = useCallback(
    (toast: PushInput) => {
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
      setToasts((prev) => [...prev, { ...toast, id }]);
      scheduleAutoDismiss(id, toast.tone);
      return id;
    },
    [scheduleAutoDismiss]
  );

  const update = useCallback(
    (id: string, patch: Partial<PushInput>) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      if (patch.tone) scheduleAutoDismiss(id, patch.tone);
    },
    [scheduleAutoDismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ push, update, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-4 right-4 z-[var(--z-overlay)] flex w-[320px] flex-col gap-2 max-mobile:right-4 max-mobile:left-4 max-mobile:w-auto"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-fade-up pointer-events-auto rounded-xl border border-line-soft bg-surface-3 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${TONE_DOT[t.tone]}`} aria-hidden="true" />
                <div>
                  <div className="font-sans text-sm text-fg">{t.title}</div>
                  {t.description && <div className="mt-1 font-mono text-xs text-muted">{t.description}</div>}
                </div>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="font-mono text-xs text-muted-2 transition-colors duration-[var(--dur-micro)] ease-out hover:text-fg"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

/* `--animate-fade-up` isn't declared by this package's own tokens.css — each
   consuming app already defines it locally (landing, app) for list/card
   entrances, so the toast stack rides the same utility rather than
   duplicating the keyframe here. If a future consumer lacks it, the toast
   still renders, just without the rise-in. */
