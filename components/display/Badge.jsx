import React from "react";
import { cx } from "../core/frame.js";

/** 숫자 카운트 배지. children으로 감싸면 오른쪽 위에 붙는다. max 초과는 "99+". dot은 숫자 없는 점. */
export function Badge({ count, max = 99, tone = "neutral", dot = false, children, className, "aria-label": ariaLabel, ...rest }) {
  if (!dot && (count == null || count === 0) && children) return children;
  const label = dot ? null : count > max ? max + "+" : count;
  const b = <span className={cx("bds-badge", tone !== "neutral" && "bds-badge--" + tone, dot && "bds-badge--dot", className)} aria-label={ariaLabel ?? (dot ? "새 항목" : count + "개")} {...rest}>{label}</span>;
  return children ? <span className="bds-badge-anchor">{children}{b}</span> : b;
}
