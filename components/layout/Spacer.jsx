import React from "react";
import { cx } from "../core/frame.js";
import { spaceToken } from "./Stack.jsx";

/** flex 빈 공간. size를 주면 고정 간격(세로 스택 안). */
export function Spacer({ size, className, style, ...rest }) {
  return <div className={cx("bds-spacer", className)} aria-hidden="true" style={size != null ? { flex: "none", height: spaceToken(size), width: spaceToken(size), ...style } : style} {...rest} />;
}
