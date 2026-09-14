import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing, numeric } from "../core/missing.js";

/** Name / value / bar list (per-disk usage, GPU reservations). max defaults to the largest item; thresholds switch bars to warn/crit color.
 *  Missing values draw a zero bar plus the missing text.
 * @param {Parameters<typeof import("./BarList.d.ts").BarList>[0]} props
 */
export function BarList({ items = [], max, valueFormatter = (v) => v.toLocaleString("ko-KR"), thresholds, tone = 1, thick = false, fit = "flex", width, className, style, "aria-label": ariaLabel, ...rest }) {
  const nums = /** @type {number[]} */ (items.map((it) => numeric(it.value)).filter((v) => v != null));
  const top = (max ?? (nums.length ? Math.max(...nums) : 1)) ?? 1;
  const barColor = (/** @type {number | null} */ v, /** @type {import("./BarList.d.ts").BarListItem} */ it) => {
    if (it.tone) return `var(--series-${it.tone})`;
    const n = numeric(v);
    if (thresholds && n != null) { if (n >= thresholds.crit) return "var(--crit)"; if (n >= thresholds.warn) return "var(--warn)"; }
    return `var(--series-${tone})`;
  };
  return (
    <div className={cx("bds-barlist", thick && "bds-barlist--thick", className)} style={frameStyle({ fit, width, style })} role="list" aria-label={ariaLabel} {...rest}>
      {items.map((it, i) => {
        const na = isMissing(it.value);
        const pct = na ? 0 : Math.min(100, Math.max(0, ((it.value ?? 0) / top) * 100));
        return (
          <div key={it.key ?? i} className="bds-barlist__row" role="listitem">
            <span className="bds-barlist__n bds-ellipsis">{it.name}</span>
            <span className={cx("bds-barlist__v", na && MISSING_CLASS)}>{na ? MISSING_TEXT : valueFormatter(it.value ?? 0)}</span>
            <div className="bds-barlist__track" aria-hidden="true"><div className="bds-barlist__fill" style={{ width: `${pct}%`, "--bar": barColor(it.value, it), animationDelay: `${i * 60}ms` }} /></div>
          </div>
        );
      })}
    </div>
  );
}
