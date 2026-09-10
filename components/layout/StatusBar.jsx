import React from "react";
import { cx } from "../core/frame.js";

/** 셸 하단 상태바.
 * @param {Parameters<typeof import("./StatusBar.d.ts").StatusBar>[0]} props */
export function StatusBar({ live, items = [], right = [], className, ...rest }) {
  return (
    <div className={cx("bds-statusbar", className)} {...rest}>
      {live && <span className="bds-statusbar__live"><i className="bds-statusbar__dot" aria-hidden="true" />{live.label}</span>}
      {items.map((it, i) => <span key={i} className="bds-ellipsis">{it}</span>)}
      {right.length > 0 && <span className="bds-statusbar__right">{right.map((it, i) => <span key={i}>{it}</span>)}</span>}
    </div>
  );
}
