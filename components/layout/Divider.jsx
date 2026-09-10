import React from "react";
import { cx } from "../core/frame.js";

/** 구분선. label을 주면 가운데 글자, vertical은 Inline 안에서 세로선.
 * @param {Parameters<typeof import("./Divider.d.ts").Divider>[0]} props */
export function Divider({ vertical = false, label, className, ...rest }) {
  if (label) return <div role="separator" className={cx("bds-divider", "bds-divider--label", className)} {...rest}>{label}</div>;
  return <hr className={cx("bds-divider", vertical && "bds-divider--vertical", className)} aria-orientation={vertical ? "vertical" : undefined} {...rest} />;
}
