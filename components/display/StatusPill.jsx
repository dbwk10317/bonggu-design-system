import React from "react";
import { cx } from "../core/frame.js";

/** 상태 pill. tone은 ok/warn/crit/info/off/accent. 색 단독 금지: children 텍스트 필수. pulse는 실시간일 때만. */
export function StatusPill({ tone = "off", size = "md", pulse = false, dot = true, outline = false, className, children, ...rest }) {
  return (
    <span className={cx("bds-pill", `bds-tone--${tone}`, size !== "md" && `bds-pill--${size}`, pulse && "bds-pill--pulse", outline && "bds-pill--outline", className)} {...rest}>
      {dot && <i className="bds-pill__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
