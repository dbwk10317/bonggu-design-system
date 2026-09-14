import React, { cloneElement, useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";

/** Click-opened panel for explanations or mini forms. Unlike Tooltip it may hold interactive content. Wraps one trigger.
 * @param {Parameters<typeof import("./Popover.d.ts").Popover>[0]} props */
export function Popover({ trigger, title, side = "bottom", open: ctrl, onOpenChange, className, children }) {
  const [inner, setInner] = useState(false);
  const open = ctrl ?? inner;
  /* onOpenChange is a new function every render; as an effect dependency it would re-bind the listeners each time. */
  const notify = useRef(onOpenChange);
  useEffect(() => { notify.current = onOpenChange; });
  const set = (/** @type {boolean} */ v) => { setInner(v); onOpenChange?.(v); };
  const root = useRef(/** @type {HTMLDivElement | null} */ (null)), id = useId().replace(/:/g, "");
  useEffect(() => {
    if (!open) return;
    /* Build close inside the effect; the outer set is a new function per render and would re-bind the listeners. */
    const close = () => { setInner(false); notify.current?.(false); };
    const on = (/** @type {MouseEvent} */ e) => { if (!root.current?.contains(/** @type {Node} */ (e.target))) close(); };
    const key = (/** @type {KeyboardEvent} */ e) => { if (e.key === "Escape") { close(); /** @type {HTMLElement | null | undefined} */ (root.current?.firstElementChild)?.focus?.(); } }; document.addEventListener("mousedown", on); document.addEventListener("keydown", key); return () => { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", key); }; }, [open]);
  const trig = cloneElement(trigger, { "aria-expanded": open, "aria-controls": id, "aria-haspopup": "dialog", onClick: (/** @type {import("react").MouseEvent<HTMLElement>} */ e) => { trigger.props.onClick?.(e); set(!open); } });
  return (
    <span ref={root} className={cx("bds-pop", className)}>
      {trig}
      {open && <div id={id} role="dialog" aria-label={typeof title === "string" ? title : undefined} className={cx("bds-pop__panel", "bds-pop__panel--" + side)}>{title && <b className="bds-pop__t">{title}</b>}<div className="bds-pop__body">{children}</div></div>}
    </span>
  );
}
