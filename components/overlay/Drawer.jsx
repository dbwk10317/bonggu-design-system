import React, { useId, useRef } from "react";
import { useModalDialog } from "./useModalDialog.js";
import { cx } from "../core/frame.js";
import { IconButton } from "../action/IconButton.jsx";

/** Right-side panel on native <dialog>.showModal(). For viewing detail beside a list; decisions that need confirmation belong in Modal. size: sm 380 · md 480 · lg 640; full width below 768.
 * @param {Parameters<typeof import("./Drawer.d.ts").Drawer>[0]} props */
export function Drawer({ open, onClose, title, description, actions, size = "md", closeButton = true, className, children, ...rest }) {
  const panel = useRef(/** @type {HTMLDialogElement | null} */ (null)), tid = useId();
  useModalDialog(panel, open, onClose);
  return (
    <div className={cx("bds-side", open && "bds-side--open", `bds-side--${size}`)}>
      <dialog ref={panel} aria-labelledby={title ? tid : undefined} tabIndex={-1} className={cx("bds-side__panel", className)}
        onCancel={(e) => { e.preventDefault(); onClose?.(); }} {...rest}>
        {(title || closeButton) && <header className="bds-side__hd"><div className="bds-side__ttl">{title && <h2 id={tid}>{title}</h2>}{description && <p>{description}</p>}</div>{closeButton && <IconButton icon="x" size="sm" variant="ghost" aria-label="닫기" onClick={onClose} />}</header>}
        <div className="bds-side__body">{children}</div>
        {actions && <footer className="bds-side__ft">{actions}</footer>}
      </dialog>
    </div>
  );
}
