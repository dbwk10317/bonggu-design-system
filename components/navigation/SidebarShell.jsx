import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";
import { MascotMark } from "../brand/MascotMark.jsx";

/** @type {import("react").Context<(() => void) | null>} */
const CloseCtx = createContext(/** @type {any} */ (null));

/** Dashboard shell: 240px sidebar + 52px top bar + body + 28px status bar. The parent sets the height (pages use 100dvh).
 *  Below 1024 the sidebar becomes an overlay drawer (hamburger); below 768 the status bar is hidden. The body is a container-query root (container-name: body).
 * @param {Parameters<typeof import("./SidebarShell.d.ts").SidebarShell>[0]} props
 */
export function SidebarShell({ brand, nav, navLabel = "주 메뉴", footer, topbar, statusbar, className, children, ...rest }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const burger = useRef(/** @type {HTMLButtonElement | null} */ (null)), side = useRef(/** @type {HTMLElement | null} */ (null));
  useEffect(() => {
    if (!open) return;
    /* Move focus into the drawer (close button) on open and back to the hamburger on close.
       burger.current may point at a different node by cleanup time, so capture it now.
       Widening to the rail hides the hamburger; focusing a hidden node drops focus to body, so skip it then. */
    const trigger = burger.current;
    side.current?.querySelector("button")?.focus();
    const onKey = (/** @type {KeyboardEvent} */ e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); if (trigger?.isConnected && trigger.offsetParent !== null) trigger.focus(); };
  }, [open]);
  return (
    <div className={cx("bds-shell", open && "bds-shell--open", className)} {...rest}>
      {/* First tab stop; visible only while focused. See RULE.md "접근성". */}
      <a className="bds-skip" href={`#${id}-main`}>본문으로 건너뛰기</a>
      <aside id={id} ref={side} className="bds-shell__side">
        <div className="bds-shell__logo">
          {brand.mark === undefined ? <MascotMark size={26} /> : brand.mark}
          <div style={{ minWidth: 0 }}><b className="bds-ellipsis">{brand.name}</b>{brand.sub && <small className="bds-ellipsis">{brand.sub}</small>}</div>
          <IconButton className="bds-shell__close" icon="x" size="sm" variant="ghost" aria-label="메뉴 닫기" onClick={() => setOpen(false)} />
        </div>
        <nav className="bds-shell__nav" aria-label={navLabel}><CloseCtx.Provider value={open ? () => setOpen(false) : null}>{nav}</CloseCtx.Provider></nav>
        {footer != null && <div className="bds-shell__foot">{footer}</div>}
      </aside>
      <div className="bds-shell__dim" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="bds-shell__main" id={`${id}-main`} tabIndex={-1}>
        <header className="bds-shell__top">
          <IconButton ref={burger} className="bds-shell__burger" icon="list" variant="ghost" aria-label="메뉴 열기" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)} />
          {topbar}
        </header>
        <div className="bds-shell__body">{children}</div>
        {statusbar != null && <div className="bds-shell__status">{statusbar}</div>}
      </div>
    </div>
  );
}

/** Sidebar item: <a> with href, otherwise <button>. Picking one inside the drawer closes it.
 * @param {Parameters<typeof import("./SidebarShell.d.ts").SidebarNavItem>[0]} props */
export function SidebarNavItem({ icon, label, href, target, active = false, badge, onClick }) {
  const close = useContext(CloseCtx);
  const cls = cx("bds-shell__item", active && "bds-shell__item--on");
  const inner = <>{icon && <Icon name={icon} />}<span className="bds-ellipsis" style={{ flex: 1 }}>{label}</span>{badge != null && <><span className="bds-shell__item__badge" aria-hidden="true">{badge}</span><span className="bds-sr">{badge}건</span></>}{target === "_blank" && <Icon name="arrow-square-out" size={12} label="새 창에서 열림" />}</>;
  const handle = () => { onClick?.(); if (target !== "_blank") close?.(); };
  return href ? <a className={cls} href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} aria-current={active ? "page" : undefined} onClick={handle}>{inner}</a>
    : <button type="button" className={cls} aria-current={active ? "page" : undefined} onClick={handle}>{inner}</button>;
}

/** Sidebar section label.
 * @param {Parameters<typeof import("./SidebarShell.d.ts").SidebarNavGroup>[0]} props */
export function SidebarNavGroup({ label }) { return <div className="bds-shell__grp">{label}</div>; }
