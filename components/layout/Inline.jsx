import React from "react";
import { cx } from "../core/frame.js";
import { spaceToken } from "./Stack.jsx";

/** 가로 나열(버튼·칩·메타). 기본 wrap. gap은 --sp 단계 또는 CSS 길이. */
export function Inline({ gap = 2, align = "center", justify, wrap = true, as: Tag = "div", className, style, children, ...rest }) {
  return <Tag className={cx("bds-inline", !wrap && "bds-inline--nowrap", className)} style={{ gap: spaceToken(gap), alignItems: align, justifyContent: justify, ...style }} {...rest}>{children}</Tag>;
}
