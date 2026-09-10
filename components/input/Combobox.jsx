import React, { useEffect, useId, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

/** 검색 가능한 선택. options {value,label,detail?,disabled?}. 타이핑으로 거르고 ↑↓ Enter Esc. 선택지 6개 이상이면 Select 대신 이것.
 * @param {Parameters<typeof import("./Combobox.d.ts").Combobox>[0]} props */
export function Combobox({ options = [], value, onChange, placeholder = "검색 또는 선택", emptyText = "일치하는 항목이 없습니다", size = "md", fit = "flex", width, disabled, invalid, required, clearable = true, className, style, "aria-label": ariaLabel }) {
  const f = useFieldContext();
  const uid = useId().replace(/:/g, "");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const root = useRef(/** @type {HTMLDivElement | null} */ (null));
  const sel = options.find((o) => o.value === value) ?? null;
  const list = q ? options.filter((o) => `${o.label} ${o.detail ?? ""} ${o.value}`.toLowerCase().includes(q.toLowerCase())) : options;
  useEffect(() => { if (!open) return; const on = (/** @type {MouseEvent} */ e) => { if (!root.current?.contains(e.target)) { setOpen(false); setQ(""); } }; document.addEventListener("mousedown", on); return () => document.removeEventListener("mousedown", on); }, [open]);
  useEffect(() => { setIdx(0); }, [q, open]);
  const pick = (o) => { if (o?.disabled) return; onChange?.(o ? o.value : null, o); setOpen(false); setQ(""); };
  const onKey = (/** @type {import("react").KeyboardEvent<HTMLElement>} */ e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setIdx((i) => Math.min(list.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { if (open && list[idx]) { e.preventDefault(); pick(list[idx]); } else setOpen(true); }
    else if (e.key === "Escape") { setOpen(false); setQ(""); }
  };
  return (
    <div ref={root} className={cx("bds-combo", open && "bds-combo--open", className)} style={frameStyle({ fit, width, style })}>
      <div className={cx("bds-ctl", size === "sm" && "bds-ctl--sm", (invalid ?? f?.invalid) && "bds-ctl--err", disabled && "bds-ctl--disabled")} onClick={() => !disabled && setOpen(true)}>
        <Icon name="magnifying-glass" size={14} className="bds-ctl__affix" />
        <input id={f?.id} role="combobox" aria-expanded={open} aria-controls={`${uid}-list`} aria-activedescendant={open && list[idx] ? `${uid}-${idx}` : undefined} aria-autocomplete="list" aria-label={ariaLabel} aria-describedby={f?.describedBy} aria-invalid={(invalid ?? f?.invalid) || undefined} aria-required={(required ?? f?.required) || undefined}
          value={open ? q : (sel?.label ?? "")} placeholder={sel ? sel.label : placeholder} disabled={disabled} autoComplete="off"
          onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
        {clearable && sel && !disabled && <button type="button" className="bds-combo__x" aria-label="선택 해제" onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); pick(null); }}><Icon name="x" size={12} /></button>}
        <Icon name="caret-down" size={14} className="bds-ctl__affix bds-combo__caret" />
      </div>
      {open && (
        <ul id={`${uid}-list`} role="listbox" className="bds-combo__list">
          {!list.length && <li className="bds-combo__empty">{emptyText}</li>}
          {list.map((o, i) => <li key={o.value} id={`${uid}-${i}`} role="option" aria-selected={o.value === value} aria-disabled={o.disabled || undefined} className={cx("bds-combo__opt", i === idx && "bds-combo__opt--act", o.disabled && "bds-combo__opt--dis")} onMouseEnter={() => setIdx(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}>
            <span className="bds-combo__l">{o.label}</span>{o.detail && <span className="bds-combo__d bds-mono">{o.detail}</span>}{o.value === value && <Icon name="check" size={13} className="bds-combo__ck" />}
          </li>)}
        </ul>
      )}
    </div>
  );
}
