import React from "react";
import { cx } from "../core/frame.js";

/** Status pill. tone: ok/warn/crit/info/off/accent. children text is required because color alone never conveys state; pulse only for live updates.
 * @param {Parameters<typeof import("./StatusPill.d.ts").StatusPill>[0]} props */
export function StatusPill({ tone = "off", size = "md", pulse = false, dot = true, outline = false, className, children, ...rest }) {
  return (
    <span className={cx("bds-pill", `bds-tone--${tone}`, size !== "md" && `bds-pill--${size}`, pulse && "bds-pill--pulse", outline && "bds-pill--outline", className)} {...rest}>
      {dot && <i className="bds-pill__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
