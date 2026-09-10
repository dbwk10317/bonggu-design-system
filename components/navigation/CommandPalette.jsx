import React, { useEffect, useMemo, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** ⌘K 명령 팔레트. items: {id, label, icon?, group?, hint?, keywords?, onSelect}. open/onClose 제어형. inline이면 딤 없이 패널만(문서용).
 * @param {Parameters<typeof import("./CommandPalette.d.ts").CommandPalette>[0]} props */
export function CommandPalette({ open = false, onClose, items = [], placeholder = "명령 또는 화면 검색", inline = false, className }) {
  const [q, setQ] = useState(""), [idx, setIdx] = useState(0), input = useRef(/** @type {HTMLInputElement | null} */ (null)), opener = useRef(/** @type {HTMLElement | null} */ (null));
  const list = useMemo(() => { const s = q.trim().toLowerCase(); return !s ? items : items.filter((it) => (it.label + " " + (it.keywords ?? "") + " " + (it.group ?? "")).toLowerCase().includes(s)); }, [q, items]);
  /* 열 때 포커스를 입력으로, 닫을 때 열기 전 요소로 되돌린다 */
  useEffect(() => { if (!open || inline) return; opener.current = /** @type {HTMLElement | null} */ (document.activeElement); setQ(""); setIdx(0); setTimeout(() => input.current?.focus(), 0); return () => opener.current?.focus?.(); }, [open, inline]);
  /* 검색어가 바뀌면 강조를 첫 항목으로. */
  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) { setPrevQ(q); setIdx(0); }
  if (!open) return null;
  const run = (/** @type {import("./CommandPalette.d.ts").CommandItem | undefined} */ it) => { if (!it) return; onClose?.(); it.onSelect?.(it); };
  const onKey = (/** @type {import("react").KeyboardEvent<HTMLDivElement>} */ e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(list.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); run(list[idx]); }
    else if (e.key === "Escape") onClose?.();
  };
  return (
    <div className={cx("bds-cmdk", inline && "bds-cmdk--inline", className)} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div role="dialog" aria-label="명령 팔레트" className="bds-cmdk__panel" onKeyDown={onKey}>
        <div className="bds-cmdk__in"><Icon name="magnifying-glass" size={16} /><input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label={placeholder} role="combobox" aria-expanded="true" aria-controls="bds-cmdk-list" aria-activedescendant={list[idx] ? "bds-cmdk-" + list[idx].id : undefined} /><kbd className="bds-kbd">Esc</kbd></div>
        <ul id="bds-cmdk-list" role="listbox" className="bds-cmdk__list">
          {list.length === 0 && <li className="bds-cmdk__empty">일치하는 항목이 없습니다</li>}
          {list.map((it, i) => { const g = it.group && it.group !== list[i - 1]?.group ? it.group : null; return <React.Fragment key={it.id}>
            {g && <li className="bds-cmdk__grp" role="presentation">{g}</li>}
            <li role="option" id={"bds-cmdk-" + it.id} aria-selected={i === idx}><button type="button" className="bds-cmdk__item" tabIndex={-1} onMouseEnter={() => setIdx(i)} onClick={() => run(it)}>{it.icon && <Icon name={it.icon} size={16} />}<span className="bds-ellipsis">{it.label}</span>{it.hint && <small>{it.hint}</small>}</button></li>
          </React.Fragment>; })}
        </ul>
        <div className="bds-cmdk__ft"><span><kbd className="bds-kbd">↑↓</kbd> 이동</span><span><kbd className="bds-kbd">↵</kbd> 실행</span></div>
      </div>
    </div>
  );
}
