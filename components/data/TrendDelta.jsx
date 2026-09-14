import React from "react";
import { cx } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing, numeric } from "../core/missing.js";
import { Icon } from "../action/Icon.jsx";

/** Change indicator. value is an absolute delta or a ratio (percent). inverse marks metrics where up is bad (latency, errors). Always arrow + number, never color alone.
 *  Missing values show the missing text with no arrow and no mono.
 * @param {Parameters<typeof import("./TrendDelta.d.ts").TrendDelta>[0]} props
 */
export function TrendDelta({ value, percent = false, inverse = false, label, precision = 1, className, ...rest }) {
  if (isMissing(value)) return <span className={cx("bds-delta", "bds-delta--flat", MISSING_CLASS, className)} {...rest}>{MISSING_TEXT}</span>;
  const n = numeric(value) ?? 0;
  const dir = n > 0 ? "up" : n < 0 ? "down" : "flat";
  const txt = (n > 0 ? "+" : "") + (percent ? (n * 100).toFixed(precision) + "%" : n.toLocaleString("ko-KR", { maximumFractionDigits: precision }));
  return <span className={cx("bds-delta", "bds-delta--" + dir, inverse && "bds-delta--inverse", className)} aria-label={(dir === "up" ? "증가 " : dir === "down" ? "감소 " : "변화 없음 ") + txt} {...rest}>{dir !== "flat" && <Icon name={dir === "up" ? "arrow-up-right" : "arrow-down-right"} size={12} />}{txt}{label && <small>{label}</small>}</span>;
}
