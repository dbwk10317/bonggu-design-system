import React from "react";
import { cx, spaceToken } from "../core/frame.js";

/** Flex filler; with size, a fixed gap (inside a vertical stack).
 * @param {Parameters<typeof import("./Spacer.d.ts").Spacer>[0]} props */
export function Spacer({ size, className, style, ...rest }) {
  return <div className={cx("bds-spacer", className)} aria-hidden="true" style={size != null ? { flex: "none", height: spaceToken(size), width: spaceToken(size), ...style } : style} {...rest} />;
}
