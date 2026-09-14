import React from "react";
import { cx } from "../core/frame.js";

/** Stack of page-body sections spaced by --grid-gap (fluid with the viewport). Always the direct child of the shell body.
 * @param {Parameters<typeof import("./PageStack.d.ts").PageStack>[0]} props */
export function PageStack({ gap = "md", className, children, ...rest }) {
  return <section className={cx("bds-stack", gap !== "md" && `bds-stack--${gap}`, className)} {...rest}>{children}</section>;
}
