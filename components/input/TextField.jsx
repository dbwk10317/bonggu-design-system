import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

/** 한 줄 텍스트 입력. Field 안에서 라벨을 받는다. prefix/suffix에 단위·아이콘. */
export function TextField({ size = "md", fit = "flex", width, prefix, suffix, icon, mono = false, invalid, disabled, className, style, ...rest }) {
  const f = useFieldContext();
  return (
    <div className={cx("bds-ctl", size === "sm" && "bds-ctl--sm", (invalid ?? f?.invalid) && "bds-ctl--err", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      {icon && <span className="bds-ctl__affix"><Icon name={icon} size={15} /></span>}
      {prefix && <span className="bds-ctl__affix">{prefix}</span>}
      <input id={f?.id} aria-describedby={f?.describedBy} aria-invalid={(invalid ?? f?.invalid) || undefined} required={f?.required} disabled={disabled} className={mono ? "bds-mono" : undefined} {...rest} />
      {suffix && <span className="bds-ctl__affix">{suffix}</span>}
    </div>
  );
}
