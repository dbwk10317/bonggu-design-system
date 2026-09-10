import React from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 스켈레톤. variant: block | text | circle. fit="flex"면 폭을 채우고 height만, fixed면 width·height.
 * @param {Parameters<typeof import("./Skeleton.d.ts").Skeleton>[0]} props */
export function Skeleton({ variant = "block", fit = "flex", width, height = variant === "text" ? "1em" : 120, lines, className, style, ...rest }) {
  if (lines) return <div className={cx("bds-skel-group", className)} aria-hidden="true" {...rest}>{Array.from({ length: lines }, (_, i) => <span key={i} className="bds-skel bds-skel--text" style={{ width: i === lines - 1 ? "60%" : "100%" }} />)}</div>;
  return <span className={cx("bds-skel", variant !== "block" && `bds-skel--${variant}`, className)} style={frameStyle({ fit: variant === "circle" ? "fixed" : fit, width: variant === "circle" ? height : width, height, style })} aria-hidden="true" {...rest} />;
}
