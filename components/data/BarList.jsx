import React from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";

/** 이름·값·막대 목록(디스크별 사용량, GPU 예약). max 생략 시 항목 최대값. thresholds로 warn/crit 색 전환.
 *  결측 값(null·undefined·NaN)은 막대 0 + "수집 안 됨" 문구로 그린다.
 * @param {Parameters<typeof import("./BarList.d.ts").BarList>[0]} props
 */
export function BarList({ items = [], max, valueFormatter = (v) => v.toLocaleString("ko-KR"), thresholds, tone = 1, thick = false, fit = "flex", width, className, style, "aria-label": ariaLabel, ...rest }) {
  const nums = items.map((it) => it.value).filter((v) => !isMissing(v));
  const top = (max ?? (nums.length ? Math.max(...nums) : 1)) || 1;
  const barColor = (/** @type {number | null} */ v, /** @type {import("./BarList.d.ts").BarListItem} */ it) => {
    if (it.tone) return `var(--series-${it.tone})`;
    if (thresholds && !isMissing(v)) { if (v >= thresholds.crit) return "var(--crit)"; if (v >= thresholds.warn) return "var(--warn)"; }
    return `var(--series-${tone})`;
  };
  return (
    <div className={cx("bds-barlist", thick && "bds-barlist--thick", className)} style={frameStyle({ fit, width, style })} role="list" aria-label={ariaLabel} {...rest}>
      {items.map((it, i) => {
        const na = isMissing(it.value);
        const pct = na ? 0 : Math.min(100, Math.max(0, (it.value / top) * 100));
        return (
          <div key={it.key ?? i} className="bds-barlist__row" role="listitem">
            <span className="bds-barlist__n bds-ellipsis">{it.name}</span>
            <span className={cx("bds-barlist__v", na && MISSING_CLASS)}>{na ? MISSING_TEXT : valueFormatter(it.value)}</span>
            <div className="bds-barlist__track" aria-hidden="true"><div className="bds-barlist__fill" style={{ width: `${pct}%`, "--bar": barColor(it.value, it), animationDelay: `${i * 60}ms` }} /></div>
          </div>
        );
      })}
    </div>
  );
}
