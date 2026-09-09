import React from "react";
import { cx } from "../core/frame.js";

/** 뷰포트 단계별 표시. above="md"는 768 이상에서만, below="md"는 768 미만에서만. 레이아웃 박스를 만들지 않는다(display:contents). */
export function Visible({ above, below, className, children }) {
  return <div className={cx("bds-visible", above && "bds-hide-" + above, below && "bds-only-" + below, className)}>{children}</div>;
}
