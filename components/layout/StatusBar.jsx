import React from "react";
import { cx } from "../core/frame.js";

/** 하단 상태바(28px, mono). live는 실제로 실시간 갱신 중일 때만. 항상 참인 값(호스트·업타임·시계)만 둔다. */
export function StatusBar({ live, items = [], right = [], className, ...rest }) {
  return (
    <div className={cx("bds-statusbar", className)} {...rest}>
      {live && <span className="bds-statusbar__live"><i className="bds-statusbar__dot" aria-hidden="true" />{live.label}</span>}
      {items.map((it, i) => <span key={i} className="bds-ellipsis">{it}</span>)}
      {right.length > 0 && <span className="bds-statusbar__right">{right.map((it, i) => <span key={i}>{it}</span>)}</span>}
    </div>
  );
}
