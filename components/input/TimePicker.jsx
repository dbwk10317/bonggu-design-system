import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";
import { useFieldContext } from "./Field.jsx";

const pad = (/** @type {number} */ n) => String(n).padStart(2, "0");
/** 시:분 선택(24시간). value "HH:MM". step은 분 단위(기본 5).
 * @param {Parameters<typeof import("./TimePicker.d.ts").TimePicker>[0]} props */
export function TimePicker({ value = "", onChange, step = 5, size = "md", fit = "auto", width, disabled, className, style }) {
  const f = useFieldContext();
  const [h, m] = value ? value.split(":").map(Number) : [null, null];
  const set = (/** @type {number} */ hh, /** @type {number} */ mm) => onChange?.(pad(hh ?? 0) + ":" + pad(mm ?? 0));
  const mins = Array.from({ length: Math.floor(60 / step) }, (_, i) => i * step);
  return (
    <div className={cx("bds-ctl", "bds-time", size === "sm" && "bds-ctl--sm", f?.invalid && "bds-ctl--err", disabled && "bds-ctl--disabled", className)} style={frameStyle({ fit, width, style })}>
      <span className="bds-ctl__affix"><Icon name="clock" size={15} /></span>
      <select id={f?.id} aria-label="시" value={h ?? ""} disabled={disabled} onChange={(e) => set(Number(e.target.value), m)}><option value="" disabled>--</option>{Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{pad(i)}</option>)}</select>
      <span className="bds-time__sep">:</span>
      <select aria-label="분" value={m ?? ""} disabled={disabled} onChange={(e) => set(h, Number(e.target.value))}><option value="" disabled>--</option>{mins.map((v) => <option key={v} value={v}>{pad(v)}</option>)}</select>
    </div>
  );
}
