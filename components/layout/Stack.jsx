import React from "react";
import { cx } from "../core/frame.js";

const GAP = { 0: 0, 1: "var(--sp-1)", 2: "var(--sp-2)", 3: "var(--sp-3)", 4: "var(--sp-4)", 5: "var(--sp-5)", 6: "var(--sp-6)", 7: "var(--sp-7)", 8: "var(--sp-8)", 9: "var(--sp-9)", 10: "var(--sp-10)" };
export const spaceToken = (g) => (typeof g === "number" && GAP[g] !== undefined ? GAP[g] : g);

/** 세로 스택. gap은 --sp 단계 번호(1~10) 또는 CSS 길이. align/justify는 flex 값. as로 태그 변경. */
export function Stack({ gap = 4, align, justify, as: Tag = "div", className, style, children, ...rest }) {
  return <Tag className={cx("bds-vstack", className)} style={{ gap: spaceToken(gap), alignItems: align, justifyContent: justify, ...style }} {...rest}>{children}</Tag>;
}
