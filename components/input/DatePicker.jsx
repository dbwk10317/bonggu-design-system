import React, { useEffect, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";
import { useFieldContext } from "./Field.jsx";

const pad = (/** @type {number} */ n) => String(n).padStart(2, "0");
const iso = (/** @type {Date} */ d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

/** 단일 날짜 선택. value는 "YYYY-MM-DD". min/max 같은 형식. 기간은 DateRangePicker.
 * @param {Parameters<typeof import("./DatePicker.d.ts").DatePicker>[0]} props */
export function DatePicker({ value, onChange, min, max, placeholder = "날짜 선택", size = "md", fit = "flex", width, disabled, className, style }) {
  const f = useFieldContext();
  const [open, setOpen] = useState(false);
  const sel = value ? new Date(value + "T00:00:00") : null;
  const [view, setView] = useState(() => { const d = sel ?? new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  /* 값이 바뀌면 그 달로 옮긴다. 사용자가 넘겨 둔 달은 값이 그대로면 유지된다. */
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    const d = value ? new Date(value + "T00:00:00") : new Date();
    if (!Number.isNaN(d.getTime())) setView(new Date(d.getFullYear(), d.getMonth(), 1));
  }
  const root = useRef(/** @type {HTMLDivElement | null} */ (null)), trig = useRef(/** @type {HTMLButtonElement | null} */ (null));
  /* 닫힐 때 포커스를 트리거 버튼으로 돌린다(달력 셀이 언마운트되면 포커스가 body로 떨어진다) */
  const close = () => { setOpen(false); trig.current?.focus(); };
  useEffect(() => { if (!open) return; const on = (/** @type {MouseEvent} */ e) => { if (!root.current?.contains(/** @type {Node} */ (e.target))) setOpen(false); }; const key = (/** @type {KeyboardEvent} */ e) => { if (e.key === "Escape") close(); }; document.addEventListener("mousedown", on); document.addEventListener("keydown", key); return () => { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", key); }; }, [open]);
  const first = new Date(view.getFullYear(), view.getMonth(), 1), start = new Date(first); start.setDate(1 - first.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const weeks = Array.from({ length: 6 }, (_, r) => cells.slice(r * 7, r * 7 + 7));
  const today = iso(new Date());
  /* 그리드는 탭 스톱 하나에 화살표 이동이다(readme 접근성 절). 포커스가 셀에 있으므로 핸들러도 셀에 둔다. */
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
      <button ref={trig} type="button" id={f?.id} aria-describedby={f?.describedBy} aria-haspopup="dialog" aria-expanded={open} disabled={disabled} className={cx("bds-ctl", size === "sm" && "bds-ctl--sm", f?.invalid && "bds-ctl--err", disabled && "bds-ctl--disabled")} style={{ width: "100%", textAlign: "left" }} onClick={() => { if (!open) { const d = sel ?? new Date(); setView(new Date(d.getFullYear(), d.getMonth(), 1)); } setOpen((o) => !o); }}>
        <span className="bds-ctl__affix"><Icon name="calendar-blank" size={15} /></span>
        <span className={cx("bds-ellipsis", value && "bds-mono", !value && "bds-date__placeholder")} style={{ flex: 1 }}>{value ?? placeholder}</span>
      </button>
      {open && <div role="dialog" aria-label="날짜 선택" className="bds-date__pop">
        <div className="bds-cal__hd"><IconButton icon="caret-left" size="sm" variant="ghost" aria-label="이전 달" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} /><b>{view.getFullYear()}.{pad(view.getMonth() + 1)}</b><IconButton icon="caret-right" size="sm" variant="ghost" aria-label="다음 달" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} /></div>
        {/* role=grid는 row가 필수. display:contents 래퍼로 7열 격자 레이아웃은 그대로 둔다 */}
        <div className="bds-cal__grid" role="grid">
          <div role="row" style={{ display: "contents" }}>{DOW.map((d) => <span key={d} className="bds-cal__dow" role="columnheader">{d}</span>)}</div>
          {weeks.map((wk, r) => <div key={r} role="row" style={{ display: "contents" }}>
            {wk.map((d) => { const s = iso(d); return <button key={s} type="button" role="gridcell" className={cx("bds-cal__d", d.getMonth() !== view.getMonth() && "bds-cal__d--out", s === today && "bds-cal__d--today")} aria-selected={s === value} aria-current={s === today ? "date" : undefined} tabIndex={s === (value ?? today) ? 0 : -1} onKeyDown={onCellKey} disabled={!inRange(d)} onClick={() => { onChange?.(s); close(); }}>{d.getDate()}</button>; })}
          </div>)}
        </div>
      </div>}
    </div>
  );
}
