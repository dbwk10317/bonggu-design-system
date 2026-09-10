import React, { useId } from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 선형 진행 바. value 0~1이면 결정형, null이면 비결정형(흐르는 띠). tone: accent(기본)·ok·warn·crit.
 * @param {Parameters<typeof import("./ProgressBar.d.ts").ProgressBar>[0]} props */
export function ProgressBar({ value, label, detail, tone = "accent", size = "md", showValue = true, valueFormatter = (v) => `${Math.round(v * 100)}%`, fit = "flex", width, "aria-label": ariaLabel, className, style }) {
  const det = typeof value === "number" && Number.isFinite(value);
  const v = det ? Math.min(1, Math.max(0, value)) : 0;
  const lid = useId();
  return (
    <div className={cx("bds-progress", `bds-progress--${size}`, `bds-tone--${tone}`, !det && "bds-progress--indet", className)} style={frameStyle({ fit, width, style })}>
      {(label || (showValue && det)) && <div className="bds-progress__hd">{label && <span id={lid} className="bds-progress__l">{label}</span>}{showValue && det && <span className="bds-progress__v bds-mono">{valueFormatter(v)}</span>}</div>}
      <div className="bds-progress__track" role="progressbar" aria-label={ariaLabel} aria-labelledby={!ariaLabel && label ? lid : undefined} aria-valuemin={0} aria-valuemax={100} aria-valuenow={det ? Math.round(v * 100) : undefined}>
        <div className="bds-progress__fill" style={det ? { width: `${v * 100}%` } : undefined} />
      </div>
      {detail && <div className="bds-progress__d">{detail}</div>}
    </div>
  );
}
