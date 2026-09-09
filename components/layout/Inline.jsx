import React from "react";
import { cx } from "../core/frame.js";
import { spaceToken } from "./Stack.jsx";

/** 가로 나열(버튼·칩·메타). 기본 wrap. gap을 주지 않으면 --inline-gap(밀도에 따라 8 또는 6)을 쓴다. */
export function Inline({ gap, align = "center", justify, wrap = true, as: Tag = "div", className, style, children, ...rest }) {
  return <Tag className={cx("bds-inline", !wrap && "bds-inline--nowrap", className)} style={{ gap: spaceToken(gap), alignItems: align, justifyContent: justify, ...style }} {...rest}>{children}</Tag>;
}
