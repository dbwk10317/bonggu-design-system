import React, { useId } from "react";
import { cx } from "../core/frame.js";

/** 미니 추세선. 부모 크기를 채운다(fit은 부모가 정한다). null 구간은 끊는다. 축·범례 없음. */
export function Sparkline({ values = [], tone = 1, area = true, className, ...rest }) {
  const uid = useId().replace(/:/g, "");
  const W = 100, H = 32, P = 2;
  const nums = values.filter((v) => v != null);
  if (nums.length < 2) return <svg className={cx("bds-spark", className)} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" />;
  const lo = Math.min(...nums), hi = Math.max(...nums), span = hi - lo || 1;
  const x = (i) => P + (i * (W - 2 * P)) / (values.length - 1);
  const y = (v) => P + (1 - (v - lo) / span) * (H - 2 * P);
  const runs = []; let run = [];
  values.forEach((v, i) => { if (v == null) { if (run.length) runs.push(run); run = []; } else run.push([x(i), y(v)]); });
  if (run.length) runs.push(run);
  const color = typeof tone === "string" ? `var(--series-${tone})` : `var(--series-${tone})`;
  return (
    <svg className={cx("bds-spark", className)} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" {...rest}>
      <defs><linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".3" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {runs.map((pts, i) => {
        const d = pts.map(([px, py], j) => `${j ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
        return <g key={i}>
          {area && pts.length > 1 && <path d={`${d} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H}Z`} fill={`url(#${uid}-g)`} />}
          <path d={d} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </g>;
      })}
    </svg>
  );
}
