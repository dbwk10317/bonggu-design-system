import React from "react";
import { cx } from "../core/frame.js";

/** 페이지 본문 섹션 묶음. 섹션 간격은 --stack(뷰포트에 따라 흐른다). 셸 본문의 직계 자식은 항상 이것. */
export function PageStack({ gap = "md", className, children, ...rest }) {
  return <section className={cx("bds-stack", gap !== "md" && `bds-stack--${gap}`, className)} {...rest}>{children}</section>;
}
