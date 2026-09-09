import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

/** 숫자 입력 + −/+ 버튼. 값은 mono. min/max에서 버튼 비활성. */
export function NumberStepper({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, unit, size = "md", fit = "auto", width = 140, disabled, invalid, onChange, className, style, ...rest }) {
  const f = useFieldContext();
  const [inner, setInner] = React.useState(defaultValue);
  const v = value ?? inner;
  const set = (n) => { const c = Math.min(max, Math.max(min, n)); setInner(c); onChange?.(c); };
  const dec = Number.isFinite(step) ? String(step).split(".")[1]?.length ?? 0 : 0;
  return (
    <div className={cx("bds-ctl bds-stepper-ctl", size === "sm" && "bds-ctl--sm", (invalid ?? f?.invalid) && "bds-ctl--err", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      <button type="button" className="bds-stepper-ctl__btn" aria-label="감소" disabled={disabled || v <= min} onClick={() => set(+(v - step).toFixed(dec))}><Icon name="minus" size={12} /></button>
      <input id={f?.id} aria-describedby={f?.describedBy} type="number" inputMode="decimal" className="bds-mono" value={v} min={Number.isFinite(min) ? min : undefined} max={Number.isFinite(max) ? max : undefined} step={step} disabled={disabled} onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n)) set(n); }} {...rest} />
      {unit && <span className="bds-ctl__affix">{unit}</span>}
      <button type="button" className="bds-stepper-ctl__btn" aria-label="증가" disabled={disabled || v >= max} onClick={() => set(+(v + step).toFixed(dec))}><Icon name="plus" size={12} /></button>
    </div>
  );
}
