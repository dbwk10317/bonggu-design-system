import React, { useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";

/** "…" 메뉴. items: {label, icon?, onSelect, danger?, disabled?} | "-"(구분선). trigger를 안 주면 점 세 개 IconButton. */
export function DropdownMenu({ items = [], trigger, align = "end", size = "sm", "aria-label": ariaLabel = "더 보기", className }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(-1);
  const root = useRef(null), uid = useId().replace(/:/g, "");
  const enabled = items.map((it, i) => (it !== "-" && !it.disabled ? i : -1)).filter((i) => i >= 0);
  useEffect(() => { if (!open) return; const on = (e) => { if (!root.current?.contains(e.target)) setOpen(false); }; const key = (e) => { if (e.key === "Escape") setOpen(false); }; document.addEventListener("mousedown", on); document.addEventListener("keydown", key); return () => { document.removeEventListener("mousedown", on); document.removeEventListener("keydown", key); }; }, [open]);
  useEffect(() => { if (open) root.current?.querySelector(`#${uid}-${idx}`)?.focus(); }, [idx, open, uid]);
  const onKey = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpen(true); setIdx(enabled[0] ?? -1); return; }
    if (!open) return;
    const p = enabled.indexOf(idx);
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(enabled[(p + 1) % enabled.length]); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(enabled[(p - 1 + enabled.length) % enabled.length]); }
  };
  const pick = (it) => { if (it.disabled) return; setOpen(false); it.onSelect?.(); };
  const trig = trigger ? React.cloneElement(trigger, { "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": `${uid}-menu`, onClick: (e) => { trigger.props.onClick?.(e); setOpen((o) => !o); }, onKeyDown: onKey }) : <IconButton icon="dots-three" size={size} variant="ghost" aria-label={ariaLabel} aria-haspopup="menu" aria-expanded={open} aria-controls={`${uid}-menu`} onClick={() => setOpen((o) => !o)} onKeyDown={onKey} />;
  return (
    <span ref={root} className={cx("bds-menu", className)}>
      {trig}
      {open && (
        <ul id={`${uid}-menu`} role="menu" className={cx("bds-menu__list", `bds-menu__list--${align}`)} onKeyDown={onKey}>
          {items.map((it, i) => it === "-" ? <li key={i} role="separator" className="bds-menu__sep" /> : (
            <li key={i}><button id={`${uid}-${i}`} type="button" role="menuitem" tabIndex={-1} disabled={it.disabled} className={cx("bds-menu__item", it.danger && "bds-menu__item--danger")} onClick={() => pick(it)} onMouseEnter={() => setIdx(i)}>{it.icon && <Icon name={it.icon} size={15} />}<span>{it.label}</span>{it.shortcut && <kbd className="bds-kbd">{it.shortcut}</kbd>}</button></li>
          ))}
        </ul>
      )}
    </span>
  );
}
