import React from "react";
import { cx, spaceToken } from "../core/frame.js";

/** Horizontal row (buttons, chips, meta). Wraps by default; without gap it uses the density-scaled --inline-gap.
 * @param {Parameters<typeof import("./Inline.d.ts").Inline>[0]} props */
export function Inline({ gap, align = "center", justify, wrap = true, as: Tag = "div", className, style, children, ...rest }) {
  return <Tag className={cx("bds-inline", !wrap && "bds-inline--nowrap", className)} style={{ gap: spaceToken(gap), alignItems: align, justifyContent: justify, ...style }} {...rest}>{children}</Tag>;
}
