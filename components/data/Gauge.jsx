import React, { useRef } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_TEXT, numeric } from "../core/missing.js";

import { usePlotMetrics } from "./plot-layout.js";
import { plotValue } from "./plot-value.jsx";
const PlotValue = plotValue;

/** Half-circle gauge. value 0–1 (or relative to max); tone follows thresholds (ok/warn/crit).
 * @param {Parameters<typeof import("./Gauge.d.ts").Gauge>[0]} props
 */
export function Gauge({ value, max = 1, label, unit, valueFormatter, thresholds = { warn: 0.7, crit: 0.9 }, tone, ticks = false, fit = "flex", width, height, className, style, ...rest }) {
  const frame = frameStyle({ fit, width, height, style });
  const n = numeric(value);
  const r = n == null ? null : Math.max(0, Math.min(1, n / max));
  const t = tone ?? (r == null ? "off" : r >= thresholds.crit ? "crit" : r >= thresholds.warn ? "warn" : "ok");
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const metrics = usePlotMetrics(ref), W = metrics.width, H = metrics.height;
  const sw = Math.min(W, H * 2) / 12, R = Math.max(0, Math.min((W - sw) / 2, H - sw));
  const cx0 = W / 2, cy = R + sw / 2;
  const len = Math.PI * R;
  const d = "M " + (cx0 - R) + " " + cy + " A " + R + " " + R + " 0 0 1 " + (cx0 + R) + " " + cy;
  const txt = r == null || n == null ? MISSING_TEXT : valueFormatter ? valueFormatter(n) : Math.round(r * 100) + "%";
  return (
    <div className={cx("bds-gauge", "bds-gauge--" + t, frame.height != null && "bds-gauge--bounded", className)} style={frame} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={r == null ? undefined : (n ?? undefined)} aria-valuetext={txt + (label ? " " + label : "")} {...rest}>
      <div ref={ref} className="bds-gauge__plot">
      <svg viewBox={"0 0 " + W + " " + H} aria-hidden="true">
        <path d={d} fill="none" className="bds-gauge__track" strokeWidth={sw} strokeLinecap="round" />
        {r != null && <path d={d} fill="none" className="bds-gauge__arc" strokeWidth={sw} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - r)} />}
      </svg>
      </div>
      <PlotValue value={txt} unit={r == null ? undefined : unit} caption={label} metrics={metrics} box={{ left: cx0 - R * 0.65, top: cy - R * 0.65, width: R * 1.3, height: R * 0.6 }} />
      {ticks && <div className="bds-gauge__ticks"><span>0</span><span>{valueFormatter ? valueFormatter(max) : "100%"}</span></div>}
    </div>
  );
}
