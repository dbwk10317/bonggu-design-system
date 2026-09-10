import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

const PRESETS = [{ value: "1h", label: "1시간" }, { value: "6h", label: "6시간" }, { value: "12h", label: "12시간" }, { value: "24h", label: "24시간" }, { value: "7d", label: "7일" }];
const fmtLocal = (/** @type {Date | null | undefined} */ d) => d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
/** 기간 선택: 빠른 프리셋(최근 N) + 직접 시작/끝. value {preset?:string, from?:Date, to?:Date}. 차트 기간용.
 * @param {Parameters<typeof import("./DateRangePicker.d.ts").DateRangePicker>[0]} props */
export function DateRangePicker({ value = { preset: "12h" }, onChange, presets = PRESETS, allowCustom = true, size = "md", fit = "auto", width, disabled, className, style, "aria-label": ariaLabel = "기간" }) {
  const f = useFieldContext();
  const custom = !value.preset;
  const set = (/** @type {import("./DateRangePicker.d.ts").DateRange} */ next) => onChange?.(next);
  /* 라디오그룹은 탭 스톱 하나에 화살표 이동이다(readme 접근성 절). 포커스가 라디오에 있으므로 핸들러도 거기 둔다. */
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
    <div className={cx("bds-range", disabled && "bds-ctl--disabled", className)} role="group" aria-label={ariaLabel} style={frameStyle({ fit, width, style })}>
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
}
