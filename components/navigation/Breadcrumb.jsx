import React, { useState } from "react";
import { Icon } from "../action/Icon.jsx";

/** Path trail. items: {label, href?}; the last is the current page. Beyond maxItems the middle collapses to "…".
 * @param {Parameters<typeof import("./Breadcrumb.d.ts").Breadcrumb>[0]} props */
export function Breadcrumb({ items = [], maxItems = 4, className, ...rest }) {
  const [all, setAll] = useState(false);
  /* Expansion belongs to one path; a new items array collapses again. */
  const [prevItems, setPrevItems] = useState(items);
  if (prevItems !== items) { setPrevItems(items); if (all) setAll(false); }
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
