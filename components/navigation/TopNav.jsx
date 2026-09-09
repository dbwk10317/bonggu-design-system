import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { MascotMark } from "../brand/MascotMark.jsx";

/** 사이드바 없는 제품의 상단 내비. brand + links(가로 스크롤) + end. 화면 5개 이하일 때 SidebarShell 대신. */
export function TopNav({ brand, links = [], end, sticky = true, className, ...rest }) {
  return (
    <header className={cx("bds-topnav", sticky && "bds-topnav--sticky", className)} {...rest}>
      <a className="bds-topnav__brand" href={brand?.href ?? "#"}>{brand?.mark === undefined ? <MascotMark size={24} /> : brand.mark}<span>{brand?.name}</span></a>
      <nav className="bds-topnav__links" aria-label="주 메뉴">
        {links.map((l, i) => <a key={i} href={l.href} onClick={l.onClick} className="bds-topnav__link" aria-current={l.active ? "page" : undefined}>{l.icon && <Icon name={l.icon} size={15} />}{l.label}</a>)}
      </nav>
      {end && <div className="bds-topnav__end">{end}</div>}
    </header>
  );
}
