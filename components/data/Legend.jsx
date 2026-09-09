import React from "react";
import { cx } from "../core/frame.js";

const toneVar = (t) => typeof t === "number" ? "var(--series-" + t + ")" : /^(rx|tx|used|reserved|free)$/.test(t) ? "var(--series-" + t + ")" : /^(ok|warn|crit|info|signal)$/.test(t) ? "var(--" + t + ")" : t;
/** 독립 범례. items: {label, tone(series 번호·의미 키·CSS 색), value?, hidden?}. onToggle을 주면 클릭으로 시리즈 숨김. */
export function Legend({ items = [], shape = "square", vertical = false, onToggle, className, ...rest }) {
  const Tag = onToggle ? "button" : "span";
  return (
    <ul className={cx("bds-legend", vertical && "bds-legend--vertical", className)} {...rest}>
      {items.map((it, i) => <li key={i}><Tag type={onToggle ? "button" : undefined} className={cx("bds-legend__i", it.hidden && "bds-legend__i--off")} aria-pressed={onToggle ? !it.hidden : undefined} onClick={onToggle ? () => onToggle(i, it) : undefined}><i className={cx("bds-legend__sw", shape !== "square" && "bds-legend__sw--" + shape)} style={{ background: toneVar(it.tone ?? i + 1) }} aria-hidden="true" />{it.label}{it.value != null && <span className="bds-legend__v">{it.value}</span>}</Tag></li>)}
    </ul>
  );
}
