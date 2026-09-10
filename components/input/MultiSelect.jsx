import React, { useEffect, useId, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { Tag } from "../display/Tag.jsx";
import { useFieldContext } from "./Field.jsx";

/** 여러 개 선택(태그 입력). options: {value,label}. value는 배열. 입력으로 필터, Backspace로 마지막 제거.
 * @param {Parameters<typeof import("./MultiSelect.d.ts").MultiSelect>[0]} props */
export function MultiSelect({ options = [], value = [], onChange, placeholder = "선택", max, fit = "flex", width, disabled, className, style }) {
  const f = useFieldContext(), uid = useId().replace(/:/g, "");
  const [q, setQ] = useState(""), [open, setOpen] = useState(false), [idx, setIdx] = useState(0);
  const root = useRef(/** @type {HTMLDivElement | null} */ (null)), input = useRef(/** @type {HTMLInputElement | null} */ (null));
  const sel = new Set(value);
  const list = options.filter((o) => !sel.has(o.value) && o.label.toLowerCase().includes(q.trim().toLowerCase()));
  const activeIdx = Math.min(idx, Math.max(0, list.length - 1));
  const full = max != null && value.length >= max;
  /* 가득 차도 입력을 없애지 않는다. 포커스가 있는 요소를 disabled 로 만들면 브라우저가 포커스를
     body 로 떨어뜨리고, 안내도 없이 탭 순서에서 사라진다. 읽기 전용으로 두고 이유를 알린다. */
  useEffect(() => { if (!open) return; const on = (/** @type {MouseEvent} */ e) => { if (!root.current?.contains(/** @type {Node} */ (e.target))) setOpen(false); }; document.addEventListener("mousedown", on); return () => document.removeEventListener("mousedown", on); }, [open]);
  /* 검색어나 열림이 바뀌면 강조를 첫 항목으로. */
  const cue = q + "\u0000" + open;
  const [prevCue, setPrevCue] = useState(cue);
  if (prevCue !== cue) { setPrevCue(cue); setIdx(0); }
  const add = (/** @type {string} */ v) => { if (full) return; onChange?.([...value, v]); setIdx(0); setQ(""); input.current?.focus(); };
  const remove = (/** @type {string} */ v) => onChange?.(value.filter((x) => x !== v));
  const onKey = (/** @type {import("react").KeyboardEvent<HTMLElement>} */ e) => {
    if (e.key === "Backspace" && !q && value.length) remove(value[value.length - 1]);
    else if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setIdx(Math.max(0, Math.min(list.length - 1, activeIdx + 1))); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(Math.max(0, activeIdx - 1)); }
    else if (e.key === "Enter" && open && list[activeIdx]) { e.preventDefault(); add(list[activeIdx].value); }
    else if (e.key === "Escape") setOpen(false);
  };
  return (
    <div ref={root} className={cx("bds-multi", "bds-combo", className)} style={frameStyle({ fit, width, style })}>
      <div className={cx("bds-ctl", f?.invalid && "bds-ctl--err", disabled && "bds-ctl--disabled")} onClick={() => input.current?.focus()}>
        {value.map((v) => { const o = options.find((x) => x.value === v); return <Tag key={v} onRemove={disabled ? undefined : () => remove(v)}>{o?.label ?? v}</Tag>; })}
        <input ref={input} id={f?.id} aria-describedby={f?.describedBy} role="combobox" aria-expanded={open} aria-controls={`${uid}-list`} aria-activedescendant={open && !full && list[activeIdx] ? `${uid}-${activeIdx}` : undefined} aria-autocomplete="list" value={q} disabled={disabled} readOnly={full} aria-readonly={full || undefined} placeholder={value.length ? (full ? "" : "") : placeholder} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
        <Icon name="caret-down" size={13} className="bds-multi__caret" />
      </div>
      {open && !full && <ul id={`${uid}-list`} role="listbox" className="bds-combo__list">
        {list.length === 0 && <li className="bds-combo__empty">{q ? "일치하는 항목 없음" : "모두 선택됨"}</li>}
        {list.map((o, i) => <li key={o.value} id={`${uid}-${i}`} role="option" aria-selected={i === activeIdx} className={cx("bds-combo__opt", i === activeIdx && "bds-combo__opt--act")} onMouseEnter={() => setIdx(i)} onMouseDown={(e) => { e.preventDefault(); add(o.value); }}>{o.label}</li>)}
      </ul>}
    </div>
  );
}
