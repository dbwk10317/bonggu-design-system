import React, { forwardRef, useEffect, useRef, useState } from "react";
import { assignRef, cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";
import { useFieldContext } from "./Field.jsx";

const pad = (/** @type {number} */ n) => String(n).padStart(2, "0");
const iso = (/** @type {Date} */ d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

/** Single date picker. value is "YYYY-MM-DD"; min/max use the same format. For ranges use DateRangePicker. */
export const DatePicker = forwardRef(
  /**
   * @param {import("./DatePicker.d.ts").DatePickerProps} props
   * @param {import("react").ForwardedRef<HTMLButtonElement>} ref
   */
  function DatePicker({ value, onChange, min, max, placeholder = "날짜 선택", size = "md", fit = "flex", width, disabled, className, style }, ref) {
  const f = useFieldContext();
  const [open, setOpen] = useState(false);
  const sel = value ? new Date(value + "T00:00:00") : null;
  const [view, setView] = useState(() => { const d = sel ?? new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  /* Follow the value to its month. A month the user paged to survives as long as the value is unchanged. */
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    const d = value ? new Date(value + "T00:00:00") : new Date();
    if (!Number.isNaN(d.getTime())) setView(new Date(d.getFullYear(), d.getMonth(), 1));
  }
  const root = useRef(/** @type {HTMLDivElement | null} */ (null)), trig = useRef(/** @type {HTMLButtonElement | null} */ (null));
  /* Return focus to the trigger on close (unmounting the focused calendar cell would drop focus to body) */
  const close = () => { setOpen(false); trig.current?.focus(); };
  useEffect(() => { if (!open) return; const on = (/** @type {MouseEvent} */ e) => { if (!root.current?.contains(/** @type {Node} */ (e.target))) setOpen(false); }; const key = (/** @type {KeyboardEvent} */ e) => { if (e.key === "Escape") close(); }; document.addEventListener("mousedown", on); document.addEventListener("keydown", key); return () => { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", key); }; }, [open]);
  const first = new Date(view.getFullYear(), view.getMonth(), 1), start = new Date(first); start.setDate(1 - first.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const weeks = Array.from({ length: 6 }, (_, r) => cells.slice(r * 7, r * 7 + 7));
  const today = iso(new Date());
  /* One tab stop, arrows move (see RULE.md "접근성"). Focus lives on the cell, so the handler does too. */
  const onCellKey = (/** @type {import("react").KeyboardEvent<HTMLButtonElement>} */ e) => {
    const step = /** @type {Record<string, number>} */ ({ ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 })[e.key];
    const edge = e.key === "Home" ? "first" : e.key === "End" ? "last" : null;
    if (step === undefined && !edge) return;
    e.preventDefault();
    const grid = e.currentTarget.closest("[role=grid]");
    if (!grid) return;
    const cells = [.../** @type {NodeListOf<HTMLElement>} */ (grid.querySelectorAll("[role=gridcell]:not([disabled])"))];
    const at = cells.indexOf(e.currentTarget);
    const to = edge === "first" ? 0 : edge === "last" ? cells.length - 1 : Math.min(cells.length - 1, Math.max(0, at + step));
    cells[to]?.focus();
  };
  const inRange = (/** @type {Date} */ d) => (!min || iso(d) >= min) && (!max || iso(d) <= max);
  return (
    <div ref={root} className={cx("bds-date", className)} style={frameStyle({ fit, width, style })}>
      <button ref={(el) => { trig.current = el; assignRef(ref, el); }} type="button" id={f?.id} aria-describedby={f?.describedBy} aria-haspopup="dialog" aria-expanded={open} disabled={disabled} className={cx("bds-ctl", size === "sm" && "bds-ctl--sm", f?.invalid && "bds-ctl--err", disabled && "bds-ctl--disabled")} style={{ width: "100%", textAlign: "left" }} onClick={() => { if (!open) { const d = sel ?? new Date(); setView(new Date(d.getFullYear(), d.getMonth(), 1)); } setOpen((o) => !o); }}>
        <span className="bds-ctl__affix"><Icon name="calendar-blank" size={15} /></span>
        <span className={cx("bds-ellipsis", value && "bds-mono", !value && "bds-date__placeholder")} style={{ flex: 1 }}>{value ?? placeholder}</span>
      </button>
      {open && <div role="dialog" aria-label="날짜 선택" className="bds-date__pop">
        <div className="bds-cal__hd"><IconButton icon="caret-left" size="sm" variant="ghost" aria-label="이전 달" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} /><b>{view.getFullYear()}.{pad(view.getMonth() + 1)}</b><IconButton icon="caret-right" size="sm" variant="ghost" aria-label="다음 달" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} /></div>
        {/* role=grid requires row children; display:contents wrappers keep the 7-column grid layout intact */}
        <div className="bds-cal__grid" role="grid">
          <div role="row" style={{ display: "contents" }}>{DOW.map((d) => <span key={d} className="bds-cal__dow" role="columnheader">{d}</span>)}</div>
          {weeks.map((wk, r) => <div key={r} role="row" style={{ display: "contents" }}>
            {wk.map((d) => { const s = iso(d); return <button key={s} type="button" role="gridcell" className={cx("bds-cal__d", d.getMonth() !== view.getMonth() && "bds-cal__d--out", s === today && "bds-cal__d--today")} aria-selected={s === value} aria-current={s === today ? "date" : undefined} tabIndex={s === (value ?? today) ? 0 : -1} onKeyDown={onCellKey} disabled={!inRange(d)} onClick={() => { onChange?.(s); close(); }}>{d.getDate()}</button>; })}
          </div>)}
        </div>
      </div>}
    </div>
  );
});
