import React, { forwardRef } from "react";
import { cx } from "../core/frame.js";

/** On/off switch for settings that apply immediately (use Checkbox when there is a separate save button). */
export const Switch = forwardRef(
  /**
   * @param {import("./Switch.d.ts").SwitchProps} props
   * @param {import("react").ForwardedRef<HTMLInputElement>} ref
   */
  function Switch({ children, disabled, className, ...rest }, ref) {
  return (
    <label className={cx("bds-switch", disabled && "bds-switch--disabled", className)}>
      <input ref={ref} type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="bds-switch__track" aria-hidden="true" />
      {children != null && <span>{children}</span>}
    </label>
  );
});
