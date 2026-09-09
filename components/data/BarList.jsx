import React from "react";
import { cx, frameStyle } from "../core/frame.js";

const NOT = "수집 안 됨";
/** 이름·값·막대 목록(디스크별 사용량, GPU 예약). max 생략 시 항목 최대값. thresholds로 warn/crit 색 전환. */
export function BarList({ items = [], max, valueFormatter = (v) => v.toLocaleString("ko-KR"), thresholds, tone = 1, thick = false, fit = "flex", width, className, style, "aria-label": ariaLabel, ...rest }) {
  const nums = items.map((it) => it.value).filter((v) => v != null);
  const top = (max ?? (nums.length ? Math.max(...nums) : 1)) || 1;
  const barColor = (v, it) => {
    if (it.tone) return `var(--series-${it.tone})`;
    if (thresholds && v != null) { if (v >= thresholds.crit) return "var(--crit)"; if (v >= thresholds.warn) return "var(--warn)"; }
    return `var(--series-${tone})`;
  };
  return (
    <div className={cx("bds-barlist", thick && "bds-barlist--thick", className)} style={frameStyle({ fit, width, style })} role="list" aria-label={ariaLabel} {...rest}>
      {items.map((it, i) => {
        const pct = it.value == null ? 0 : Math.min(100, Math.max(0, (it.value / top) * 100));
        return (
          <div key={it.key ?? i} className="bds-barlist__row" role="listitem">
            <span className="bds-barlist__n bds-ellipsis">{it.name}</span>
            <span className={cx("bds-barlist__v", it.value == null && "bds-barlist__v--na")} style={it.value == null ? { fontFamily: "var(--font-ui)", color: "var(--text-3)" } : undefined}>{it.value == null ? NOT : valueFormatter(it.value)}</span>
            <div className="bds-barlist__track" aria-hidden="true"><div className="bds-barlist__fill" style={{ width: `${pct}%`, "--bar": barColor(it.value, it), animationDelay: `${i * 60}ms` }} /></div>
          </div>
        );
      })}
    </div>
  );
}
