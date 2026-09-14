import React from "react";
import { cx } from "../core/frame.js";

/** Responsive card grid. cols is the ideal column count; auto-fit minmax shrinks it with the width, or min sets the card minimum directly.
 *  columns={12} switches to a fixed grid where GridItem spans build asymmetric layouts like 2/3 + 1/3 (collapsing by container width).
 * @param {Parameters<typeof import("./Grid.d.ts").Grid>[0]} props
 */
export function Grid({ cols = 3, min, columns, className, style, children, ...rest }) {
  if (columns) return <div className={cx("bds-grid", "bds-grid--fixed", className)} style={{ "--cols": columns, ...style }} {...rest}>{children}</div>;
  return <div className={cx("bds-grid", !min && `bds-grid--${cols}`, className)} style={min ? { gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${typeof min === "number" ? `${min}px` : min}),1fr))`, ...style } : style} {...rest}>{children}</div>;
}

/** Cell for Grid columns mode: span (≥900) · spanMd (<900) · spanSm (<640); below 480 always full width.
 * @param {Parameters<typeof import("./Grid.d.ts").GridItem>[0]} props */
export function GridItem({ span = 12, spanMd, spanSm, className, style, children, ...rest }) {
  return <div className={cx("bds-col", className)} style={{ "--span": span, "--span-md": spanMd, "--span-sm": spanSm, ...style }} {...rest}>{children}</div>;
}
