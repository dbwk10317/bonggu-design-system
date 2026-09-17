import React, { useEffect, useId, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_TEXT } from "../core/missing.js";
import { usePlotMetrics, plotLabels } from "./plot-layout.js";

const clockTime = (/** @type {number} */ time) => new Date(time).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
/** @param {import("./StateTimeline.d.ts").StateTimelineProps} props */
export function StateTimeline({ rows = [], from, to, formatTime = clockTime, fit = "flex", width, height = 240, className, style, "aria-label": ariaLabel = "상태 타임라인", ...rest }) {
  const id = useId(), ref = useRef(/** @type {HTMLDivElement | null} */ (null)), stage = useRef(/** @type {HTMLDivElement | null} */ (null));
  const keyboardNavigation = useRef(false);
  const m = usePlotMetrics(ref), [selected, setSelected] = useState(/** @type {string | null} */ (null));
  const valid = rows.flatMap(row => row.intervals.filter(s => Number.isFinite(s.start) && Number.isFinite(s.end) && s.end > s.start));
  const lo = Number.isFinite(from) ? /** @type {number} */ (from) : valid.length ? Math.min(...valid.map(s => s.start)) : 0;
  const hi = Number.isFinite(to) ? /** @type {number} */ (to) : valid.length ? Math.max(...valid.map(s => s.end)) : 1;
  const labelW = Math.max(0, ...rows.map(row => m.measure(row.label, true))) + m.gap * 2;
  const W = Math.max(m.width, labelW + m.micro * 24), plotW = Math.max(0, W - labelW - m.gap);
  const rowH = m.caption * 2 + m.gap, top = m.micro * 2 + m.gap;
  const x = (/** @type {number} */ time) => labelW + (time - lo) / (hi - lo || 1) * plotW;
  const position = { offset: top };
  const layout = rows.map(row => {
    /** @type {number[]} */ const ends = [];
    const intervals = row.intervals.filter(s => Number.isFinite(s.start) && Number.isFinite(s.end) && s.end > s.start && hi > lo && s.end > lo && s.start < hi).sort((a, b) => a.start - b.start).map(s => {
      let lane = ends.findIndex(end => end <= s.start); if (lane < 0) lane = ends.length; ends[lane] = s.end;
      return { ...s, lane, key: `${row.id}/${s.id}`, row: row.label, y: position.offset + lane * rowH };
    });
    const y = position.offset; position.offset += Math.max(1, ends.length) * rowH + m.gap;
    return { row, y, intervals };
  });
  const intervals = layout.flatMap(row => row.intervals), current = intervals.find(s => s.key === selected);
  const ticks = plotLabels([lo, (lo + hi) / 2, hi].map((t, index) => ({ index, x: x(t), text: formatTime(t) })), W, m);
  useEffect(() => {
    const el = stage.current; if (!el || !selected || !keyboardNavigation.current) return;
    const target = [...el.querySelectorAll('[data-interval]')].find(node => node.getAttribute("data-interval") === selected);
    if (!target) return; const a = target.getBoundingClientRect(), b = el.getBoundingClientRect();
    if (a.left < b.left) el.scrollLeft += a.left - b.left; else if (a.right > b.right) el.scrollLeft += a.width > b.width ? a.left - b.left : a.right - b.right;
    if (a.top < b.top) el.scrollTop += a.top - b.top; else if (a.bottom > b.bottom) el.scrollTop += a.bottom - b.bottom;
  }, [selected, m.width]);
  return <div ref={ref} role="group" aria-label={ariaLabel} className={cx("bds-state-timeline", className)} style={frameStyle({ fit, width, style })} {...rest}>
    <div ref={stage} role="application" tabIndex={0} aria-label={`${ariaLabel} 탐색`} aria-describedby={`${id}-table ${id}-now`} className="bds-state-timeline__stage" style={{ height }} onKeyDown={e => {
      const i = intervals.findIndex(s => s.key === selected); let next;
      if (["ArrowRight", "ArrowDown"].includes(e.key)) next = Math.min(intervals.length - 1, i + 1);
      else if (["ArrowLeft", "ArrowUp"].includes(e.key)) next = Math.max(0, i - 1);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = intervals.length - 1;
      else if (e.key === "Escape") { e.preventDefault(); setSelected(null); return; }
      else return;
      e.preventDefault(); keyboardNavigation.current = true; setSelected(intervals[next]?.key ?? null);
    }}>
      {intervals.length ? <svg className="bds-state-timeline__svg" width={W} height={position.offset} viewBox={`0 0 ${W} ${position.offset}`} aria-hidden="true">
        {ticks.map(tick => <text key={tick.index} className="bds-chart__tick" x={tick.x} y={m.micro * 1.4}>{tick.text}</text>)}
        {layout.map(({ row, y, intervals: spans }) => <g key={row.id}>
          <text className="bds-chart__label" x={0} y={y + rowH / 2} dominantBaseline="central">{row.label}</text>
          {!spans.length && <text className="bds-chart__label" x={labelW} y={y + rowH / 2} dominantBaseline="central">{MISSING_TEXT}</text>}
          {spans.map(span => { const left = x(Math.max(lo, span.start)), size = Math.max(0, x(Math.min(hi, span.end)) - left), text = span.status === "off" ? MISSING_TEXT : span.label; return <g key={span.id} data-interval={span.key} className={cx("bds-state-timeline__interval", selected === span.key && "bds-state-timeline__interval--selected")} onMouseEnter={() => { keyboardNavigation.current = false; setSelected(span.key); }} onTouchStart={() => { keyboardNavigation.current = false; setSelected(span.key); }} style={{ "--interval-bg": span.status === "off" ? "var(--meter-track)" : `var(--${span.status}-tint)`, "--interval-ink": span.status === "off" ? "var(--ink-3)" : `var(--${span.status}-ink)` }}>
            <rect x={left} y={span.y + m.gap / 2} width={size} height={Math.max(0, rowH - m.gap)} rx={m.gap / 2} />
            {m.measure(text, true) + m.gap * 2 <= size && <text className="bds-chart__label" x={left + m.gap} y={span.y + rowH / 2} dominantBaseline="central">{text}</text>}
          </g>; })}
        </g>)}
      </svg> : <p>{MISSING_TEXT}</p>}
    </div>
    <p id={`${id}-now`} role="status" className="bds-state-timeline__readout">{current ? `${current.row} · ${current.status === "off" ? MISSING_TEXT : current.label} · ${formatTime(current.start)} ~ ${formatTime(current.end)}` : "구간을 선택하면 상태와 시간을 표시합니다."}</p>
    <div className="bds-sr"><table id={`${id}-table`}><thead><tr><th scope="col">대상</th><th scope="col">상태</th><th scope="col">시작</th><th scope="col">종료</th></tr></thead><tbody>{intervals.map(s => <tr key={s.key}><th scope="row">{s.row}</th><td>{s.status === "off" ? MISSING_TEXT : s.label}</td><td>{formatTime(s.start)}</td><td>{formatTime(s.end)}</td></tr>)}</tbody></table></div>
  </div>;
}
