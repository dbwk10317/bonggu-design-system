import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_TEXT, isMissing } from "../core/missing.js";

/** 반원 게이지. value 0~1(또는 max 기준). 임계 70/90으로 톤 자동(ok·warn·crit). 결측이면 "수집 안 됨".
 *  결측 문구의 표기는 SVG text라 색이 fill이다. 공통 .bds-na 대신 tone off 규칙(.bds-gauge--off .bds-gauge__v)이 담당한다.
 * @param {Parameters<typeof import("./Gauge.d.ts").Gauge>[0]} props
 */
export function Gauge({ value, max = 1, label, unit, valueFormatter, thresholds = { warn: 0.7, crit: 0.9 }, tone, ticks = false, fit = "flex", width, height, className, style, ...rest }) {
  const r = isMissing(value) ? null : Math.max(0, Math.min(1, value / max));
  const t = tone ?? (r == null ? "off" : r >= thresholds.crit ? "crit" : r >= thresholds.warn ? "warn" : "ok");
  const W = 120, H = 70, R = 50, cx0 = 60, cy = 62, sw = 10;
  const len = Math.PI * R;
  const d = "M " + (cx0 - R) + " " + cy + " A " + R + " " + R + " 0 0 1 " + (cx0 + R) + " " + cy;
  const txt = r == null ? MISSING_TEXT : valueFormatter ? valueFormatter(value) : Math.round(r * 100) + "%";
  return (
    <div className={cx("bds-gauge", "bds-gauge--" + t, className)} style={frameStyle({ fit, width, height, style })} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={r == null ? undefined : value} aria-valuetext={txt + (label ? " " + label : "")} {...rest}>
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
