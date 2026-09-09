import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { useFieldContext } from "./Field.jsx";

/** 여러 줄 입력. rows로 초기 높이, 세로로만 리사이즈. */
export function TextArea({ rows = 3, fit = "flex", width, mono = false, invalid, disabled, className, style, ...rest }) {
  const f = useFieldContext();
  return (
    <div className={cx("bds-ctl bds-ctl--area", (invalid ?? f?.invalid) && "bds-ctl--err", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      <textarea id={f?.id} rows={rows} aria-describedby={f?.describedBy} aria-invalid={(invalid ?? f?.invalid) || undefined} disabled={disabled} className={mono ? "bds-mono" : undefined} {...rest} />
    </div>
  );
}
