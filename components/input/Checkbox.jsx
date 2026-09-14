import React, { forwardRef } from "react";
import { assignRef, cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** Checkbox. children is the label; without one, pass aria-label (e.g. a table selection column). indeterminate has no HTML attribute, so it is applied through the ref callback. */
export const Checkbox = forwardRef(
  /**
   * @param {import("./Checkbox.d.ts").CheckboxProps} props
   * @param {import("react").ForwardedRef<HTMLInputElement>} ref
   */
  function Checkbox({ children, radio = false, disabled, className, indeterminate, ...rest }, ref) {
  return (
    <label className={cx("bds-check", radio && "bds-check--radio", disabled && "bds-check--disabled", className)}>
      <input type={radio ? "radio" : "checkbox"} disabled={disabled} ref={(el) => { if (el && indeterminate !== undefined) el.indeterminate = indeterminate; assignRef(ref, el); }} {...rest} />
      <span className="bds-check__box" aria-hidden="true"><Icon name={radio ? "circle" : indeterminate ? "minus" : "check"} /></span>
      {children != null && <span>{children}</span>}
    </label>
  );
});
