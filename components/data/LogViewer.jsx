import React, { useEffect, useRef } from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 로그 뷰어. lines: string | {level,time,text}. follow=true면 새 줄에 따라 바닥으로 스크롤.
 * @param {Parameters<typeof import("./LogViewer.d.ts").LogViewer>[0]} props */
export function LogViewer({ lines = [], follow = true, wrap = true, numbers = true, fit = "flex", width, height = 240, className, style, ...rest }) {
  const ref = useRef(null);
  useEffect(() => { if (follow && ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines.length, follow]);
  return (
    <div ref={ref} className={cx("bds-log", !wrap && "bds-log--nowrap", className)} style={frameStyle({ fit, width, height, style })} role="log" aria-live={follow ? "polite" : "off"} {...rest}>
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
