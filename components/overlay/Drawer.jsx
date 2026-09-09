import React, { useEffect, useRef } from "react";
import { cx } from "../core/frame.js";
import { IconButton } from "../action/IconButton.jsx";

/** 오른쪽 사이드 패널. 목록을 보면서 상세를 볼 때(실행 상세·모델 상세). 확인이 필요한 결정은 Modal. size: sm 380 · md 480 · lg 640. 768 미만은 전체 폭. */
export function Drawer({ open, onClose, title, description, actions, size = "md", closeButton = true, className, children, ...rest }) {
  const panel = useRef(null), opener = useRef(null);
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => panel.current?.focus());
    return () => { document.removeEventListener("keydown", onKey); opener.current?.focus?.(); };
  }, [open, onClose]);
  return (
    <div className={cx("bds-side", open && "bds-side--open", `bds-side--${size}`)} aria-hidden={!open}>
      <div className="bds-side__dim" onMouseDown={onClose} />
      <aside ref={panel} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined} tabIndex={-1} className={cx("bds-side__panel", className)} {...rest}>
        {(title || closeButton) && <header className="bds-side__hd"><div className="bds-side__ttl">{title && <h2>{title}</h2>}{description && <p>{description}</p>}</div>{closeButton && <IconButton icon="x" size="sm" variant="ghost" aria-label="닫기" onClick={onClose} />}</header>}
        <div className="bds-side__body">{children}</div>
        {actions && <footer className="bds-side__ft">{actions}</footer>}
      </aside>
    </div>
  );
}
