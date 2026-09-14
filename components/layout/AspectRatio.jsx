import React from "react";
import { cx } from "../core/frame.js";

/** Aspect-ratio box for images, previews (LCD 4:3) and iframes. ratio is a string like "16/9" or a number.
 * @param {Parameters<typeof import("./AspectRatio.d.ts").AspectRatio>[0]} props */
export function AspectRatio({ ratio = "16/9", className, style, children, ...rest }) {
  return <div className={cx("bds-ratio", className)} style={{ "--ratio": typeof ratio === "number" ? String(ratio) : ratio.replace(":", "/"), ...style }} {...rest}>{children}</div>;
}
