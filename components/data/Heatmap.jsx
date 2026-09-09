import React, { useState } from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 시간×요일 같은 2차원 강도 격자. 색은 --ramp-1~6 순차 램프만 쓴다(상태색 금지). 값 null은 빈 칸(수집 안 됨). */
export function Heatmap({ rows = [], cols = [], values = [], valueFormatter = (v) => String(v), rowLabel, colLabel, cell = 14, gap = 2, fit = "flex", width, "aria-label": ariaLabel, className, style }) {
  const [hover, setHover] = useState(null);
  const flat = values.flat().filter((v) => v != null);
  const lo = flat.length ? Math.min(...flat) : 0, hi = flat.length ? Math.max(...flat) : 1;
  const step = (v) => (v == null ? 0 : Math.min(6, 1 + Math.floor(((v - lo) / (hi - lo || 1)) * 5.999)));
  const every = Math.max(1, Math.ceil(cols.length / 12));
  return (
    <div role="img" aria-label={ariaLabel} className={cx("bds-heat", className)} style={frameStyle({ fit, width, style: { "--cell": `${cell}px`, "--gap": `${gap}px`, "--cols": cols.length, ...style } })}>
      <div className="bds-heat__grid">
        <span />
        {cols.map((c, j) => <span key={j} className="bds-heat__col">{j % every === 0 ? (colLabel ? colLabel(c) : c) : ""}</span>)}
        {rows.map((r, i) => <React.Fragment key={i}>
          <span className="bds-heat__row">{rowLabel ? rowLabel(r) : r}</span>
          {cols.map((_, j) => { const v = values[i]?.[j]; return <i key={j} className={cx("bds-heat__cell", v == null && "bds-heat__cell--na")} data-step={step(v)} onMouseEnter={() => setHover([i, j])} onMouseLeave={() => setHover(null)} />; })}
        </React.Fragment>)}
      </div>
      <div className="bds-heat__foot">
        <span className="bds-heat__tip">{hover ? <><b>{rows[hover[0]]} · {cols[hover[1]]}</b> <span className="bds-mono">{values[hover[0]]?.[hover[1]] == null ? "수집 안 됨" : valueFormatter(values[hover[0]][hover[1]])}</span></> : "\u00a0"}</span>
        <span className="bds-heat__scale" aria-hidden="true"><small className="bds-mono">{valueFormatter(lo)}</small>{[1, 2, 3, 4, 5, 6].map((s) => <i key={s} data-step={s} />)}<small className="bds-mono">{valueFormatter(hi)}</small></span>
      </div>
    </div>
  );
}
