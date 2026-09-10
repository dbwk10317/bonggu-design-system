import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

/** 숫자 입력 + −/+ 버튼. 값은 mono. min/max에서 버튼 비활성.
 * @param {Parameters<typeof import("./NumberStepper.d.ts").NumberStepper>[0]} props */
export function NumberStepper({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, unit, size = "md", fit = "auto", width = 140, disabled, invalid, onChange, className, style, ...rest }) {
  const f = useFieldContext();
  const [inner, setInner] = React.useState(defaultValue);
  const v = value ?? inner;
  const [draft, setDraft] = React.useState(String(v));
  /* 확정 값이 바뀌면 편집 중 문자열을 맞춘다. 이펙트로 하면 부모가 값을 거부했을 때
     v 가 그대로라 이펙트가 돌지 않고 입력창이 계속 어긋난 값을 보인다. */
  const [prevV, setPrevV] = React.useState(v);
  if (prevV !== v) { setPrevV(v); setDraft(String(v)); }
  const set = (/** @type {number} */ n) => { const c = Math.min(max, Math.max(min, n)); setInner(c); setDraft(String(c)); if (c !== v) onChange?.(c); };
  const commit = () => { const n = draft.trim() === "" ? NaN : Number(draft); set(Number.isFinite(n) ? n : v); };
  const { onBlur, onKeyDown, ...inputProps } = rest;
  const dec = Number.isFinite(step) ? String(step).split(".")[1]?.length ?? 0 : 0;
  return (
    <div className={cx("bds-ctl bds-stepper-ctl", size === "sm" && "bds-ctl--sm", (invalid ?? f?.invalid) && "bds-ctl--err", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      <button type="button" className="bds-stepper-ctl__btn" aria-label="감소" disabled={disabled || v <= min} onClick={() => set(+(v - step).toFixed(dec))}><Icon name="minus" size={12} /></button>
      <input id={f?.id} aria-describedby={f?.describedBy} type="number" inputMode="decimal" className="bds-mono" value={draft} min={Number.isFinite(min) ? min : undefined} max={Number.isFinite(max) ? max : undefined} step={step} disabled={disabled} onChange={(e) => setDraft(e.target.value)} {...inputProps} onBlur={(e) => { commit(); onBlur?.(e); }} onKeyDown={(e) => { onKeyDown?.(e); if (e.key === "Enter" && !e.defaultPrevented) commit(); }} />
      {unit && <span className="bds-ctl__affix">{unit}</span>}
      <button type="button" className="bds-stepper-ctl__btn" aria-label="증가" disabled={disabled || v >= max} onClick={() => set(+(v + step).toFixed(dec))}><Icon name="plus" size={12} /></button>
    </div>
  );
}
