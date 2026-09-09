import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

const PRESETS = [{ value: "1h", label: "1시간" }, { value: "6h", label: "6시간" }, { value: "12h", label: "12시간" }, { value: "24h", label: "24시간" }, { value: "7d", label: "7일" }];
const fmtLocal = (d) => d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
/** 기간 선택: 빠른 프리셋(최근 N) + 직접 시작/끝. value {preset?:string, from?:Date, to?:Date}. 차트 기간용. */
export function DateRangePicker({ value = { preset: "12h" }, onChange, presets = PRESETS, allowCustom = true, size = "md", fit = "auto", width, disabled, className, style, "aria-label": ariaLabel = "기간" }) {
  const f = useFieldContext();
  const custom = !value.preset;
  const set = (next) => onChange?.(next);
  return (
    <div className={cx("bds-range", size === "sm" && "bds-range--sm", disabled && "bds-ctl--disabled", className)} role="group" aria-label={ariaLabel} style={frameStyle({ fit, width, style })}>
      <div className={cx("bds-seg", size === "sm" && "bds-seg--sm")} role="radiogroup" aria-label="최근">
        {presets.map((p) => <button key={p.value} type="button" role="radio" aria-checked={value.preset === p.value} className="bds-seg__opt" disabled={disabled} onClick={() => set({ preset: p.value })}>{p.label}</button>)}
        {allowCustom && <button type="button" role="radio" aria-checked={custom} className="bds-seg__opt" disabled={disabled} onClick={() => set({ from: value.from ?? new Date(Date.now() - 864e5), to: value.to ?? new Date() })}><Icon name="calendar-blank" size={13} /> 직접</button>}
      </div>
      {custom && (
        <div className="bds-range__custom">
          <div className={cx("bds-ctl", size === "sm" && "bds-ctl--sm")}><input id={f?.id} type="datetime-local" className="bds-mono" aria-label="시작" value={fmtLocal(value.from)} disabled={disabled} onChange={(e) => set({ from: e.target.value ? new Date(e.target.value) : undefined, to: value.to })} /></div>
          <span className="bds-range__sep" aria-hidden="true">–</span>
          <div className={cx("bds-ctl", size === "sm" && "bds-ctl--sm")}><input type="datetime-local" className="bds-mono" aria-label="끝" value={fmtLocal(value.to)} disabled={disabled} onChange={(e) => set({ from: value.from, to: e.target.value ? new Date(e.target.value) : undefined })} /></div>
        </div>
      )}
    </div>
  );
}
