import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** @type {Record<string, string>} */
const TONE = { ok: "정상", warn: "주의", crit: "위험", info: "정보" };
/** Chronological event list (ops changes, lease transitions). items: {time, title, detail?, tone?, icon?}. Newest first. tone sets the dot color plus screen-reader text.
 * @param {Parameters<typeof import("./Timeline.d.ts").Timeline>[0]} props */
export function Timeline({ items = [], dense = false, fit = "flex", width, "aria-label": ariaLabel, className, style }) {
  return (
    <ol className={cx("bds-timeline", dense && "bds-timeline--dense", className)} aria-label={ariaLabel} style={frameStyle({ fit, width, style })}>
      {items.map((it, i) => (
        <li key={it.id ?? i} className={cx("bds-tl", `bds-tone--${it.tone ?? "off"}`)}>
          <span className="bds-tl__time bds-mono">{it.time}</span>
          <span className="bds-tl__dot" aria-hidden="true">{it.icon && <Icon name={it.icon} size={10} />}</span>
          <span className="bds-tl__body"><span className="bds-tl__t">{it.tone && TONE[it.tone] && <span className="bds-sr">{TONE[it.tone]}, </span>}{it.title}</span>{it.detail && <span className="bds-tl__d">{it.detail}</span>}</span>
        </li>
      ))}
    </ol>
  );
}
