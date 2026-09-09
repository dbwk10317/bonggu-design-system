import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { useFieldContext } from "./Field.jsx";

/** 범위 슬라이더. 네이티브 range를 토큰으로. marks면 눈금 라벨, showValue면 오른쪽에 현재 값(mono). */
export function Slider({ value, defaultValue, min = 0, max = 100, step = 1, marks, showValue = true, valueFormatter = (v) => String(v), unit, size = "md", fit = "flex", width, disabled, onChange, className, style, ...rest }) {
  const f = useFieldContext();
  const [inner, setInner] = React.useState(defaultValue ?? min);
  const v = value ?? inner;
  const pct = ((v - min) / (max - min || 1)) * 100;
  return (
    <div className={cx("bds-slider", size === "sm" && "bds-slider--sm", disabled && "bds-slider--disabled", className)} style={frameStyle({ fit, width, style: { "--pct": `${pct}%`, ...style } })}>
      <div className="bds-slider__row">
        <input id={f?.id} aria-describedby={f?.describedBy} type="range" min={min} max={max} step={step} value={v} disabled={disabled} onChange={(e) => { const n = Number(e.target.value); setInner(n); onChange?.(n, e); }} {...rest} />
        {showValue && <output className="bds-slider__v bds-mono" htmlFor={f?.id}>{valueFormatter(v)}{unit}</output>}
      </div>
      {marks && <div className="bds-slider__marks" aria-hidden="true">{marks.map((m) => { const mv = typeof m === "object" ? m.value : m; return <span key={mv} style={{ left: `${((mv - min) / (max - min || 1)) * 100}%` }}>{typeof m === "object" ? m.label : m}</span>; })}</div>}
    </div>
  );
}
