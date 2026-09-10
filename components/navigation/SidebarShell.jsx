import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { IconButton } from "../action/IconButton.jsx";
import { MascotMark } from "../brand/MascotMark.jsx";

const CloseCtx = createContext(null);

/** 대시보드 셸: 240px 사이드바 + 52px 상단바 + 본문 + 28px 상태바. 부모가 높이를 정한다(페이지는 100dvh).
 *  1024 미만: 사이드바가 오버레이 드로어(햄버거). 768 미만: 상태바 숨김. 본문은 컨테이너 쿼리 대상(container-name: body).
 * @param {Parameters<typeof import("./SidebarShell.d.ts").SidebarShell>[0]} props
 */
export function SidebarShell({ brand, nav, navLabel = "주 메뉴", footer, topbar, statusbar, className, children, ...rest }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const burger = useRef(null), side = useRef(null);
  useEffect(() => {
    if (!open) return;
    /* 드로어로 열리면 포커스를 안으로(닫기 버튼) 옮기고, 닫히면 햄버거로 돌린다 */
    side.current?.querySelector("button")?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); burger.current?.focus(); };
  }, [open]);
  return (
    <div className={cx("bds-shell", open && "bds-shell--open", className)} {...rest}>
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
      <div className="bds-shell__main">
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

/** 사이드바 항목. href가 있으면 a, 없으면 button. 드로어 안에서 고르면 드로어가 닫힌다.
 * @param {Parameters<typeof import("./SidebarShell.d.ts").SidebarNavItem>[0]} props */
export function SidebarNavItem({ icon, label, href, target, active = false, badge, onClick }) {
  const close = useContext(CloseCtx);
  const cls = cx("bds-shell__item", active && "bds-shell__item--on");
  const inner = <>{icon && <Icon name={icon} />}<span className="bds-ellipsis" style={{ flex: 1 }}>{label}</span>{badge != null && <><span className="bds-shell__item__badge" aria-hidden="true">{badge}</span><span className="bds-sr">{badge}건</span></>}{target === "_blank" && <Icon name="arrow-square-out" size={12} label="새 창에서 열림" />}</>;
  const handle = () => { onClick?.(); if (target !== "_blank") close?.(); };
  return href ? <a className={cls} href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} aria-current={active ? "page" : undefined} onClick={handle}>{inner}</a>
    : <button type="button" className={cls} aria-current={active ? "page" : undefined} onClick={handle}>{inner}</button>;
}

/** 사이드바 섹션 라벨.
 * @param {Parameters<typeof import("./SidebarShell.d.ts").SidebarNavGroup>[0]} props */
export function SidebarNavGroup({ label }) { return <div className="bds-shell__grp">{label}</div>; }
