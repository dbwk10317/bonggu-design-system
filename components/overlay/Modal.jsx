import React, { useEffect, useRef } from "react";
import { cx } from "../core/frame.js";
import { IconButton } from "../action/IconButton.jsx";

/** 모달. Esc·딤·닫기 → onClose. 640 미만에서는 바텀시트. size: sm 360 · md 440 · lg 560 · xl 760. */
export function Modal({ open, onClose, title, description, actions, size = "md", closeButton = true, className, children, ...rest }) {
  const panel = useRef(null), opener = useRef(null);
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const first = panel.current?.querySelector("input,select,textarea,button:not([aria-label='닫기'])") ?? panel.current;
    first?.focus?.();
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; opener.current?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={cx("bds-modal", size !== "md" && `bds-modal--${size}`)} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined} tabIndex={-1} className={cx("bds-modal__panel", className)} {...rest}>
        {(title || closeButton) && <div className="bds-modal__hd">{title && <h2>{title}</h2>}{closeButton && <IconButton icon="x" size="sm" variant="ghost" aria-label="닫기" onClick={onClose} />}</div>}
        {description && <p className="bds-modal__desc">{description}</p>}
        {children && <div className="bds-modal__body">{children}</div>}
        {actions && <div className="bds-modal__ft">{actions}</div>}
      </div>
    </div>
  );
}
