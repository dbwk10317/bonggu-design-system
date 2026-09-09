import React, { forwardRef } from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 체크박스. children이 라벨. 라벨 없이 쓰면 aria-label 필수(표 선택 열). indeterminate는 ref로 세팅. */
export const Checkbox = forwardRef(function Checkbox({ children, radio = false, disabled, className, indeterminate, ...rest }, ref) {
  return (
    <label className={cx("bds-check", radio && "bds-check--radio", disabled && "bds-check--disabled", className)}>
      <input type={radio ? "radio" : "checkbox"} disabled={disabled} ref={(el) => { if (el && indeterminate !== undefined) el.indeterminate = indeterminate; if (typeof ref === "function") ref(el); else if (ref) ref.current = el; }} {...rest} />
      <span className="bds-check__box" aria-hidden="true"><Icon name={radio ? "circle" : indeterminate ? "minus" : "check"} /></span>
      {children != null && <span>{children}</span>}
    </label>
  );
});
