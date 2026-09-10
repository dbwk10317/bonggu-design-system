import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** @type {Record<string, string>} */
const SR = { done: "완료", error: "오류" };
/** 단계 표시(등록 9단계, 학습 stage). steps: {label, detail?, status?: done|current|error|todo}. current 인덱스를 주면 status를 자동 채운다. done·error는 스크린리더용 텍스트를 함께 읽는다.
 * @param {Parameters<typeof import("./Stepper.d.ts").Stepper>[0]} props */
export function Stepper({ steps = [], current, orientation = "horizontal", size = "md", fit = "flex", width, "aria-label": ariaLabel, className, style }) {
  const st = (/** @type {import("./Stepper.d.ts").StepItem} */ s, /** @type {number} */ i) => s.status ?? (current == null ? "todo" : i < current ? "done" : i === current ? "current" : "todo");
  return (
    <ol className={cx("bds-stepper", `bds-stepper--${orientation}`, size === "sm" && "bds-stepper--sm", className)} aria-label={ariaLabel} style={frameStyle({ fit, width, style })}>
      {steps.map((s, i) => { const k = st(s, i); return (
        <li key={i} className={cx("bds-step", `bds-step--${k}`)} aria-current={k === "current" ? "step" : undefined}>
          <span className="bds-step__dot" aria-hidden="true">{k === "done" ? <Icon name="check" size={11} /> : k === "error" ? <Icon name="x" size={11} /> : <span className="bds-mono">{i + 1}</span>}</span>
          <span className="bds-step__txt"><span className="bds-step__l">{s.label}{SR[k] && <span className="bds-sr">, {SR[k]}</span>}</span>{s.detail && <span className="bds-step__d">{s.detail}</span>}</span>
          {i < steps.length - 1 && <span className="bds-step__line" aria-hidden="true" />}
        </li>
      ); })}
    </ol>
  );
}
