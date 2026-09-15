import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { MascotMark } from "../brand/MascotMark.jsx";

/** Top navigation for products without a sidebar: brand + links (horizontal scroll) + end. Use instead of SidebarShell for five screens or fewer.
 * @param {Parameters<typeof import("./TopNav.d.ts").TopNav>[0]} props */
export function TopNav({ brand, links = [], end, sticky = true, skipTo, className, ...rest }) {
  return (
    <>
    {/* First tab stop; visible only while focused. See RULE.md "접근성". */}
    {skipTo && <a className="bds-skip" href={`#${skipTo}`}>본문으로 건너뛰기</a>}
    <header className={cx("bds-topnav", sticky && "bds-topnav--sticky", className)} {...rest}>
      <a className="bds-topnav__brand" href={brand?.href ?? "#"}>{brand?.mark === undefined ? <MascotMark size={24} /> : brand.mark}<span>{brand?.name}</span></a>
      <nav className="bds-topnav__links" aria-label="주 메뉴">
        {links.map((l, i) => <a key={i} href={l.href} onClick={l.onClick} className="bds-topnav__link" aria-current={l.active ? "page" : undefined}>{l.icon && <Icon name={l.icon} size={15} />}{l.label}</a>)}
      </nav>
      {end && <div className="bds-topnav__end">{end}</div>}
    </header>
    </>
  );
}
