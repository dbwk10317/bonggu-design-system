import React, { useEffect, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";
import { useFieldContext } from "./Field.jsx";

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

/** 단일 날짜 선택. value는 "YYYY-MM-DD". min/max 같은 형식. 기간은 DateRangePicker. */
export function DatePicker({ value, onChange, min, max, placeholder = "날짜 선택", size = "md", fit = "flex", width, disabled, className, style }) {
  const f = useFieldContext();
  const [open, setOpen] = useState(false);
  const sel = value ? new Date(value + "T00:00:00") : null;
  const [view, setView] = useState(() => { const d = sel ?? new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const root = useRef(null), trig = useRef(null);
  /* 닫힐 때 포커스를 트리거 버튼으로 돌린다(달력 셀이 언마운트되면 포커스가 body로 떨어진다) */
  const close = () => { setOpen(false); trig.current?.focus(); };
  useEffect(() => { if (!open) return; const on = (e) => { if (!root.current?.contains(e.target)) setOpen(false); }; const key = (e) => { if (e.key === "Escape") close(); }; document.addEventListener("mousedown", on); document.addEventListener("keydown", key); return () => { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", key); }; }, [open]);
  const first = new Date(view.getFullYear(), view.getMonth(), 1), start = new Date(first); start.setDate(1 - first.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const weeks = Array.from({ length: 6 }, (_, r) => cells.slice(r * 7, r * 7 + 7));
  const today = iso(new Date());
  const inRange = (d) => (!min || iso(d) >= min) && (!max || iso(d) <= max);
  return (
    <div ref={root} className={cx("bds-date", className)} style={frameStyle({ fit, width, style })}>
      <button ref={trig} type="button" id={f?.id} aria-describedby={f?.describedBy} aria-haspopup="dialog" aria-expanded={open} disabled={disabled} className={cx("bds-ctl", size === "sm" && "bds-ctl--sm", f?.invalid && "bds-ctl--err", disabled && "bds-ctl--disabled")} style={{ width: "100%", textAlign: "left" }} onClick={() => setOpen((o) => !o)}>
        <span className="bds-ctl__affix"><Icon name="calendar-blank" size={15} /></span>
        <span className={cx("bds-ellipsis", value && "bds-mono")} style={{ flex: 1, color: value ? undefined : "var(--ink-3)" }}>{value ?? placeholder}</span>
      </button>
      {open && <div role="dialog" aria-label="날짜 선택" className="bds-date__pop">
        <div className="bds-cal__hd"><IconButton icon="caret-left" size="sm" variant="ghost" aria-label="이전 달" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} /><b>{view.getFullYear()}.{pad(view.getMonth() + 1)}</b><IconButton icon="caret-right" size="sm" variant="ghost" aria-label="다음 달" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} /></div>
        {/* role=grid는 row가 필수. display:contents 래퍼로 7열 격자 레이아웃은 그대로 둔다 */}
        <div className="bds-cal__grid" role="grid">
          <div role="row" style={{ display: "contents" }}>{DOW.map((d) => <span key={d} className="bds-cal__dow" role="columnheader">{d}</span>)}</div>
          {weeks.map((wk, r) => <div key={r} role="row" style={{ display: "contents" }}>
            {wk.map((d) => { const s = iso(d); return <button key={s} type="button" role="gridcell" className={cx("bds-cal__d", d.getMonth() !== view.getMonth() && "bds-cal__d--out", s === today && "bds-cal__d--today")} aria-selected={s === value} disabled={!inRange(d)} onClick={() => { onChange?.(s); close(); }}>{d.getDate()}</button>; })}
          </div>)}
        </div>
      </div>}
    </div>
  );
}
