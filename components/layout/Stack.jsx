import React from "react";
import { cx, spaceToken } from "../core/frame.js";


/** 세로 스택. gap은 --sp 단계 번호(1~10) 또는 CSS 길이. align/justify는 flex 값. as로 태그 변경.
 * @param {Parameters<typeof import("./Stack.d.ts").Stack>[0]} props */
export function Stack({ gap = 4, align, justify, as: Tag = "div", className, style, children, ...rest }) {
  return <Tag className={cx("bds-vstack", className)} style={{ gap: spaceToken(gap), alignItems: align, justifyContent: justify, ...style }} {...rest}>{children}</Tag>;
}
