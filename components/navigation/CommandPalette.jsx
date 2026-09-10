import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useModalDialog } from "../overlay/useModalDialog.js";

/** ⌘K 명령 팔레트. items: {id, label, icon?, group?, hint?, keywords?, onSelect}. open/onClose 제어형. inline이면 딤 없이 패널만(문서용).
 * @param {Parameters<typeof import("./CommandPalette.d.ts").CommandPalette>[0]} props */
export function CommandPalette({ open = false, onClose, items = [], placeholder = "명령 또는 화면 검색", inline = false, className }) {
  /* 열 때마다 새 세션이다. 검색어·강조를 이펙트로 되돌리면 되돌리기 전 한 프레임이 그대로 보인다.
     ConfirmDialog 와 같은 방식으로, 닫히면 언마운트해 상태를 남기지 않는다. */
  if (!inline && !open) return null;
  return <CommandSession onClose={onClose} items={items} placeholder={placeholder} inline={inline} className={className} />;
}

/** @param {Omit<Parameters<typeof import("./CommandPalette.d.ts").CommandPalette>[0], "open">} props */
function CommandSession({ onClose, items = [], placeholder = "명령 또는 화면 검색", inline = false, className }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const uid = useId().replace(/:/g, "");
  const panel = useRef(/** @type {HTMLDialogElement | null} */ (null));
  /* 모달일 때만 dialog 세션을 연다. 포커스 가둠·Esc·배경 해제·포커스 복원을 훅이 맡는다.
     inline 은 문서용 패널이라 세션을 열지 않는다(포커스를 뺏으면 안 된다). */
  useModalDialog(panel, !inline, onClose);

  const list = useMemo(() => { const s = q.trim().toLowerCase(); return !s ? items : items.filter((it) => (it.label + " " + (it.keywords ?? "") + " " + (it.group ?? "")).toLowerCase().includes(s)); }, [q, items]);
  /* 검색어가 바뀌면 강조를 첫 항목으로. */
  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) { setPrevQ(q); setIdx(0); }
  /* 목록이 줄면 이전 강조가 범위를 벗어난다. 읽는 자리마다 막지 않고 여기서 한 번 거른다. */
  const active = idx < list.length ? idx : 0;

  /* 모달이 열려 있는 동안 바깥 요소는 inert 라 포커스를 받지 못한다. 포커스를 옮기는 명령이
     동작하려면 세션이 끝난 뒤에 실행해야 한다. 타이머가 아니라 dialog 세션의 정리에 묶는다
     (useModalDialog 보다 뒤에 선언했으므로 dialog.close() 뒤에 돈다). */
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
          {/* 키보드는 입력의 aria-activedescendant 가 맡는다. 항목 안에 버튼을 또 두면
              브라우즈 모드에서 option 안의 button 으로 중복해 읽힌다. */}
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
