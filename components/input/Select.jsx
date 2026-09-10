import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

/** 네이티브 select를 토큰으로 감싼 선택 입력. options: {value,label,disabled}[].
 * @param {Parameters<typeof import("./Select.d.ts").Select>[0]} props */
export function Select({ options = [], placeholder, size = "md", fit = "flex", width, invalid, disabled, className, style, ...rest }) {
  const f = useFieldContext();
  return (
    <div className={cx("bds-ctl bds-ctl--select", size === "sm" && "bds-ctl--sm", (invalid ?? f?.invalid) && "bds-ctl--err", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      <select id={f?.id} aria-describedby={f?.describedBy} aria-invalid={(invalid ?? f?.invalid) || undefined} disabled={disabled} {...rest}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
      </select>
      <Icon name="caret-down" size={14} className="bds-ctl__caret" />
    </div>
  );
}
