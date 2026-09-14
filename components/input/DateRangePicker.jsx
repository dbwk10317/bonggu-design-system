import React, { forwardRef } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

const PRESETS = [{ value: "1h", label: "1시간" }, { value: "6h", label: "6시간" }, { value: "12h", label: "12시간" }, { value: "24h", label: "24시간" }, { value: "7d", label: "7일" }];
const fmtLocal = (/** @type {Date | null | undefined} */ d) => d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
/** Range picker: quick presets (last N) + custom from/to. value {preset?:string, from?:Date, to?:Date}. For chart periods. */
export const DateRangePicker = forwardRef(
  /**
   * @param {import("./DateRangePicker.d.ts").DateRangePickerProps} props
   * @param {import("react").ForwardedRef<HTMLDivElement>} ref
   */
  function DateRangePicker({ value = { preset: "12h" }, onChange, presets = PRESETS, allowCustom = true, size = "md", fit = "auto", width, disabled, className, style, "aria-label": ariaLabel = "기간" }, ref) {
  const f = useFieldContext();
  const custom = !value.preset;
  const set = (/** @type {import("./DateRangePicker.d.ts").DateRange} */ next) => onChange?.(next);
  /* One tab stop, arrows move (see RULE.md "접근성"). Focus lives on the radio, so the handler does too. */
  const onRadioKey = (/** @type {import("react").KeyboardEvent<HTMLButtonElement>} */ e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const group = e.currentTarget.closest("[role=radiogroup]");
    if (!group) return;
    const items = [.../** @type {NodeListOf<HTMLElement>} */ (group.querySelectorAll("[role=radio]:not([disabled])"))];
    const next = items[(items.indexOf(e.currentTarget) + dir + items.length) % items.length];
    next?.focus(); next?.click();
  };
  return (
    <div ref={ref} className={cx("bds-range", disabled && "bds-ctl--disabled", className)} role="group" aria-label={ariaLabel} style={frameStyle({ fit, width, style })}>
      <div className={cx("bds-seg", size === "sm" && "bds-seg--sm")} role="radiogroup" aria-label="최근">
        {presets.map((p) => <button key={p.value} type="button" role="radio" aria-checked={value.preset === p.value} className="bds-seg__opt" onKeyDown={onRadioKey} disabled={disabled} onClick={() => set({ preset: p.value })}>{p.label}</button>)}
        {allowCustom && <button type="button" role="radio" aria-checked={custom} className="bds-seg__opt" onKeyDown={onRadioKey} disabled={disabled} onClick={() => set({ from: value.from ?? new Date(Date.now() - 864e5), to: value.to ?? new Date() })}><Icon name="calendar-blank" size={13} /> 직접</button>}
      </div>
      {custom && (
        <div className="bds-range__custom">
          <div className={cx("bds-ctl", size === "sm" && "bds-ctl--sm")}><input id={f?.id} type="datetime-local" className="bds-mono" aria-label="시작" value={fmtLocal(value.from)} disabled={disabled} onChange={(e) => set({ from: e.target.value ? new Date(e.target.value) : undefined, to: value.to })} /></div>
          <span className="bds-range__sep" aria-hidden="true">~</span>
          <div className={cx("bds-ctl", size === "sm" && "bds-ctl--sm")}><input type="datetime-local" className="bds-mono" aria-label="끝" value={fmtLocal(value.to)} disabled={disabled} onChange={(e) => set({ from: value.from, to: e.target.value ? new Date(e.target.value) : undefined })} /></div>
        </div>
      )}
    </div>
  );
});
