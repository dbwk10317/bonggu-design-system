import React from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 반원 게이지. value 0~1(또는 max 기준). 임계 70/90으로 톤 자동(ok·warn·crit). null이면 "수집 안 됨". */
export function Gauge({ value, max = 1, label, unit, valueFormatter, thresholds = { warn: 0.7, crit: 0.9 }, tone, ticks = false, fit = "flex", width, height, className, style, ...rest }) {
  const r = value == null ? null : Math.max(0, Math.min(1, value / max));
  const t = tone ?? (r == null ? "off" : r >= thresholds.crit ? "crit" : r >= thresholds.warn ? "warn" : "ok");
  const W = 120, H = 70, R = 50, cx0 = 60, cy = 62, sw = 10;
  const len = Math.PI * R;
  const d = "M " + (cx0 - R) + " " + cy + " A " + R + " " + R + " 0 0 1 " + (cx0 + R) + " " + cy;
  const txt = r == null ? "수집 안 됨" : valueFormatter ? valueFormatter(value) : Math.round(r * 100) + "%";
  return (
    <div className={cx("bds-gauge", "bds-gauge--" + t, className)} style={frameStyle({ fit, width, height, style })} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value ?? undefined} aria-valuetext={txt + (label ? " " + label : "")} {...rest}>
      <svg viewBox={"0 0 " + W + " " + H} aria-hidden="true">
        <path d={d} fill="none" className="bds-gauge__track" strokeWidth={sw} strokeLinecap="round" />
        {r != null && <path d={d} fill="none" className="bds-gauge__arc" strokeWidth={sw} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - r)} />}
        <text x={cx0} y={cy - 6} textAnchor="middle" className="bds-gauge__v" fontSize={r == null ? 11 : 20}>{txt}{r != null && unit && <tspan className="bds-gauge__u" fontSize={10}> {unit}</tspan>}</text>
      </svg>
      {ticks && <div className="bds-gauge__ticks"><span>0</span><span>{valueFormatter ? valueFormatter(max) : "100%"}</span></div>}
      {label && <div className="bds-gauge__l">{label}</div>}
    </div>
  );
}
