import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 시간순 이벤트 목록(운영 변화, lease 상태 전이). items: {time, title, detail?, tone?, icon?}. 최신이 위. */
export function Timeline({ items = [], dense = false, fit = "flex", width, "aria-label": ariaLabel, className, style }) {
  return (
    <ol className={cx("bds-timeline", dense && "bds-timeline--dense", className)} aria-label={ariaLabel} style={frameStyle({ fit, width, style })}>
      {items.map((it, i) => (
        <li key={it.id ?? i} className={cx("bds-tl", `bds-tone--${it.tone ?? "off"}`)}>
          <span className="bds-tl__time bds-mono">{it.time}</span>
          <span className="bds-tl__dot" aria-hidden="true">{it.icon && <Icon name={it.icon} size={10} />}</span>
          <span className="bds-tl__body"><span className="bds-tl__t">{it.title}</span>{it.detail && <span className="bds-tl__d">{it.detail}</span>}</span>
        </li>
      ))}
    </ol>
  );
}
