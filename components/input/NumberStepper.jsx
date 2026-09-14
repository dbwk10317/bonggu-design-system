import React, { forwardRef } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

/** Number input with −/+ buttons. Value in mono; buttons disable at min/max. */
export const NumberStepper = forwardRef(
  /**
   * @param {import("./NumberStepper.d.ts").NumberStepperProps} props
   * @param {import("react").ForwardedRef<HTMLInputElement>} ref
   */
  function NumberStepper({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, unit, size = "md", fit = "auto", width = 140, disabled, invalid, onChange, className, style, ...rest }, ref) {
  const f = useFieldContext();
  const [inner, setInner] = React.useState(defaultValue);
  const v = value ?? inner;
  const [draft, setDraft] = React.useState(String(v));
  /* Sync the draft string when the committed value changes. An effect would not fire when the parent
     rejects the value (v unchanged), leaving the input showing a stale draft. */
  const [prevV, setPrevV] = React.useState(v);
  if (prevV !== v) { setPrevV(v); setDraft(String(v)); }
  const set = (/** @type {number} */ n) => { const c = Math.min(max, Math.max(min, n)); setInner(c); setDraft(String(c)); if (c !== v) onChange?.(c); };
  const commit = () => { const n = draft.trim() === "" ? NaN : Number(draft); set(Number.isFinite(n) ? n : v); };
  const { onBlur, onKeyDown, ...inputProps } = rest;
  const dec = Number.isFinite(step) ? String(step).split(".")[1]?.length ?? 0 : 0;
  return (
    <div className={cx("bds-ctl bds-stepper-ctl", size === "sm" && "bds-ctl--sm", (invalid ?? f?.invalid) && "bds-ctl--err", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      <button type="button" className="bds-stepper-ctl__btn" aria-label="감소" disabled={disabled || v <= min} onClick={() => set(+(v - step).toFixed(dec))}><Icon name="minus" size={12} /></button>
      <input ref={ref} id={f?.id} aria-describedby={f?.describedBy} type="number" inputMode="decimal" className="bds-mono" value={draft} min={Number.isFinite(min) ? min : undefined} max={Number.isFinite(max) ? max : undefined} step={step} disabled={disabled} onChange={(e) => setDraft(e.target.value)} {...inputProps} onBlur={(e) => { commit(); onBlur?.(e); }} onKeyDown={(e) => { onKeyDown?.(e); if (e.key === "Enter" && !e.defaultPrevented) commit(); }} />
      {unit && <span className="bds-ctl__affix">{unit}</span>}
      <button type="button" className="bds-stepper-ctl__btn" aria-label="증가" disabled={disabled || v >= max} onClick={() => set(+(v + step).toFixed(dec))}><Icon name="plus" size={12} /></button>
    </div>
  );
});
