import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** @type {import("react").Context<ReturnType<typeof import("./Toast.d.ts").useToast> | null>} */
const ToastCtx = createContext(/** @type {any} */ (null));
/** Provider 가 관리하는 큐 항목. 공개 계약은 ToastOptions 이고 id·leaving 은 여기서만 쓴다.
 * @typedef {import("./Toast.d.ts").ToastOptions & { id: number, leaving?: boolean }} QueuedToast */
/** @type {Record<string, string>} */
const ICON = { info: "info", ok: "check-circle", warn: "warning", crit: "warning-octagon" };
/* 퇴장 길이는 .bds-toast--leaving의 transition(--dur-base)과 같아야 한다. reduced-motion이면 애니메이션 없이 즉시 제거한다 */
const EXIT_MS = 180;
const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion:reduce)").matches;

/** 토스트 프로바이더. 앱 루트에 한 번. useToast().toast({message, tone?, action?, duration?})
 * @param {Parameters<typeof import("./Toast.d.ts").ToastProvider>[0]} props */
export function ToastProvider({ children, max = 3 }) {
  const [items, setItems] = useState(/** @type {QueuedToast[]} */ ([]));
  const seq = useRef(0);
  /* 타이머를 소유하지 않으면 프로바이더가 사라진 뒤에도 남고, 손으로 닫은 토스트의
     자동 닫기 타이머가 계속 살아 있다. id 별로 들고 있다가 함께 거둔다. */
  /** @type {import("react").MutableRefObject<Map<number, ReturnType<typeof setTimeout>>>} */
  const timers = useRef(new Map());
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  const drop = useCallback((/** @type {number} */ id) => {
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
    setItems((p) => p.filter((x) => x.id !== id));
  }, []);
  /* 닫기는 leaving 표시 → 퇴장 트랜지션 → 제거. 같은 토스트를 다시 닫아도 leaving은 그대로고 제거만 한 번 더 시도한다(없으면 무시) */
  const dismiss = useCallback((/** @type {number} */ id) => {
    if (reducedMotion()) return drop(id);
    setItems((p) => p.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    timers.current.set(id, setTimeout(() => drop(id), EXIT_MS));
  }, [drop]);
  const toast = useCallback((/** @type {import("./Toast.d.ts").ToastOptions} */ t) => {
    const id = ++seq.current;
    setItems((p) => {
      const next = [...p, /** @type {QueuedToast} */ ({ id, tone: "info", duration: 4000, ...t })];
      /* 퇴장 중인 토스트는 자리를 비우는 중이므로 max에서 세지 않는다. 넘치는 만큼 오래된 것부터 즉시 뺀다 */
      let over = next.filter((x) => !x.leaving).length - max;
      return next.filter((x) => x.leaving || over-- <= 0);
    });
    /* 행동(action)이 있거나 crit이면 닫기 전까지 남는다. duration을 직접 주면 그대로 따른다 */
    const d = t.duration ?? (t.action || t.tone === "crit" ? 0 : 4000); if (d > 0) timers.current.set(id, setTimeout(() => dismiss(id), d));
    return id;
  }, [dismiss, max]);
  /* toast·dismiss 는 이미 useCallback 으로 안정적이다. 인라인 객체만이 값을 흔들어,
     토스트 하나당(등장·leaving·제거) useToast 소비자 전체가 세 번 다시 그려졌다. */
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

/** 토스트 한 장. 보통 Provider가 그린다. leaving은 Provider가 퇴장 중에 세운다.
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
