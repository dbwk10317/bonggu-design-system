import React from "react";
import { cx } from "../core/frame.js";

/** 비율 상자. 이미지·프리뷰(LCD 4:3)·iframe. ratio는 "16/9" 같은 문자열 또는 숫자.
 * @param {Parameters<typeof import("./AspectRatio.d.ts").AspectRatio>[0]} props */
export function AspectRatio({ ratio = "16/9", className, style, children, ...rest }) {
  return <div className={cx("bds-ratio", className)} style={{ "--ratio": typeof ratio === "number" ? String(ratio) : ratio.replace(":", "/"), ...style }} {...rest}>{children}</div>;
}
