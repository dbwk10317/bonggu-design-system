import React from "react";
import { cx } from "../core/frame.js";

/** Divider. label renders centered text; vertical draws a vertical rule inside an Inline.
 * @param {Parameters<typeof import("./Divider.d.ts").Divider>[0]} props */
export function Divider({ vertical = false, label, className, ...rest }) {
  if (label) return <div role="separator" className={cx("bds-divider", "bds-divider--label", className)} {...rest}>{label}</div>;
  return <hr className={cx("bds-divider", vertical && "bds-divider--vertical", className)} aria-orientation={vertical ? "vertical" : undefined} {...rest} />;
}
