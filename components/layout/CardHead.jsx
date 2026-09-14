import React from "react";
import { cx } from "../core/frame.js";

/** Card title row: title on the left, fixed meta (model name, interface) on the right.
 * @param {Parameters<typeof import("./CardHead.d.ts").CardHead>[0]} props */
export function CardHead({ title, meta, metaMono = false, className, children, ...rest }) {
  return (
    <div className={cx("bds-cardhead", className)} {...rest}>
      <h3 className="bds-cardhead__t">{title}</h3>
      {children}
      {meta != null && <span className={cx("bds-cardhead__m bds-ellipsis", metaMono && "bds-mono")}>{meta}</span>}
    </div>
  );
}
