import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** @type {import("react").Context<ReturnType<typeof import("./Toast.d.ts").useToast> | null>} */
const ToastCtx = createContext(/** @type {any} */ (null));
/** Queue entry owned by the Provider. The public contract is ToastOptions; id and leaving are internal.
 * @typedef {import("./Toast.d.ts").ToastOptions & { id: number, leaving?: boolean }} QueuedToast */
/** @type {Record<string, string>} */
const ICON = { info: "info", ok: "check-circle", warn: "warning", crit: "warning-octagon" };
/* Must match the .bds-toast--leaving transition (--dur-base). Under reduced-motion the toast is dropped immediately. */
const EXIT_MS = 180;
const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion:reduce)").matches;

/** Toast provider; mount once at the app root. useToast().toast({message, tone?, action?, duration?})
 * @param {Parameters<typeof import("./Toast.d.ts").ToastProvider>[0]} props */
export function ToastProvider({ children, max = 3 }) {
  const [items, setItems] = useState(/** @type {QueuedToast[]} */ ([]));
  const seq = useRef(0);
  /* Timers are tracked per id so they can be cleared together: otherwise they outlive the provider,
     and a manually dismissed toast keeps its auto-dismiss timer alive. */
  /** @type {import("react").MutableRefObject<Map<number, ReturnType<typeof setTimeout>>>} */
  const timers = useRef(new Map());
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  const drop = useCallback((/** @type {number} */ id) => {
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
    setItems((p) => p.filter((x) => x.id !== id));
  }, []);
  /* Dismiss = mark leaving → exit transition → drop. Dismissing the same toast again just retries the drop (a no-op if gone). */
  const dismiss = useCallback((/** @type {number} */ id) => {
    if (reducedMotion()) return drop(id);
    setItems((p) => p.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    timers.current.set(id, setTimeout(() => drop(id), EXIT_MS));
  }, [drop]);
  const toast = useCallback((/** @type {import("./Toast.d.ts").ToastOptions} */ t) => {
    const id = ++seq.current;
    setItems((p) => {
      const next = [...p, /** @type {QueuedToast} */ ({ id, tone: "info", duration: 4000, ...t })];
      /* Leaving toasts are already vacating and don't count toward max; overflow drops the oldest immediately. */
      let over = next.filter((x) => !x.leaving).length - max;
      return next.filter((x) => x.leaving || over-- <= 0);
    });
    /* With an action or crit tone the toast stays until dismissed; an explicit duration always wins. */
    const d = t.duration ?? (t.action || t.tone === "crit" ? 0 : 4000); if (d > 0) timers.current.set(id, setTimeout(() => dismiss(id), d));
    return id;
  }, [dismiss, max]);
  /* toast and dismiss are already stable; an inline object here re-rendered every useToast consumer
     three times per toast (enter, leaving, drop). */
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="bds-toasts" role="region" aria-label="알림 메시지" aria-live="polite" aria-atomic="false">
        {items.map((t) => <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() { const c = useContext(ToastCtx); if (!c) throw new Error("useToast는 ToastProvider 안에서만 쓸 수 있습니다."); return c; }

/** A single toast, normally rendered by the Provider, which sets leaving during the exit.
 * @param {Parameters<typeof import("./Toast.d.ts").Toast>[0]} props */
export function Toast({ message, tone = "info", action, onAction, onDismiss, leaving, className }) {
  return (
    <div role={tone === "crit" ? "alert" : "status"} className={cx("bds-toast", `bds-tone--${tone}`, leaving && "bds-toast--leaving", className)}>
      <Icon name={ICON[tone]} />
      <span className="bds-toast__m">{message}</span>
      {action && <button type="button" className="bds-toast__a" onClick={() => { onAction?.(); onDismiss?.(); }}>{action}</button>}
      {onDismiss && <button type="button" className="bds-toast__a bds-toast__a--quiet" aria-label="닫기" onClick={onDismiss}><Icon name="x" size={14} /></button>}
    </div>
  );
}
