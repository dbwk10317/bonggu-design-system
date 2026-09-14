import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useModalDialog } from "../overlay/useModalDialog.js";

/** ⌘K command palette. items: {id, label, icon?, group?, hint?, keywords?, onSelect}. Controlled via open/onClose. inline renders the panel alone, without a backdrop (for docs).
 * @param {Parameters<typeof import("./CommandPalette.d.ts").CommandPalette>[0]} props */
export function CommandPalette({ open = false, onClose, items = [], placeholder = "명령 또는 화면 검색", inline = false, className }) {
  /* Each open is a fresh session. Resetting query/highlight in an effect would flash the stale frame first,
     so, like ConfirmDialog, unmount on close and keep no state. */
  if (!inline && !open) return null;
  return <CommandSession onClose={onClose} items={items} placeholder={placeholder} inline={inline} className={className} />;
}

/** @param {Omit<Parameters<typeof import("./CommandPalette.d.ts").CommandPalette>[0], "open">} props */
function CommandSession({ onClose, items = [], placeholder = "명령 또는 화면 검색", inline = false, className }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const uid = useId().replace(/:/g, "");
  const panel = useRef(/** @type {HTMLDialogElement | null} */ (null));
  /* The dialog session (focus trap, Esc, backdrop, focus restore) opens only when modal.
     inline is a documentation panel and must not steal focus. */
  useModalDialog(panel, !inline, onClose);

  const list = useMemo(() => { const s = q.trim().toLowerCase(); return !s ? items : items.filter((it) => (it.label + " " + (it.keywords ?? "") + " " + (it.group ?? "")).toLowerCase().includes(s)); }, [q, items]);
  /* Reset the highlight when the query changes. */
  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) { setPrevQ(q); setIdx(0); }
  /* A shrinking list can leave idx out of range; clamp once here instead of at every read site. */
  const active = idx < list.length ? idx : 0;

  /* While the modal is open everything outside is inert, so a command that moves focus must run after the
     session ends. Tie it to this effect's cleanup rather than a timer: declared after useModalDialog,
     so it runs after dialog.close(). See RULE.md "동작 계약". */
  const pending = useRef(/** @type {import("./CommandPalette.d.ts").CommandItem | null} */ (null));
  useEffect(() => () => { const it = pending.current; pending.current = null; if (it) it.onSelect?.(it); }, []);
  const run = (/** @type {import("./CommandPalette.d.ts").CommandItem | undefined} */ it) => {
    if (!it) return;
    pending.current = it;
    onClose?.();
  };
  const onKey = (/** @type {import("react").KeyboardEvent<HTMLElement>} */ e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(Math.min(list.length - 1, active + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(Math.max(0, active - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); run(list[active]); }
  };

  const body = (
    <>
      <div className="bds-cmdk__in"><Icon name="magnifying-glass" size={16} /><input value={q} onKeyDown={onKey} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label={placeholder} role="combobox" aria-expanded="true" aria-controls={`${uid}-list`} aria-activedescendant={list[active] ? `${uid}-opt-${active}` : undefined} /><kbd className="bds-kbd">Esc</kbd></div>
      <ul id={`${uid}-list`} role="listbox" aria-label={placeholder} className="bds-cmdk__list">
        {list.length === 0 && <li className="bds-cmdk__empty">일치하는 항목이 없습니다</li>}
        {list.map((it, i) => { const g = it.group && it.group !== list[i - 1]?.group ? it.group : null; return <React.Fragment key={it.id}>
          {g && <li className="bds-cmdk__grp" role="presentation">{g}</li>}
          {/* Keyboard is handled by the input's aria-activedescendant. A button inside the option would
              be announced twice in browse mode. */}
          <li id={`${uid}-opt-${i}`} role="option" aria-selected={i === active} className="bds-cmdk__item" onMouseEnter={() => setIdx(i)} onClick={() => run(it)}>{it.icon && <Icon name={it.icon} size={16} />}<span className="bds-ellipsis">{it.label}</span>{it.hint && <small>{it.hint}</small>}</li>
        </React.Fragment>; })}
      </ul>
      <div className="bds-cmdk__ft"><span><kbd className="bds-kbd">↑↓</kbd> 이동</span><span><kbd className="bds-kbd">↵</kbd> 실행</span></div>
    </>
  );

  if (inline) return <div className={cx("bds-cmdk bds-cmdk--inline", className)}><div className="bds-cmdk__panel">{body}</div></div>;
  return (
    <dialog ref={panel} aria-label="명령 팔레트" className={cx("bds-cmdk__panel", className)}
      onCancel={(e) => { e.preventDefault(); onClose?.(); }}>
      {body}
    </dialog>
  );
}
