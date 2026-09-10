import React, { cloneElement, useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";

/** 클릭으로 여는 설명·미니 폼 패널. Tooltip과 달리 상호작용 요소를 넣을 수 있다. trigger 하나를 감싼다.
 * @param {Parameters<typeof import("./Popover.d.ts").Popover>[0]} props */
export function Popover({ trigger, title, side = "bottom", open: ctrl, onOpenChange, className, children }) {
  const [inner, setInner] = useState(false);
  const open = ctrl ?? inner, set = (/** @type {boolean} */ v) => { setInner(v); onOpenChange?.(v); };
  const root = useRef(/** @type {HTMLDivElement | null} */ (null)), id = useId().replace(/:/g, "");
  useEffect(() => { if (!open) return; const on = (/** @type {MouseEvent} */ e) => { if (!root.current?.contains(/** @type {Node} */ (e.target))) set(false); }; const key = (/** @type {KeyboardEvent} */ e) => { if (e.key === "Escape") { set(false); /** @type {HTMLElement | null | undefined} */ (root.current?.firstElementChild)?.focus?.(); } }; document.addEventListener("mousedown", on); document.addEventListener("keydown", key); return () => { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", key); }; }, [open]);
  const trig = cloneElement(trigger, { "aria-expanded": open, "aria-controls": id, "aria-haspopup": "dialog", onClick: (/** @type {import("react").MouseEvent<HTMLElement>} */ e) => { trigger.props.onClick?.(e); set(!open); } });
  return (
    <span ref={root} className={cx("bds-pop", className)}>
      {trig}
      {open && <div id={id} role="dialog" aria-label={typeof title === "string" ? title : undefined} className={cx("bds-pop__panel", "bds-pop__panel--" + side)}>{title && <b className="bds-pop__t">{title}</b>}<div className="bds-pop__body">{children}</div></div>}
    </span>
  );
}
