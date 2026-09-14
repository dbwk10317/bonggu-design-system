import React from "react";
import { cx } from "../core/frame.js";

/** Count badge. Wrapping children anchors it to their top right. Above max renders "99+"; dot shows no number.
 * @param {Parameters<typeof import("./Badge.d.ts").Badge>[0]} props */
export function Badge({ count, max = 99, tone = "neutral", dot = false, children, className, "aria-label": ariaLabel, ...rest }) {
  if (!dot && (count == null || count === 0) && children) return children;
  const label = dot ? null : (count ?? 0) > max ? max + "+" : count;
  const b = <span className={cx("bds-badge", tone !== "neutral" && "bds-badge--" + tone, dot && "bds-badge--dot", className)} aria-label={ariaLabel ?? (dot ? "새 항목" : count + "건")} {...rest}>{label}</span>;
  return children ? <span className="bds-badge-anchor">{children}{b}</span> : b;
}
