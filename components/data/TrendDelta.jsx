import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 증감 표시. value는 변화량(숫자) 또는 비율(percent). inverse면 증가가 나쁜 지표(응답시간·오류). 항상 화살표+숫자, 색 단독 금지. */
export function TrendDelta({ value, percent = false, inverse = false, label, precision = 1, className, ...rest }) {
  if (value == null) return <span className={cx("bds-delta", "bds-delta--flat", className)} {...rest}>수집 안 됨</span>;
  const dir = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const txt = (value > 0 ? "+" : "") + (percent ? (value * 100).toFixed(precision) + "%" : Number(value).toLocaleString("ko-KR", { maximumFractionDigits: precision }));
  return <span className={cx("bds-delta", "bds-delta--" + dir, inverse && "bds-delta--inverse", className)} aria-label={(dir === "up" ? "증가 " : dir === "down" ? "감소 " : "변화 없음 ") + txt} {...rest}>{dir !== "flat" && <Icon name={dir === "up" ? "arrow-up-right" : "arrow-down-right"} size={12} />}{txt}{label && <small>{label}</small>}</span>;
}
