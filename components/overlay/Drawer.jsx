import React, { useId, useRef } from "react";
import { useModalDialog } from "./useModalDialog.js";
import { cx } from "../core/frame.js";
import { IconButton } from "../action/IconButton.jsx";

/** 오른쪽 사이드 패널. 네이티브 <dialog>.showModal()로 포커스를 가둔다. 목록을 보면서 상세를 볼 때(실행 상세·모델 상세). 확인이 필요한 결정은 Modal. size: sm 380 · md 480 · lg 640. 768 미만은 전체 폭. */
export function Drawer({ open, onClose, title, description, actions, size = "md", closeButton = true, className, children, ...rest }) {
  const panel = useRef(null), tid = useId();
  useModalDialog(panel, open);
  const outside = (e) => { const r = e.currentTarget.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; };
  return (
    <div className={cx("bds-side", open && "bds-side--open", `bds-side--${size}`)}>
      <dialog ref={panel} aria-labelledby={title ? tid : undefined} tabIndex={-1} className={cx("bds-side__panel", className)}
        onCancel={(e) => { e.preventDefault(); onClose?.(); }} onMouseDown={(e) => { if (e.target === e.currentTarget && outside(e)) onClose?.(); }} {...rest}>
        {(title || closeButton) && <header className="bds-side__hd"><div className="bds-side__ttl">{title && <h2 id={tid}>{title}</h2>}{description && <p>{description}</p>}</div>{closeButton && <IconButton icon="x" size="sm" variant="ghost" aria-label="닫기" onClick={onClose} />}</header>}
        <div className="bds-side__body">{children}</div>
        {actions && <footer className="bds-side__ft">{actions}</footer>}
      </dialog>
    </div>
  );
}
