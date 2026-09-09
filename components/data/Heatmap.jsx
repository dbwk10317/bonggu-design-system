import React, { useId, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";

/** 시간×요일 같은 2차원 강도 격자. 색은 --ramp-1~6 순차 램프만 쓴다(상태색 금지). 값 null은 빈 칸(수집 안 됨).
 *  격자는 tabIndex=0: 화살표로 셀 이동, Home/End 행 양끝, Esc 해제. 마우스 hover와 같은 아래 줄 텍스트가 뜬다. 숨김 표(bds-sr)가 aria-describedby로 연결된다. */
export function Heatmap({ rows = [], cols = [], values = [], valueFormatter = (v) => String(v), rowLabel, colLabel, cell = 14, gap = 2, fit = "flex", width, "aria-label": ariaLabel, className, style }) {
  const [hover, setHover] = useState(null);
  const srId = useId();
  const flat = values.flat().filter((v) => !isMissing(v));
  const lo = flat.length ? Math.min(...flat) : 0, hi = flat.length ? Math.max(...flat) : 1;
  const step = (v) => (isMissing(v) ? 0 : Math.min(6, 1 + Math.floor(((v - lo) / (hi - lo || 1)) * 5.999)));
  const every = Math.max(1, Math.ceil(cols.length / 12));
  const rl = (r) => (rowLabel ? rowLabel(r) : r), cl = (c) => (colLabel ? colLabel(c) : c);
  const fmt = (i, j) => (isMissing(values[i]?.[j]) ? MISSING_TEXT : valueFormatter(values[i][j]));
  const onKey = (e) => {
    if (!rows.length || !cols.length) return;
    const [i, j] = hover ?? [0, -1];
    let next;
    if (e.key === "ArrowRight") next = [i, Math.min(cols.length - 1, j + 1)];
    else if (e.key === "ArrowLeft") next = [i, Math.max(0, j - 1)];
    else if (e.key === "ArrowDown") next = [Math.min(rows.length - 1, hover ? i + 1 : 0), Math.max(0, j)];
    else if (e.key === "ArrowUp") next = [Math.max(0, i - 1), Math.max(0, j)];
    else if (e.key === "Home") next = [i, 0];
    else if (e.key === "End") next = [i, cols.length - 1];
    else if (e.key === "Escape") next = null;
    else return;
    e.preventDefault(); setHover(next);
  };
  return (
    <div role="img" aria-label={ariaLabel} aria-describedby={srId} className={cx("bds-heat", className)} style={frameStyle({ fit, width, style: { "--cell": `${cell}px`, "--gap": `${gap}px`, "--cols": cols.length, ...style } })}>
      <div className="bds-heat__grid" tabIndex={0} onKeyDown={onKey} onBlur={() => setHover(null)}>
        <span />
        {cols.map((c, j) => <span key={j} className="bds-heat__col">{j % every === 0 ? cl(c) : ""}</span>)}
        {rows.map((r, i) => <React.Fragment key={i}>
          <span className="bds-heat__row">{rl(r)}</span>
          {cols.map((_, j) => { const v = values[i]?.[j]; return <i key={j} className={cx("bds-heat__cell", isMissing(v) && "bds-heat__cell--na", hover && hover[0] === i && hover[1] === j && "bds-heat__cell--on")} data-step={step(v)} onMouseEnter={() => setHover([i, j])} onMouseLeave={() => setHover(null)} />; })}
        </React.Fragment>)}
      </div>
      <table id={srId} className="bds-sr">
        <thead><tr><th scope="col" />{cols.map((c, j) => <th key={j} scope="col">{cl(c)}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}><th scope="row">{rl(r)}</th>{cols.map((_, j) => <td key={j}>{fmt(i, j)}</td>)}</tr>)}</tbody>
      </table>
      <div className="bds-heat__foot">
        <span className="bds-heat__tip" role="status">{hover && hover[1] >= 0 ? <><b>{rl(rows[hover[0]])} · {cl(cols[hover[1]])}</b> <span className={isMissing(values[hover[0]]?.[hover[1]]) ? MISSING_CLASS : "bds-mono"}>{fmt(hover[0], hover[1])}</span></> : "\u00a0"}</span>
        <span className="bds-heat__scale" aria-hidden="true"><small className="bds-mono">{valueFormatter(lo)}</small>{[1, 2, 3, 4, 5, 6].map((s) => <i key={s} data-step={s} />)}<small className="bds-mono">{valueFormatter(hi)}</small></span>
      </div>
    </div>
  );
}
