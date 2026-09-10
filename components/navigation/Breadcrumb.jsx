import React, { useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 경로 표시. items: {label, href?}. 마지막은 현재 페이지. maxItems 초과 시 중간을 "…"로 접는다.
 * @param {Parameters<typeof import("./Breadcrumb.d.ts").Breadcrumb>[0]} props */
export function Breadcrumb({ items = [], maxItems = 4, className, ...rest }) {
  const [all, setAll] = useState(false);
  const collapse = !all && items.length > maxItems;
  /** @type {(import("./Breadcrumb.d.ts").BreadcrumbItem | "…")[]} */
  const shown = collapse ? [items[0], "…", ...items.slice(items.length - (maxItems - 2))] : items;
  return (
    <nav aria-label="경로" className={className} {...rest}>
      <ol className="bds-crumb">
        {shown.map((it, i) => {
          const last = i === shown.length - 1;
          return <li key={i}>
            {it === "…" ? <button type="button" className="bds-crumb__more" aria-label="숨긴 경로 펼치기" onClick={() => setAll(true)}><Icon name="dots-three" size={14} /></button>
              : last ? <span aria-current="page" className="bds-ellipsis" title={typeof it.label === "string" ? it.label : undefined}>{it.label}</span>
              : it.href ? <a href={it.href} onClick={it.onClick} className="bds-ellipsis" title={typeof it.label === "string" ? it.label : undefined}>{it.label}</a> : <span className="bds-ellipsis" title={typeof it.label === "string" ? it.label : undefined}>{it.label}</span>}
            {!last && <Icon name="caret-right" size={11} className="bds-crumb__sep" />}
          </li>;
        })}
      </ol>
    </nav>
  );
}
