import React, { useId, useState } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 접이식 섹션. items: {id, title, meta?, content}. multiple이면 여러 개 동시 펼침. plain은 테두리 없음(설정 패널 안).
 * @param {Parameters<typeof import("./Accordion.d.ts").Accordion>[0]} props */
export function Accordion({ items = [], defaultOpen = [], multiple = false, plain = false, className, ...rest }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen));
  const uid = useId().replace(/:/g, "");
  const toggle = (/** @type {string} */ id) => setOpen((s) => { const n = new Set(multiple ? s : []); if (s.has(id)) n.delete(id); else n.add(id); return n; });
  return (
    <div className={cx("bds-acc", plain && "bds-acc--plain", className)} {...rest}>
      {items.map((it) => { const on = open.has(it.id); return <div key={it.id} className="bds-acc__item">
        <h3 style={{ margin: 0 }}><button type="button" className="bds-acc__hd" aria-expanded={on} aria-controls={uid + "-" + it.id} id={uid + "-h-" + it.id} onClick={() => toggle(it.id)}>{it.icon && <Icon name={it.icon} size={16} />}<span className="bds-ellipsis" title={typeof it.title === "string" ? it.title : undefined}>{it.title}</span>{it.meta && <span className="bds-acc__meta">{it.meta}</span>}<Icon name="caret-down" size={14} className="bds-acc__chev" /></button></h3>
        {on && <div id={uid + "-" + it.id} role="region" aria-labelledby={uid + "-h-" + it.id} className="bds-acc__body">{it.content}</div>}
      </div>; })}
    </div>
  );
}
