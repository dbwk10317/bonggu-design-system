import React from "react";
import { cx } from "../core/frame.js";
import { toneVar } from "./chart-math.js";

/* 스와치 색: color가 있으면 그대로, tone이 시리즈 번호·의미 키·미터 톤이면 토큰, info/signal은 상태 토큰, 그 외 문자열은 CSS 색으로 본다. */
const swatchColor = (it, i) => it.color ?? (typeof it.tone === "string" && !/^(rx|tx|used|reserved|free|ok|warn|crit)$/.test(it.tone) ? (/^(info|signal)$/.test(it.tone) ? `var(--${it.tone})` : it.tone) : toneVar(it.tone, i));

/** 독립 범례. items: {label, color?(CSS 색), tone?(series 번호·의미 키), value?, dash?(선 패턴), shape?, hidden?}.
 *  shape="line"이면 선 스와치(dash 패턴 반영), square/dot은 네모·점. onToggle을 주면 클릭으로 시리즈 숨김. compact는 Chart 내장 범례용 작은 글자. */
export function Legend({ items = [], shape = "square", vertical = false, compact = false, onToggle, className, ...rest }) {
  const Tag = onToggle ? "button" : "span";
  return (
    <ul className={cx("bds-legend", vertical && "bds-legend--vertical", compact && "bds-legend--compact", className)} {...rest}>
      {items.map((it, i) => {
        const sh = it.shape ?? shape, color = swatchColor(it, i);
        const sw = sh === "line"
          ? <svg className="bds-legend__sw-line" width="14" height="8" viewBox="0 0 14 8" aria-hidden="true"><line x1="0" y1="4" x2="14" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray={it.dash || undefined} /></svg>
          : <i className={cx("bds-legend__sw", sh === "dot" && "bds-legend__sw--dot")} style={{ background: color }} aria-hidden="true" />;
        return <li key={i}><Tag type={onToggle ? "button" : undefined} className={cx("bds-legend__i", it.hidden && "bds-legend__i--off")} aria-pressed={onToggle ? !it.hidden : undefined} onClick={onToggle ? () => onToggle(i, it) : undefined}>{sw}{it.label}{it.value != null && <span className="bds-legend__v">{it.value}</span>}</Tag></li>;
      })}
    </ul>
  );
}
