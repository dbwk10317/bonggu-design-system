import React, { useEffect, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";
import { Icon } from "../action/Icon.jsx";
import { Sparkline } from "./Sparkline.jsx";
import { StatusPill } from "../display/StatusPill.jsx";

/* animate=true일 때만 카운트업. 기본은 꺼짐: 실시간 수치는 트랜지션 없이 즉시 바뀐다. 꺼지면 target을 그대로 돌려주는 no-op. */
/** @param {number} target @param {boolean} enabled */
function useCountUp(target, enabled) {
  const [v, setV] = useState(enabled ? 0 : target);
  const from = useRef(0);
  useEffect(() => {
    if (!enabled || typeof target !== "number") return;
    const start = performance.now(), f = from.current, dur = 900;
    /** @type {number | undefined} */
    let raf;
    const step = (/** @type {number} */ t) => { const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3); setV(f + (target - f) * e); if (p < 1) raf = requestAnimationFrame(step); else from.current = target; };
    raf = requestAnimationFrame(step);
    return () => { if (raf != null) cancelAnimationFrame(raf); };
  }, [target, enabled]);
  return enabled ? v : target;
}

/** 큰 수치 하나. value가 숫자면 mono(ko-KR 천 단위), 문자열이면 그대로, 결측이면 "수집 안 됨"(mono·단위 없음).
 *  기본은 즉시 갱신, animate={true}일 때만 진입 카운트업. delta는 증감, spark는 최근 추세. */
/** detail: 수치 아래 보조 줄(모델 이름·마지막 heartbeat 등). pill: {tone,text} 상태 pill(라벨 옆). icon: 라벨 앞 Phosphor 아이콘.
 * @param {Parameters<typeof import("./StatTile.d.ts").StatTile>[0]} props */
export function StatTile({ label, value, unit, digits = 0, delta, deltaLabel, spark, detail, pill, icon, tone = 1, flat = false, animate = false, fit = "flex", width, className, style, ...rest }) {
  const na = isMissing(value);
  const numeric = !na && typeof value === "number";
  const shown = useCountUp(numeric ? value : 0, animate && numeric);
  const text = na ? MISSING_TEXT : numeric ? shown.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits }) : value;
  const dir = typeof delta === "number" ? (delta > 0 ? "up" : delta < 0 ? "down" : null) : null;
  return (
    <div className={cx("bds-stat", flat && "bds-stat--flat", className)} style={frameStyle({ fit, width, style })} {...rest}>
      <span className="bds-stat__l">{icon && <Icon name={icon} size={13} />}<span>{label}</span>{pill && <StatusPill size="sm" tone={pill.tone}>{pill.text}</StatusPill>}</span>
      <span className={cx("bds-stat__v", !numeric && "bds-stat__v--text", na && MISSING_CLASS)}>{text}{!na && unit && <small>{unit}</small>}</span>
      {delta != null && (
        <span className={cx("bds-stat__d", dir && `bds-stat__d--${dir}`)}>
          {dir && <Icon name={dir === "up" ? "arrow-up-right" : "arrow-down-right"} size={12} />}
          {typeof delta === "number" ? `${delta > 0 ? "+" : ""}${delta.toLocaleString("ko-KR")}` : delta}{deltaLabel && <span className="bds-stat__dl">{deltaLabel}</span>}
        </span>
      )}
      {detail && <div className="bds-stat__detail">{detail}</div>}
      {spark && <div className="bds-stat__spark"><Sparkline values={spark} tone={tone} /></div>}
    </div>
  );
}
