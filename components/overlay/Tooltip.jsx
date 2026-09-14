import React, { cloneElement, useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";

/** Generic tooltip. Wraps one child and shows content on hover/focus; closes on Esc, blur and mouseleave. For truncated text and icon-button labels; never interactive content.
 * @param {Parameters<typeof import("./Tooltip.d.ts").Tooltip>[0]} props */
export function Tooltip({ content, side = "top", delay = 300, children, className }) {
  const [open, setOpen] = useState(false);
  const id = useId().replace(/:/g, "");
  const t = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));
  const show = () => { clearTimeout(t.current ?? undefined); t.current = setTimeout(() => setOpen(true), delay); };
  const hide = () => { clearTimeout(t.current ?? undefined); setOpen(false); };
  useEffect(() => () => clearTimeout(t.current ?? undefined), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (/** @type {KeyboardEvent} */ e) => { if (e.key === "Escape") hide(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const child = React.Children.only(children);
  return (
    <span className={cx("bds-tipwrap", className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {cloneElement(child, { "aria-describedby": open ? id : child.props["aria-describedby"] })}
      {open && content != null && <span role="tooltip" id={id} className={cx("bds-tip", `bds-tip--${side}`)}>{content}</span>}
    </span>
  );
}
