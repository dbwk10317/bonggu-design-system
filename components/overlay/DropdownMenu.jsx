import React, { useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { useAnchoredPopover } from "../core/useAnchoredPopover.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";

/** "…" menu. items: {label, icon?, onSelect, danger?, disabled?} | "-" (separator). Without trigger, renders a dots-three IconButton.
 * @param {Parameters<typeof import("./DropdownMenu.d.ts").DropdownMenu>[0]} props */
export function DropdownMenu({ items = [], trigger, align = "end", size = "sm", "aria-label": ariaLabel = "더 보기", className }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(-1);
  const root = useRef(/** @type {HTMLDivElement | null} */ (null)), panel = useRef(/** @type {HTMLUListElement | null} */ (null)), uid = useId().replace(/:/g, "");
  const enabled = items.map((it, i) => (it !== "-" && !it.disabled ? i : -1)).filter((i) => i >= 0);
  useAnchoredPopover({ open, anchorRef: root, panelRef: panel, align, onDismiss: () => setOpen(false) });
  /* Return focus to the trigger on close; once the items unmount it would drop to body. */
  const close = () => { if (panel.current?.matches(":popover-open")) panel.current.hidePopover(); setOpen(false); /** @type {HTMLElement | null | undefined} */ (root.current?.querySelector("[aria-haspopup]"))?.focus(); };
  useEffect(() => { if (!open) return; const on = (/** @type {PointerEvent} */ e) => { if (!root.current?.contains(/** @type {Node} */ (e.target))) setOpen(false); }; const key = (/** @type {KeyboardEvent} */ e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } }; document.addEventListener("pointerdown", on); document.addEventListener("keydown", key); return () => { document.removeEventListener("pointerdown", on); document.removeEventListener("keydown", key); }; }, [open]);
  /* Only open state and the active index move focus. items is usually an inline array, so listing it
     as a dependency would snap focus back to the active item on every parent render. */
  const active = enabled.includes(idx) ? idx : enabled[0];
  useEffect(() => { if (!open) return; if (active !== undefined) /** @type {HTMLElement | null | undefined} */ (panel.current?.querySelector(`[data-menu-index="${active}"]`))?.focus(); }, [active, open]);
  const toggleOpen = () => { if (open) close(); else { setIdx(enabled[0] ?? -1); setOpen(true); } };
  const onKey = (/** @type {import("react").KeyboardEvent<HTMLElement>} */ e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpen(true); setIdx(enabled[0] ?? -1); return; }
    if (!open) return;
    const p = enabled.indexOf(idx);
    if (e.key === "Tab") { close(); return; }
    if (!enabled.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(enabled[(p + 1) % enabled.length]); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(enabled[(p - 1 + enabled.length) % enabled.length]); }
    else if (e.key === "Home") { e.preventDefault(); setIdx(enabled[0]); }
    else if (e.key === "End") { e.preventDefault(); setIdx(enabled[enabled.length - 1]); }
  };
  const pick = (/** @type {import("./DropdownMenu.d.ts").MenuItem} */ it) => { if (it.disabled) return; close(); it.onSelect?.(); };
  const trig = trigger ? React.cloneElement(trigger, { "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": `${uid}-menu`, onClick: (/** @type {import("react").MouseEvent<HTMLElement>} */ e) => { trigger.props.onClick?.(e); if (!e.defaultPrevented) toggleOpen(); }, onKeyDown: (/** @type {import("react").KeyboardEvent<HTMLElement>} */ e) => { trigger.props.onKeyDown?.(e); if (!e.defaultPrevented) onKey(e); } }) : <IconButton icon="dots-three" size={size} variant="ghost" aria-label={ariaLabel} aria-haspopup="menu" aria-expanded={open} aria-controls={`${uid}-menu`} onClick={toggleOpen} onKeyDown={onKey} />;
  return (
    <span ref={root} className={cx("bds-menu", className)}>
      {trig}
      {open && (
        <ul ref={panel} popover="manual" id={`${uid}-menu`} role="menu" aria-label={ariaLabel} className="bds-menu__list" onKeyDown={onKey}>
          {items.map((it, i) => it === "-" ? <li key={i} role="separator" className="bds-menu__sep" /> : (
            <li key={i} role="none"><button data-menu-index={i} id={`${uid}-${i}`} type="button" role="menuitem" tabIndex={-1} disabled={it.disabled} className={cx("bds-menu__item", it.danger && "bds-menu__item--danger")} onClick={() => pick(it)} onMouseEnter={() => !it.disabled && setIdx(i)}>{it.icon && <Icon name={it.icon} size={15} />}<span>{it.label}</span>{it.shortcut && <kbd className="bds-kbd">{it.shortcut}</kbd>}</button></li>
          ))}
        </ul>
      )}
    </span>
  );
}
