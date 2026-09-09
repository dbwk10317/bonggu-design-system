import React from "react";
import { cx } from "../core/frame.js";

/** 반응형 카드 격자. cols는 '이상적' 열 수이고 minmax(auto-fit)로 폭에 따라 저절로 줄어든다. min으로 카드 최소 폭을 직접 줄 수도 있다.
 *  columns={12}를 주면 고정 열 격자가 되고 자식 GridItem의 span으로 2/3+1/3 같은 비대칭 배치를 만든다(컨테이너 폭 기준 접힘). */
export function Grid({ cols = 3, min, columns, className, style, children, ...rest }) {
  if (columns) return <div className={cx("bds-grid", "bds-grid--fixed", className)} style={{ "--cols": columns, ...style }} {...rest}>{children}</div>;
  return <div className={cx("bds-grid", !min && `bds-grid--${cols}`, className)} style={min ? { gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${typeof min === "number" ? `${min}px` : min}),1fr))`, ...style } : style} {...rest}>{children}</div>;
}

/** Grid columns 모드의 칸. span(≥900) · spanMd(<900) · spanSm(<640), 480 미만은 항상 전폭. */
export function GridItem({ span = 12, spanMd, spanSm, className, style, children, ...rest }) {
  return <div className={cx("bds-col", className)} style={{ "--span": span, "--span-md": spanMd, "--span-sm": spanSm, ...style }} {...rest}>{children}</div>;
}
