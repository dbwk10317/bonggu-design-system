import React, { useId, useRef } from "react";
import { useModalDialog } from "./useModalDialog.js";
import { cx } from "../core/frame.js";
import { IconButton } from "../action/IconButton.jsx";

/** 모달. 네이티브 <dialog>.showModal()로 포커스를 가둔다. Esc·딤·닫기 → onClose. 640 미만에서는 바텀시트. size: sm 360 · md 440 · lg 560 · xl 760.
 * @param {Parameters<typeof import("./Modal.d.ts").Modal>[0]} props */
export function Modal({ open, onClose, title, description, actions, size = "md", closeButton = true, className, children, ...rest }) {
  const panel = useRef(null), tid = useId();
  useModalDialog(panel, open);
  const outside = (e) => { const r = e.currentTarget.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; };
  if (!open) return null;
  return (
    <dialog ref={panel} aria-labelledby={title ? tid : undefined} tabIndex={-1} className={cx("bds-modal__panel", size !== "md" && `bds-modal--${size}`, className)}
      onCancel={(e) => { e.preventDefault(); onClose?.(); }} onMouseDown={(e) => { if (e.target === e.currentTarget && outside(e)) onClose?.(); }} {...rest}>
      {(title || closeButton) && <div className="bds-modal__hd">{title && <h2 id={tid}>{title}</h2>}{closeButton && <IconButton icon="x" size="sm" variant="ghost" aria-label="닫기" onClick={onClose} />}</div>}
      {description && <p className="bds-modal__desc">{description}</p>}
      {children && <div className="bds-modal__body">{children}</div>}
      {actions && <div className="bds-modal__ft">{actions}</div>}
    </dialog>
  );
}
