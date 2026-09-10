import React from "react";
import { cx } from "../core/frame.js";

/** 켬/끔 스위치. 즉시 반영되는 설정에만 쓴다(저장 버튼이 따로 있으면 Checkbox).
 * @param {Parameters<typeof import("./Switch.d.ts").Switch>[0]} props */
export function Switch({ children, disabled, className, ...rest }) {
  return (
    <label className={cx("bds-switch", disabled && "bds-switch--disabled", className)}>
      <input type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="bds-switch__track" aria-hidden="true" />
      {children != null && <span>{children}</span>}
    </label>
  );
}
