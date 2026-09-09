import React, { useEffect, useId, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { Tag } from "../display/Tag.jsx";
import { useFieldContext } from "./Field.jsx";

/** 여러 개 선택(태그 입력). options: {value,label}. value는 배열. 입력으로 필터, Backspace로 마지막 제거. */
export function MultiSelect({ options = [], value = [], onChange, placeholder = "선택", max, fit = "flex", width, disabled, className, style }) {
  const f = useFieldContext(), uid = useId().replace(/:/g, "");
  const [q, setQ] = useState(""), [open, setOpen] = useState(false), [idx, setIdx] = useState(0);
  const root = useRef(null), input = useRef(null);
  const sel = new Set(value);
  const list = options.filter((o) => !sel.has(o.value) && o.label.toLowerCase().includes(q.trim().toLowerCase()));
  const full = max != null && value.length >= max;
  useEffect(() => { if (!open) return; const on = (e) => { if (!root.current?.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", on); return () => document.removeEventListener("mousedown", on); }, [open]);
  useEffect(() => setIdx(0), [q, open]);
  const add = (v) => { if (full) return; onChange?.([...value, v]); setQ(""); input.current?.focus(); };
  const remove = (v) => onChange?.(value.filter((x) => x !== v));
  const onKey = (e) => {
    if (e.key === "Backspace" && !q && value.length) remove(value[value.length - 1]);
    else if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setIdx((i) => Math.min(list.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter" && open && list[idx]) { e.preventDefault(); add(list[idx].value); }
    else if (e.key === "Escape") setOpen(false);
  };
  return (
    <div ref={root} className={cx("bds-multi", "bds-combo", className)} style={frameStyle({ fit, width, style })}>
      <div className={cx("bds-ctl", f?.invalid && "bds-ctl--err", disabled && "bds-ctl--disabled")} onClick={() => input.current?.focus()}>
        {value.map((v) => { const o = options.find((x) => x.value === v); return <Tag key={v} onRemove={disabled ? undefined : () => remove(v)}>{o?.label ?? v}</Tag>; })}
        <input ref={input} id={f?.id} aria-describedby={f?.describedBy} role="combobox" aria-expanded={open} aria-controls={`${uid}-list`} aria-activedescendant={open && !full && list[idx] ? `${uid}-${idx}` : undefined} aria-autocomplete="list" value={q} disabled={disabled || full} placeholder={value.length ? (full ? "" : "") : placeholder} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
        <Icon name="caret-down" size={13} className="bds-multi__caret" />
      </div>
      {open && !full && <ul id={`${uid}-list`} role="listbox" className="bds-combo__list">
        {list.length === 0 && <li className="bds-combo__empty">{q ? "일치하는 항목 없음" : "모두 선택됨"}</li>}
        {list.map((o, i) => <li key={o.value} id={`${uid}-${i}`} role="option" aria-selected={i === idx} className={cx("bds-combo__opt", i === idx && "bds-combo__opt--act")} onMouseEnter={() => setIdx(i)} onMouseDown={(e) => { e.preventDefault(); add(o.value); }}>{o.label}</li>)}
      </ul>}
    </div>
  );
}
