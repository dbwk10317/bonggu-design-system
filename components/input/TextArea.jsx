import React, { forwardRef } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { useFieldContext } from "./Field.jsx";

/** Multi-line input. rows sets the initial height; resizes vertically only. */
export const TextArea = forwardRef(
  /**
   * @param {import("./TextArea.d.ts").TextAreaProps} props
   * @param {import("react").ForwardedRef<HTMLTextAreaElement>} ref
   */
  function TextArea({ rows = 3, fit = "flex", width, mono = false, invalid, disabled, className, style, ...rest }, ref) {
  const f = useFieldContext();
  return (
    <div className={cx("bds-ctl bds-ctl--area", (invalid ?? f?.invalid) && "bds-ctl--err", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      <textarea ref={ref} id={f?.id} rows={rows} aria-describedby={f?.describedBy} aria-invalid={(invalid ?? f?.invalid) || undefined} disabled={disabled} className={mono ? "bds-mono" : undefined} {...rest} />
    </div>
  );
});
