import React, { useEffect, useRef } from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 로그 뷰어. lines: string | {level,time,text}. follow=true면 새 줄에 따라 바닥으로 스크롤.
 * @param {Parameters<typeof import("./LogViewer.d.ts").LogViewer>[0]} props */
export function LogViewer({ lines = [], follow = true, wrap = true, numbers = true, fit = "flex", width, height = 240, className, style, ...rest }) {
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  /* 링버퍼(lines.slice(-200))면 길이가 고정돼 length 만 보면 이펙트가 다시 돌지 않는다.
     로그가 바빠지는 순간 자동 추적이 멈추므로 배열 자체를 본다. */
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
