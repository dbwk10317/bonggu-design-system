import React, { useEffect, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";
import { Icon } from "../action/Icon.jsx";
import { Sparkline } from "./Sparkline.jsx";
import { StatusPill } from "../display/StatusPill.jsx";

/* Count-up only when animate=true (default off, see RULE.md "VISUAL FOUNDATIONS"); when off it returns target unchanged. */
/** @param {number} target @param {boolean} enabled */
function useCountUp(target, enabled) {
  const [v, setV] = useState(enabled ? 0 : target);
  const from = useRef(0);
  /* The value currently on screen; if interrupted, the next tween starts here. */
  const shown = useRef(0);
  useEffect(() => {
    if (!enabled || typeof target !== "number") return;
    const start = performance.now(), f = from.current, dur = 900;
    /** @type {number | undefined} */
    let raf;
    const step = (/** @type {number} */ t) => { const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3); shown.current = f + (target - f) * e; setV(shown.current); if (p < 1) raf = requestAnimationFrame(step); else from.current = target; };
    raf = requestAnimationFrame(step);
    /* Resume from the shown value, not 0, so the number never jumps backwards. */
    return () => { if (raf != null) { cancelAnimationFrame(raf); from.current = shown.current; } };
  }, [target, enabled]);
  return enabled ? v : target;
}

/** One big number. Numeric value: mono with ko-KR grouping; string: as is; missing: missing text without mono or unit.
 *  Updates instantly by default; animate={true} counts up once on entry. delta is the change, spark the recent trend. */
/** detail: secondary line under the value (model name, last heartbeat). pill: {tone,text} status pill next to the label. icon: Phosphor icon before the label.
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
