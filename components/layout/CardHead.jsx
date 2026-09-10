import React from "react";
import { cx } from "../core/frame.js";

/** 카드 제목 줄: 제목(왼쪽) + 메타(오른쪽, 모델명·인터페이스 같은 고정 정보).
 * @param {Parameters<typeof import("./CardHead.d.ts").CardHead>[0]} props */
export function CardHead({ title, meta, metaMono = false, className, children, ...rest }) {
  return (
    <div className={cx("bds-cardhead", className)} {...rest}>
      <h3 className="bds-cardhead__t">{title}</h3>
      {children}
      {meta != null && <span className={cx("bds-cardhead__m bds-ellipsis", metaMono && "bds-mono")}>{meta}</span>}
    </div>
  );
}
