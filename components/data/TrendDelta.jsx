import React from "react";
import { cx } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing, numeric } from "../core/missing.js";
import { Icon } from "../action/Icon.jsx";

/** 증감 표시. value는 변화량(숫자) 또는 비율(percent). inverse면 증가가 나쁜 지표(응답시간·오류). 항상 화살표+숫자, 색 단독 금지.
 *  결측이면 화살표 없이 "수집 안 됨"을 mono 없이 표시한다.
 * @param {Parameters<typeof import("./TrendDelta.d.ts").TrendDelta>[0]} props
 */
export function TrendDelta({ value, percent = false, inverse = false, label, precision = 1, className, ...rest }) {
  if (isMissing(value)) return <span className={cx("bds-delta", "bds-delta--flat", MISSING_CLASS, className)} {...rest}>{MISSING_TEXT}</span>;
  const n = numeric(value) ?? 0;
  const dir = n > 0 ? "up" : n < 0 ? "down" : "flat";
  const txt = (n > 0 ? "+" : "") + (percent ? (n * 100).toFixed(precision) + "%" : n.toLocaleString("ko-KR", { maximumFractionDigits: precision }));
  return <span className={cx("bds-delta", "bds-delta--" + dir, inverse && "bds-delta--inverse", className)} aria-label={(dir === "up" ? "증가 " : dir === "down" ? "감소 " : "변화 없음 ") + txt} {...rest}>{dir !== "flat" && <Icon name={dir === "up" ? "arrow-up-right" : "arrow-down-right"} size={12} />}{txt}{label && <small>{label}</small>}</span>;
}
