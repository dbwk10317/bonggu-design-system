import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

const ToastCtx = createContext(null);
const ICON = { info: "info", ok: "check-circle", warn: "warning", crit: "warning-octagon" };

/** 토스트 프로바이더. 앱 루트에 한 번. useToast().toast({message, tone?, action?, duration?}) */
export function ToastProvider({ children, max = 3 }) {
  const [items, setItems] = useState([]);
  const seq = useRef(0);
  const dismiss = useCallback((id) => setItems((p) => p.filter((t) => t.id !== id)), []);
  const toast = useCallback((t) => {
    const id = ++seq.current;
    setItems((p) => [...p, { id, tone: "info", duration: 4000, ...t }].slice(-max));
    const d = t.duration ?? 4000; if (d > 0) setTimeout(() => dismiss(id), d);
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

/** 토스트 한 장. 보통 Provider가 그린다. */
export function Toast({ message, tone = "info", action, onAction, onDismiss, className }) {
  return (
    <div role="status" className={cx("bds-toast", `bds-tone--${tone}`, className)}>
      <Icon name={ICON[tone]} />
      <span className="bds-toast__m">{message}</span>
      {action && <button type="button" className="bds-toast__a" onClick={() => { onAction?.(); onDismiss?.(); }}>{action}</button>}
      {onDismiss && <button type="button" className="bds-toast__a" style={{ color: "var(--text-3)" }} aria-label="닫기" onClick={onDismiss}><Icon name="x" size={14} /></button>}
    </div>
  );
}
