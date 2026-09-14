import React, { useEffect, useRef } from "react";
import { cx, frameStyle } from "../core/frame.js";

/** Log viewer. lines: string | {level,time,text}. follow=true keeps the view scrolled to the bottom as lines arrive.
 * @param {Parameters<typeof import("./LogViewer.d.ts").LogViewer>[0]} props */
export function LogViewer({ lines = [], follow = true, wrap = true, numbers = true, fit = "flex", width, height = 240, className, style, ...rest }) {
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  /* With a ring buffer (lines.slice(-200)) the length never changes, so depending on length alone
     would stop following exactly when the log gets busy. Depend on the array itself. */
  useEffect(() => { if (follow && ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines, follow]);
  return (
    <div ref={ref} tabIndex={0} className={cx("bds-log", !wrap && "bds-log--nowrap", className)} style={frameStyle({ fit, width, height, style })} role="log" aria-live={follow ? "polite" : "off"} {...rest}>
      {lines.map((l, i) => {
        const o = typeof l === "string" ? { text: l } : l;
        return (
          <div key={i} className="bds-log__line">
            <span className="bds-log__ln" aria-hidden="true">{numbers ? i + 1 : ""}</span>
            <span className={cx("bds-log__lv", o.level && `bds-log__lv--${o.level}`)}>{o.time ?? (o.level ? o.level.toUpperCase() : "")}</span>
            <span className="bds-log__msg">{o.level && o.time ? <span className={`bds-log__lv bds-log__lv--${o.level}`}>{o.level.toUpperCase()} </span> : null}{o.text}</span>
          </div>
        );
      })}
    </div>
  );
}
