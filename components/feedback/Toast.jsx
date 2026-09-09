import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

const ToastCtx = createContext(null);
const ICON = { info: "info", ok: "check-circle", warn: "warning", crit: "warning-octagon" };
/* 퇴장 길이는 .bds-toast--leaving의 transition(--dur-base)과 같아야 한다. reduced-motion이면 애니메이션 없이 즉시 제거한다 */
const EXIT_MS = 180;
const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion:reduce)").matches;

/** 토스트 프로바이더. 앱 루트에 한 번. useToast().toast({message, tone?, action?, duration?}) */
export function ToastProvider({ children, max = 3 }) {
  const [items, setItems] = useState([]);
  const seq = useRef(0);
  const drop = useCallback((id) => setItems((p) => p.filter((t) => t.id !== id)), []);
  /* 닫기는 leaving 표시 → 퇴장 트랜지션 → 제거. 같은 토스트를 다시 닫아도 leaving은 그대로고 제거만 한 번 더 시도한다(없으면 무시) */
  const dismiss = useCallback((id) => {
    if (reducedMotion()) return drop(id);
    setItems((p) => p.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => drop(id), EXIT_MS);
  }, [drop]);
  const toast = useCallback((t) => {
    const id = ++seq.current;
    setItems((p) => {
      const next = [...p, { id, tone: "info", duration: 4000, ...t }];
      /* 퇴장 중인 토스트는 자리를 비우는 중이므로 max에서 세지 않는다. 넘치는 만큼 오래된 것부터 즉시 뺀다 */
      let over = next.filter((x) => !x.leaving).length - max;
      return next.filter((x) => x.leaving || over-- <= 0);
    });
    /* 행동(action)이 있거나 crit이면 닫기 전까지 남는다. duration을 직접 주면 그대로 따른다 */
    const d = t.duration ?? (t.action || t.tone === "crit" ? 0 : 4000); if (d > 0) setTimeout(() => dismiss(id), d);
    return id;
  }, [dismiss, max]);
  return (
    <ToastCtx.Provider value={{ toast, dismiss }}>
      {children}
      <div className="bds-toasts" role="region" aria-label="알림 메시지">
        {items.map((t) => <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() { const c = useContext(ToastCtx); if (!c) throw new Error("useToast는 ToastProvider 안에서만 쓸 수 있습니다."); return c; }
/* 번들 네임스페이스에는 대문자 export만 노출되므로 정적 HTML에서는 ToastProvider.useToast()로 접근한다. */
ToastProvider.useToast = useToast;

/** 토스트 한 장. 보통 Provider가 그린다. leaving은 Provider가 퇴장 중에 세운다. */
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
