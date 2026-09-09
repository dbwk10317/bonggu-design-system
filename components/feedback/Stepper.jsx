import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 단계 표시(등록 9단계, 학습 stage). steps: {label, detail?, status?: done|current|error|todo}. current 인덱스를 주면 status를 자동 채운다. */
export function Stepper({ steps = [], current, orientation = "horizontal", size = "md", fit = "flex", width, "aria-label": ariaLabel, className, style }) {
  const st = (s, i) => s.status ?? (current == null ? "todo" : i < current ? "done" : i === current ? "current" : "todo");
  return (
    <ol className={cx("bds-stepper", `bds-stepper--${orientation}`, size === "sm" && "bds-stepper--sm", className)} aria-label={ariaLabel} style={frameStyle({ fit, width, style })}>
      {steps.map((s, i) => { const k = st(s, i); return (
        <li key={i} className={cx("bds-step", `bds-step--${k}`)} aria-current={k === "current" ? "step" : undefined}>
          <span className="bds-step__dot" aria-hidden="true">{k === "done" ? <Icon name="check" size={11} /> : k === "error" ? <Icon name="x" size={11} /> : <span className="bds-mono">{i + 1}</span>}</span>
          <span className="bds-step__txt"><span className="bds-step__l">{s.label}</span>{s.detail && <span className="bds-step__d">{s.detail}</span>}</span>
          {i < steps.length - 1 && <span className="bds-step__line" aria-hidden="true" />}
        </li>
      ); })}
    </ol>
  );
}
