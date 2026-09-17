import React, { useEffect, useId, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing, numeric } from "../core/missing.js";
import { r1, toneVar, toneInk, fmtKo, niceTicks, stackBars, smoothPath, runsOf, pathLength, seriesDash, histBins } from "./chart-math.js";
import { Legend } from "./Legend.jsx";
import { emptyPlotMetrics, usePlotMetrics, plotLabels, plotLabelIsUI } from "./plot-layout.js";
import { plotValue } from "./plot-value.jsx";
const PlotValue = plotValue;
import { Button } from "../action/Button.jsx";
import { Select } from "../input/Select.jsx";

/** @typedef {import("../core/frame.js").DSStyle} DSStyle */
/** @typedef {import("./Chart.d.ts").ChartTone} ChartTone */
/** @typedef {import("./Chart.d.ts").ChartSeries} ChartSeries */
/** @typedef {import("./Chart.d.ts").ChartThreshold} ChartThreshold */
/** @typedef {(v: number) => string} Fmt */
/** @typedef {[number, number]} Point */
/** Segment with missing values normalized to null. Coercing to 0 would make a failed collection look like "0".
 * @typedef {Omit<import("./Chart.d.ts").ChartSegment, "value"> & { value: number | null }} NormSegment */
/** Internal shape after normalize. The public contract is the ChartProps union in Chart.d.ts;
 * here it is a flat object where only the fields relevant to kind are filled.
 * @typedef {{
 *   kind?: "line" | "area" | "bar" | "pie" | "radial" | "radar" | "histogram",
 *   labels?: string[], series?: ChartSeries[], segments?: NormSegment[],
 *   samples?: (number | null)[], bins?: number, axes?: string[],
 *   value?: number | null, label?: import("react").ReactNode, tone?: ChartTone,
 *   thresholds?: ChartThreshold[], stacked?: boolean, yMin?: number, yMax?: number,
 *   max?: number, unit?: string, percentiles?: number[], caption?: import("react").ReactNode,
 *   xTicks?: "auto" | "ends" | "none", fit?: "flex" | "fixed" | "auto", width?: number | string, height?: number,
 *   xValues?: number[], hoverValue?: number | null, onHoverValueChange?: (value: number | null) => void,
 *   zoomable?: boolean, range?: [number, number] | null, onRangeChange?: (range: [number, number] | null) => void,
 *   events?: import("./Chart.d.ts").ChartEvent[],
 *   valueFormatter?: Fmt, emptyText?: string, showLegend?: boolean,
 *   animate?: boolean, live?: boolean, paused?: boolean, className?: string,
 *   style?: DSStyle, "aria-label"?: string
 * }} NormProps */

/* ---------- Shared chrome ---------- */
/** @param {boolean} enabled */
function useAnimateOnce(enabled) {
  const [on, setOn] = useState(enabled);
  /* Re-arm when enabled turns back on. Without resetting, turning live off later would never
     replay the entry animation. */
  const [prevEnabled, setPrevEnabled] = useState(enabled);
  if (prevEnabled !== enabled) { setPrevEnabled(enabled); setOn(enabled); }
  useEffect(() => { if (!enabled) return; const t = setTimeout(() => setOn(false), 1100); return () => clearTimeout(t); }, [enabled]);
  return on;
}
/** @param {{ x: number, w: number, h: number, title?: import("react").ReactNode, rows: { color: string, name: import("react").ReactNode, value: import("react").ReactNode }[] }} props */
function Tip({ x, w, h, title, rows }) {
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const size = usePlotMetrics(ref);
  const gap = size.gap;
  const left = Math.max(0, Math.min(w - size.width, x + gap + size.width <= w ? x + gap : x - gap - size.width));
  return (
    <div ref={ref} role="region" aria-label="차트 상세" tabIndex={0} className="bds-chart__tip" style={{ left, visibility: size.width ? "visible" : "hidden", maxHeight: Math.max(0, h - gap * 2) }}>
      {title != null && <div className="bds-chart__tip-t">{title}</div>}
      {rows.map((r, i) => <div key={i} className="bds-chart__tip-row"><i style={{ "--series-color": r.color }} /><span className="bds-chart__tip-n bds-ellipsis">{r.name}</span><span className={cx("bds-chart__tip-v", isMissing(r.value) && MISSING_CLASS)}>{r.value}</span></div>)}
    </div>
  );
}
/** @param {Fmt} fmt @param {number | null | undefined} v */
const cell = (fmt, v) => { const n = numeric(v); return n == null ? MISSING_TEXT : fmt(n); };

/* The single boundary before data reaches geometry. Every missing value becomes null here, so the math below
   only checks for null. Without it one NaN would poison the axis range and every coordinate in the chart. */
/** @param {NormProps} props @returns {NormProps} */
function normalize(props) {
  const series = props.series?.map((s) => ({ ...s, values: (s.values ?? []).map(numeric) }));
  const segments = props.segments?.map((sg) => ({ ...sg, value: numeric(sg.value) }));
  const out = { ...props };
  if (series) out.series = series;
  if (segments) out.segments = segments;
  if ("value" in props) out.value = numeric(props.value);
  if (props.samples) out.samples = props.samples.map(numeric);
  if (props.thresholds) out.thresholds = props.thresholds.filter((t) => numeric(t.value) != null);
  if (props.max != null) out.max = numeric(props.max) ?? undefined;
  if (props.yMin != null) out.yMin = numeric(props.yMin) ?? undefined;
  if (props.yMax != null) out.yMax = numeric(props.yMax) ?? undefined;
  return out;
}

/* ---------- Cartesian (line · area · bar) ---------- */
/** hover/setHover live in Chart so mouse and keyboard drive the same index and the same Tip. */
/** @param {{ kind: "line" | "area" | "bar", labels: string[], series: ChartSeries[], fmt: Fmt, uid: string, xTicks?: "auto" | "ends" | "none", w: number, h: number, thresholds?: ChartThreshold[], stacked?: boolean, yMin?: number, yMax?: number, hover: number | null, setHover: (i: number | null) => void, metrics?: import("./plot-layout.js").PlotMetrics, xValues?: number[], events?: import("./Chart.d.ts").ChartEvent[], onZoom?: (range: [number, number]) => void }} props */
function Cartesian({ kind, labels, series, fmt, uid, xTicks, w: width, h: height, thresholds = [], stacked, yMin, yMax, hover, setHover, metrics: m = emptyPlotMetrics, xValues, events = [], onZoom }) {
  const [drag, setDrag] = useState(/** @type {number | null} */ (null));
  const n = labels.length;
  const h = Math.max(height, m.caption * 5 + m.micro * 2);
  const stack = stacked && kind === "bar" ? stackBars(series, n) : null;
  const all = (stack ? [stack.lo, stack.hi] : series.flatMap((s) => s.values)).filter((v) => v != null).concat(thresholds.map((t) => t.value));
  if (!n || !all.length || width < 40) return null;
  const lo0 = Math.min(0, ...all), hi0 = Math.max(...all);
  const { ticks, lo, hi } = niceTicks(yMin ?? lo0, yMax ?? hi0, h < 140 ? 2 : 4);
  const padL = Math.max(...ticks.map((t) => m.measure(fmt(t)))) + m.gap * 2, padR = m.gap * 2, padT = m.caption, padB = xTicks === "none" ? m.micro : m.caption * 2 + m.micro / 2 + m.gap;
  const w = Math.max(width, padL + padR + m.micro * 4);
  const iw = w - padL - padR, ih = h - padT - padB;
  const step = n > 1 ? iw / (n - 1) : 0;
  const bandW = xValues && n > 1 ? Math.min(iw / n, ...xValues.slice(1).map((v, i) => (v - xValues[i]) / ((xValues.at(-1) ?? 1) - xValues[0]) * iw)) : iw / n;
  const coordinate = (/** @type {number} */ value) => n === 1 ? padL + iw / 2 : padL + (kind === "bar" ? bandW / 2 : 0) + ((value - (xValues?.[0] ?? 0)) / ((xValues?.at(-1) ?? 1) - (xValues?.[0] ?? 0) || 1)) * (iw - (kind === "bar" ? bandW : 0));
  const x = (/** @type {number} */ i) => r1(xValues ? coordinate(xValues[i]) : kind === "bar" ? padL + bandW * (i + 0.5) : n > 1 ? padL + i * step : padL + iw / 2);
  const y = (/** @type {number} */ v) => r1(padT + (1 - (v - lo) / (hi - lo || 1)) * ih);
  const xLabels = plotLabels(labels.flatMap((text, index) => xTicks === "none" || (xTicks === "ends" && index !== 0 && index !== n - 1) ? [] : [{ index, x: x(index), text, ui: plotLabelIsUI(text) }]), w, m);
  const annotations = thresholds.map((t) => t.label ?? fmt(t.value));
  const groupW = Math.min(28, bandW * 0.62 / (stacked ? 1 : series.length));
  const indexAt = (/** @type {number} */ px) => {
    let closest = 0;
    for (let i = 1; i < n; i++) if (Math.abs(x(i) - px) < Math.abs(x(closest) - px)) closest = i;
    return closest;
  };
  const onMove = (/** @type {import("react").MouseEvent<SVGSVGElement> | import("react").TouchEvent<SVGSVGElement>} */ e) => { const r = e.currentTarget.getBoundingClientRect(); setHover(indexAt(("clientX" in e ? e.clientX : e.touches[0]?.clientX ?? 0) - r.left)); };
  const rows = hover == null ? [] : series.map((s, si) => ({ color: toneVar(s.tone, si), name: s.label, value: cell(fmt, s.values[hover]) }));
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" onPointerDown={e => { if (!onZoom || e.button !== 0) return; e.preventDefault(); const i = indexAt(e.clientX - e.currentTarget.getBoundingClientRect().left); setDrag(i); setHover(i); e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={e => { if (drag == null || !onZoom || !xValues) return; const end = indexAt(e.clientX - e.currentTarget.getBoundingClientRect().left); if (end !== drag) onZoom([xValues[Math.min(drag, end)], xValues[Math.max(drag, end)]]); setDrag(null); if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }} onPointerCancel={() => setDrag(null)} onMouseMove={onMove} onTouchStart={onMove} onTouchMove={onMove} aria-hidden="true">
        <defs>{series.map((s, si) => <linearGradient key={si} id={`${uid}-g${si}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={toneVar(s.tone, si)} stopOpacity=".14" /><stop offset="1" stopColor={toneVar(s.tone, si)} stopOpacity="0" /></linearGradient>)}
          <clipPath id={`${uid}-c`}><rect x={padL} y={0} width={iw} height={h} /></clipPath></defs>
        {ticks.filter((_, i) => i % Math.max(1, Math.ceil((m.micro * 1.4 + m.gap) / (ih / Math.max(1, ticks.length - 1)))) === 0).map((t) => <g key={t}><line className="bds-chart__grid" x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} style={t === ticks[0] ? { stroke: "var(--plot-axis)" } : undefined} /><text className="bds-chart__tick" x={padL - m.gap} y={y(t)} dominantBaseline="central" textAnchor="end">{fmt(t)}</text></g>)}
        {xLabels.map((lb) => <text key={lb.index} className={lb.ui ? "bds-chart__label" : "bds-chart__tick"} x={lb.x} y={h - m.gap - m.caption / 3} textAnchor="start">{lb.text}</text>)}
        {thresholds.map((t, i) => <g key={i}><line x1={padL} x2={w - padR} y1={y(t.value)} y2={y(t.value)} stroke={`var(--${t.tone ?? "warn"})`} strokeDasharray="4 4" strokeWidth="1" />{m.measure(annotations[i], true) <= iw && y(t.value) >= m.caption * 2 && !thresholds.slice(0, i).some((prev) => Math.abs(y(prev.value) - y(t.value)) < m.caption * 1.5) && <text className="bds-chart__label" style={{ "--tick-ink": `var(--${t.tone ?? "warn"}-ink)` }} x={w - padR} y={y(t.value) - m.gap} textAnchor="end">{annotations[i]}</text>}</g>)}
        {xValues && events.filter(event => event.value >= xValues[0] && event.value <= (xValues.at(-1) ?? 0)).map(event => <line key={event.id} className="bds-chart__event" x1={coordinate(event.value)} x2={coordinate(event.value)} y1={padT} y2={h - padB} />)}
        {drag != null && hover != null && <rect className="bds-chart__selection" x={Math.min(x(drag), x(hover))} y={padT} width={Math.abs(x(drag) - x(hover))} height={Math.max(0, ih)} />}
        <g clipPath={`url(#${uid}-c)`}>
          {series.map((s, si) => {
            const color = toneVar(s.tone, si);
            if (kind === "bar") {
              const off = stacked ? 0 : (si - (series.length - 1) / 2) * groupW;
              return <g key={si}>{s.values.map((v, i) => {
                if (v == null) return null;
                const band = stack?.bands[si][i];
                const y1 = y(band ? band.end : v), y0 = y(band ? band.start : 0);
                return <rect key={i} className="bds-chart__bar" x={r1(x(i) + off - groupW / 2)} y={Math.min(y0, y1)} width={r1(groupW)} height={Math.max(1, Math.abs(y0 - y1))} rx={stacked ? 0 : 3} fill={color} opacity={hover == null || hover === i ? 1 : 0.45} style={{ animationDelay: `${i * 25}ms` }} />;
              })}</g>;
            }
            /* Dash goes on as a presentation attribute. During the entry animation the .bds-chart--animate .bds-chart__line CSS (draw-on dasharray) overrides it; once the class drops, this pattern shows. */
            const runs = runsOf(s.values, x, y), baseY = y(Math.max(lo, 0)), dash = seriesDash(s, si, series.length);
            return <g key={si}>{runs.map((pts, ri) => pts.length === 1 ? <circle key={ri} cx={pts[0][0]} cy={pts[0][1]} r={3} fill={color} /> : <g key={ri}>
              {kind === "area" && <path className="bds-chart__area" d={`${smoothPath(pts)} L${pts[pts.length - 1][0]} ${baseY} L${pts[0][0]} ${baseY}Z`} fill={`url(#${uid}-g${si})`} />}
              <path className="bds-chart__line" d={smoothPath(pts)} stroke={color} strokeDasharray={dash} style={{ "--draw-len": r1(pathLength(pts)) }} />
            </g>)}</g>;
          })}
        </g>
        {kind !== "bar" && series.map((s, si) => { const last = runsOf(s.values, x, y).pop(); return last ? <circle key={si} className="bds-chart__dot bds-chart__end" cx={last[last.length - 1][0]} cy={last[last.length - 1][1]} r={2.5} fill={toneVar(s.tone, si)} /> : null; })}
        {hover != null && kind !== "bar" && <g><line className="bds-chart__cursor" x1={x(hover)} x2={x(hover)} y1={padT} y2={h - padB} />{series.map((s, si) => s.values[hover] == null ? null : <circle key={si} className="bds-chart__dot" cx={x(hover)} cy={y(s.values[hover])} r={4} fill={toneVar(s.tone, si)} />)}</g>}
      </svg>
      {hover != null && rows.length > 0 && <Tip h={height} x={x(hover)} w={width} title={labels[hover]} rows={rows} />}
    </>
  );
}

/* ---------- Donut ---------- */
/** @param {{ segments: NormSegment[], fmt: Fmt, caption?: import("react").ReactNode, w: number, h: number, hover: number | null, setHover: (i: number | null) => void }} props */
function Pie({ segments, w, h, hover, setHover }) {
  // Missing segments stay null; 0 would read as a collected zero.
  const vals = segments.map((s) => (s.value == null ? null : Math.max(0, s.value))), sum = vals.reduce((/** @type {number} */ a, b) => a + (b ?? 0), 0);
  if (!sum || w < 40) return null;
  const R = Math.max(0, Math.min(w, h) / 2 - 4), stroke = Math.min(R, Math.max(10, R * 0.34)), r = R - stroke / 2, C = 2 * Math.PI * r, cx0 = w / 2, cy0 = h / 2;
  /** @type {{ i: number, dash: number, off: number }[]} */
  const arcs = [];
  let acc = 0;
  for (let i = 0; i < vals.length; i++) {
    const v = vals[i];
    if (v == null) continue;
    const dash = (v / sum) * C;
    if (dash > 0) arcs.push({ i, dash, off: -(acc / sum) * C });
    acc += v;
  }
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" aria-hidden="true">
        <circle cx={cx0} cy={cy0} r={r} fill="none" strokeWidth={stroke} className="bds-chart__track" />
        {arcs.map((a) => <circle key={a.i} className="bds-chart__pieseg" cx={cx0} cy={cy0} r={r} fill="none" strokeWidth={hover === a.i ? stroke + 4 : stroke} stroke={toneVar(segments[a.i].tone, a.i)} strokeDasharray={`${Math.max(0, a.dash - 2).toFixed(2)} ${C.toFixed(2)}`} strokeDashoffset={a.off.toFixed(2)} transform={`rotate(-90 ${cx0} ${cy0})`} opacity={hover == null || hover === a.i ? 1 : 0.4} onMouseEnter={() => setHover(a.i)} style={{ transition: "stroke-width var(--dur-fast) var(--ease-out), opacity var(--dur-fast)" }} />)}
      </svg>
    </>
  );
}

/** @param {number} w @param {number} h */
function radialGeometry(w, h) {
  const stroke = Math.max(0, Math.min(w, h) / 12);
  const r = Math.max(0, Math.min((w - stroke) / 2, (h - stroke) / 1.5));
  return { r, stroke, cx0: w / 2, cy0: r + stroke / 2 };
}

/* ---------- Radial gauge ---------- */
/** @param {{ value: number, label?: import("react").ReactNode, tone?: ChartTone, fmt: Fmt, w: number, h: number, animate?: boolean }} props */
function Radial({ value, tone, w, h, animate }) {
  const [shown, setShown] = useState(animate ? 0 : value);
  useEffect(() => { const t = requestAnimationFrame(() => setShown(value)); return () => cancelAnimationFrame(t); }, [value]);
  if (w < 40) return null;
  // 240° gauge. Pick r so that height = 1.5r + stroke and width = 2r + stroke both fit.
  const { r, stroke, cx0, cy0 } = radialGeometry(w, h);
  const a0 = Math.PI * 7 / 6, a1 = -Math.PI / 6;
  const pt = (/** @type {number} */ a) => /** @type {Point} */ ([r1(cx0 + Math.cos(a) * r), r1(cy0 - Math.sin(a) * r)]);
  const [sx, sy] = pt(a0), [ex, ey] = pt(a1);
  const d = `M${sx} ${sy} A${r} ${r} 0 1 1 ${ex} ${ey}`;
  const len = r * (a0 - a1);
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" aria-hidden="true">
        <path d={d} fill="none" strokeWidth={stroke} strokeLinecap="round" className="bds-chart__track" />
        <path d={d} fill="none" strokeWidth={stroke} strokeLinecap="round" stroke={toneVar(tone, 0)} strokeDasharray={len} strokeDashoffset={r1(len * (1 - Math.min(1, Math.max(0, shown))))} className="bds-chart__arc" />
      </svg>
    </>
  );
}

/* ---------- Radar ---------- */
/** @param {{ axes: string[], series: ChartSeries[], max?: number, fmt: Fmt, w: number, h: number, hover: number | null, setHover: (i: number | null) => void, metrics?: import("./plot-layout.js").PlotMetrics }} props */
function Radar({ axes, series, max, fmt, w: width, h: height, hover, setHover, metrics: m = emptyPlotMetrics }) {
  const n = axes.length; if (n < 3 || width < 40) return null;
  const all = series.flatMap((s) => s.values).filter((v) => v != null);
  const top = (max ?? (all.length ? Math.max(...all) : 1)) || 1;
  const labelWidths = axes.map((ax) => m.measure(ax, true)), labelWidth = Math.max(0, ...labelWidths);
  const directions = axes.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [Math.cos(a), Math.sin(a)]; });
  // Find the smallest label radius that separates every pair horizontally or vertically.
  let labelRadius = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const dx = Math.abs(directions[i][0] - directions[j][0]), dy = Math.abs(directions[i][1] - directions[j][1]);
    labelRadius = Math.max(labelRadius, Math.min(dx ? ((labelWidths[i] + labelWidths[j]) / 2 + m.gap) / dx : Infinity, dy ? (m.caption * 1.4 + m.gap) / dy : Infinity));
  }
  const R = Math.max(labelRadius, Math.min(width / 2 - labelWidth / 2 - m.gap, height / 2 - m.caption - m.gap), 0) / 1.14;
  const w = Math.max(width, 2 * (R * 1.14 + labelWidth / 2 + m.gap)), h = Math.max(height, 2 * (R * 1.14 + m.caption + m.gap));
  const cx0 = w / 2, cy0 = h / 2;
  const pt = (/** @type {number} */ i, /** @type {number} */ f) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return /** @type {Point} */ ([r1(cx0 + Math.cos(a) * R * f), r1(cy0 + Math.sin(a) * R * f)]); };
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" aria-hidden="true">
        {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} className="bds-chart__radar-grid" points={axes.map((_, i) => pt(i, f).join(",")).join(" ")} />)}
        {axes.map((_, i) => <line key={i} className="bds-chart__radar-grid" x1={cx0} y1={cy0} x2={pt(i, 1)[0]} y2={pt(i, 1)[1]} />)}
        {series.map((s, si) => {
          const points = axes.map((_, i) => s.values[i] == null ? null : pt(i, Math.min(1, Math.max(0, s.values[i] / top))));
          const color = toneVar(s.tone, si);
          // The closed fill is drawn only when every axis has a value; never bridge across a missing axis.
          if (points.every(Boolean)) return <polygon key={si} points={/** @type {Point[]} */ (points).map((p) => p.join(",")).join(" ")} fill={color} fillOpacity=".2" stroke={color} strokeWidth="2" strokeLinejoin="round" />;
          return <g key={si}>{points.map((p, i) => {
            const next = points[(i + 1) % n];
            return p && next ? <line key={i} x1={p[0]} y1={p[1]} x2={next[0]} y2={next[1]} stroke={color} strokeWidth="2" /> : null;
          })}</g>;
        })}
        {series.map((s, si) => axes.map((_, i) => s.values[i] == null ? null : <circle key={`${si}-${i}`} cx={pt(i, Math.min(1, Math.max(0, s.values[i] / top)))[0]} cy={pt(i, Math.min(1, Math.max(0, s.values[i] / top)))[1]} r={hover === i ? 5 : 3} fill={toneVar(s.tone, si)} className="bds-chart__dot" onMouseEnter={() => setHover(i)} />))}
        {axes.map((ax, i) => { const [lx, ly] = pt(i, 1.14); return <text key={ax} className="bds-chart__label" x={lx} y={ly} textAnchor="middle" dominantBaseline="central" onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)}>{ax}</text>; })}
      </svg>
      {hover != null && <Tip h={height} x={pt(hover, 1)[0]} w={width} title={axes[hover]} rows={series.map((s, si) => ({ color: toneVar(s.tone, si), name: s.label, value: cell(fmt, s.values[hover]) }))} />}
    </>
  );
}

/* ---------- Histogram ---------- */
/** Raw samples binned into bars. Percentile lines (p50/p95) are vertical dashes like thresholds. Bins come from chart-math.histBins, shared with the SR table. */
/** @param {{ hist: ReturnType<typeof histBins>, fmt: Fmt, w: number, h: number, tone?: ChartTone, percentiles?: number[], unit?: string, animate?: boolean, hover: number | null, setHover: (i: number | null) => void, metrics: import("./plot-layout.js").PlotMetrics }} props */
function Histogram({ hist, fmt, w: width, h: height, tone, percentiles = [], unit, animate, hover, setHover, metrics: m }) {
  const b = hist;
  if (!b || width < 40) return null;
  const { xs, lo, span, n, counts } = b;
  const max = Math.max(...counts);
  const sorted = [...xs].sort((p, q2) => p - q2);
  const q = (/** @type {number} */ p) => sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];
  const h = Math.max(height, m.caption * 5 + m.micro * 2);
  const { ticks } = niceTicks(0, max, h < 140 ? 2 : 3);
  const padL = Math.max(...ticks.map((t) => m.measure(String(t)))) + m.gap * 2, padR = m.gap * 2, padT = m.caption * 2, padB = m.caption * 2 + m.micro / 2 + m.gap;
  const w = Math.max(width, padL + padR + m.micro * 4);
  const iw = w - padL - padR, ih = h - padT - padB;
  const bw = iw / n;
  const y = (/** @type {number} */ c) => r1(padT + (1 - c / (ticks[ticks.length - 1] || 1)) * ih);
  const xv = (/** @type {number} */ v) => r1(padL + ((v - lo) / span) * iw);
  const markers = plotLabels(percentiles.map((p, index) => ({ index, x: xv(q(p)), text: `p${Math.round(p * 100)} ${fmt(q(p))}${unit ?? ""}` })).sort((a, b) => a.x - b.x), w, m);
  const xLabels = plotLabels([lo, lo + span / 2, lo + span].map((v, index) => ({ index, x: xv(v), text: `${fmt(v)}${unit ?? ""}` })), w, m);
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" aria-hidden="true">
        {ticks.filter((_, i) => i % Math.max(1, Math.ceil((m.micro * 1.4 + m.gap) / (ih / Math.max(1, ticks.length - 1)))) === 0).map((t) => <g key={t}><line className="bds-chart__grid" x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} style={t === 0 ? { stroke: "var(--plot-axis)" } : undefined} /><text className="bds-chart__tick" x={padL - m.gap} y={y(t)} textAnchor="end" dominantBaseline="central">{t}</text></g>)}
        {counts.map((c, i) => <rect key={i} className="bds-chart__bar" x={r1(padL + i * bw + 1)} y={y(c)} width={Math.max(1, bw - 2)} height={r1(y(0) - y(c))} fill={toneVar(tone, 0)} opacity={hover == null || hover === i ? 1 : 0.45} onMouseEnter={() => setHover(i)} style={animate ? { transformOrigin: `0 ${y(0)}px`, animation: "bds-grow-y var(--dur-gauge) var(--ease-out) both" } : undefined} />)}
        {percentiles.map((p) => { const v = q(p), x = xv(v); return <g key={p}><line x1={x} x2={x} y1={padT} y2={y(0)} stroke="var(--ink-2)" strokeDasharray="3 3" strokeWidth="1" /></g>; })}
        {markers.map((label) => <text key={label.index} className="bds-chart__tick bds-chart__tick--secondary" x={label.x} y={m.caption} textAnchor="start">{label.text}</text>)}
        {xLabels.map((label) => <text key={label.index} className="bds-chart__tick" x={label.x} y={h - m.gap - m.caption / 3} textAnchor="start">{label.text}</text>)}
      </svg>
      {hover != null && <Tip h={height} x={r1(padL + (hover + 0.5) * bw)} w={width} title={`${fmt(lo + (hover / n) * span)}~${fmt(lo + ((hover + 1) / n) * span)}${unit ?? ""}`} rows={[{ color: toneVar(tone, 0), name: "표본", value: `${counts[hover]}건` }]} />}
    </>
  );
}

/* ---------- Screen-reader table ---------- */
/** The visual chart's data as a table. Always rendered (hidden with bds-sr) and referenced by aria-describedby. */
/** @param {{ id: string, kind: NonNullable<NormProps["kind"]>, props: NormProps, bins: ReturnType<typeof histBins>, fmt: Fmt }} props */
function SrTable({ id, kind, props, bins, fmt }) {
  /** @type {import("react").ReactNode[]} */
  let head = [];
  /** @type {import("react").ReactNode[][]} */
  let rows = [];
  if (kind === "pie") { head = ["항목", "값"]; rows = (props.segments ?? []).map((sg) => [sg.label, cell(fmt, sg.value == null ? null : Math.max(0, sg.value))]); }
  else if (kind === "radial") { head = props.label != null ? ["값", "상태"] : ["값"]; const rv = numeric(props.value) == null ? MISSING_TEXT : fmt(Math.min(1, Math.max(0, /** @type {number} */ (props.value)))); rows = [props.label != null ? [rv, props.label] : [rv]]; }
  else if (kind === "histogram") { const b = bins; head = ["구간", "표본"]; rows = b ? b.counts.map((c, i) => [`${fmt(b.lo + (i / b.n) * b.span)}~${fmt(b.lo + ((i + 1) / b.n) * b.span)}${props.unit ?? ""}`, `${c}건`]) : []; }
  else { const cols = kind === "radar" ? (props.axes ?? []) : (props.labels ?? []); head = ["계열"].concat(cols); rows = (props.series ?? []).map((s) => [s.label].concat(cols.map((_, i) => cell(fmt, s.values[i])))); }
  // A table grows to its content and ignores width:1px; the block wrapper must do the hiding or the document overflows horizontally.
  return (
    <div className="bds-sr">
      <table id={id}>
        <thead><tr>{head.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

/* ---------- Entry point ---------- */
const DEFAULT_H = { line: 200, area: 200, bar: 200, pie: 180, radial: 110, radar: 260, histogram: 180 };

/** Single chart component. kind: line | area | bar | pie | radial | radar | histogram.
 *  paused=true keeps drawing the last props snapshot while the stream moves on.
 *  Keyboard on the stage: ←/→ move the index, Home/End jump to the ends, Esc clears. Colors, motion and a11y surfaces follow RULE.md "설계 원칙" and "접근성".
 * @param {Parameters<typeof import("./Chart.d.ts").Chart>[0]} rawProps
 */
export function Chart(rawProps) {
  /* paused means "keep what is on screen", so it is state: capture props when freezing, drop them when
     unfreezing. Writing a ref during render could leave a discarded render's props as the snapshot. */
  const [frozen, setFrozen] = useState(/** @type {typeof rawProps | null} */ (null));
  if (rawProps.paused && frozen === null) setFrozen(rawProps);
  if (!rawProps.paused && frozen !== null) setFrozen(null);
  const full = normalize(frozen ?? rawProps);
  const [localRange, setLocalRange] = useState(/** @type {[number, number] | null} */ (null));
  const [draftRange, setDraftRange] = useState(/** @type {[number, number] | null} */ (null));
  const coordinates = full.xValues;
  const linked = !!coordinates?.length && coordinates.length === full.labels?.length && coordinates.every((v, i) => Number.isFinite(v) && (i === 0 || v > coordinates[i - 1]));
  const requestedRange = full.range === undefined ? localRange : full.range;
  const range = linked && requestedRange && requestedRange[0] < requestedRange[1] ? requestedRange : null;
  const indices = (full.labels ?? []).flatMap((_, i) => !range || (coordinates && coordinates[i] >= range[0] && coordinates[i] <= range[1]) ? [i] : []);
  const props = linked ? { ...full, labels: indices.map(i => full.labels?.[i] ?? ""), xValues: indices.map(i => coordinates?.[i] ?? i), series: full.series?.map(series => ({ ...series, values: indices.map(i => series.values[i]) })) } : full;
  const { kind = "line", fit = "flex", width, height, valueFormatter = fmtKo, emptyText = MISSING_TEXT, showLegend = true, live = false, animate = !live, className, style, "aria-label": ariaLabel } = props;
  const uid = useId().replace(/:/g, "");
  const srId = `${uid}-sr`;
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [hoverRaw, setHoverRaw] = useState(/** @type {number | null} */ (null));
  const h = height ?? DEFAULT_H[kind];
  const metrics = usePlotMetrics(ref);
  const anim = useAnimateOnce(animate && !live);
  const w = metrics.width || (fit === "fixed" && typeof width === "number" ? width : 0);
  const lineKind = kind === "line" || kind === "area";
  /* Bin once per render so Histogram, SrTable and count agree. */
  const bins = kind === "histogram" ? histBins(props.samples, props.bins) : null;
  const count = kind === "pie" ? (props.segments ?? []).length
    : kind === "histogram" ? (bins ? bins.n : 0)
    : kind === "radar" ? (props.axes ?? []).length
    : kind === "radial" ? 0
    : (props.labels ?? []).length;
  /* hover indexes into count. When a stream shrinks the old index goes out of range and the tooltip
     and cursor would linger outside the plot, so filter once here instead of guarding every read. */
  const setHover = (/** @type {number | null} */ index) => { setHoverRaw(index); if (linked) full.onHoverValueChange?.(index == null ? null : props.xValues?.[index] ?? null); };
  let hover = hoverRaw != null && hoverRaw < count ? hoverRaw : null;
  if (linked && full.hoverValue !== undefined) {
    hover = null;
    if (full.hoverValue != null && props.xValues?.length && full.hoverValue >= props.xValues[0] && full.hoverValue <= (props.xValues.at(-1) ?? 0)) {
      const coordinate = full.hoverValue; hover = props.xValues.reduce((best, value, i, values) => Math.abs(value - coordinate) < Math.abs(values[best] - coordinate) ? i : best, 0);
    }
  }
  const zoom = (/** @type {[number, number] | null} */ next) => { setLocalRange(next); full.onRangeChange?.(next); setHover(null); };
  const draftStart = coordinates?.includes(draftRange?.[0] ?? NaN) ? draftRange?.[0] : coordinates?.[0];
  const draftEnd = coordinates?.includes(draftRange?.[1] ?? NaN) ? draftRange?.[1] : coordinates?.at(-1);
  /** @type {import("react").ReactNode} */
  let body = null;
  let hasData = false;
  /** @type {Parameters<typeof Legend>[0]["items"]} */
  let legend = [];
  if (showLegend) {
    if (kind === "pie") legend = (props.segments ?? []).map((sg, i) => ({ color: toneVar(sg.tone, i), label: sg.label, value: cell(valueFormatter, sg.value == null ? null : Math.max(0, sg.value)) }));
    else if (kind !== "radial") { const list = props.series ?? []; if (list.length > 1) legend = list.map((sr, i) => ({ color: toneVar(sr.tone, i), label: sr.label, shape: lineKind ? "line" : "square", dash: lineKind ? seriesDash(sr, i, list.length) : undefined })); }
  }
  if (kind === "pie") { hasData = (props.segments ?? []).some((s) => (s.value ?? 0) > 0); body = <Pie segments={props.segments ?? []} fmt={valueFormatter} caption={props.caption} w={w} h={h} hover={hover} setHover={setHover} />; }
  else if (kind === "radial") { hasData = props.value != null; body = <Radial value={props.value ?? 0} label={props.label} tone={props.tone} fmt={valueFormatter} w={w} h={h} animate={animate && !live} />; }
  else if (kind === "histogram") { hasData = !!bins; body = <Histogram metrics={metrics} hist={bins} tone={props.tone} percentiles={props.percentiles ?? []} unit={props.unit} fmt={valueFormatter} w={w} h={h} animate={anim} hover={hover} setHover={setHover} />; }
  else if (kind === "radar") { const axes = props.axes ?? []; hasData = axes.length >= 3 && (props.series ?? []).some((s) => axes.some((_, i) => s.values[i] != null)); body = <Radar metrics={metrics} axes={props.axes ?? []} series={props.series ?? []} max={props.max} fmt={valueFormatter} w={w} h={h} hover={hover} setHover={setHover} />; }
  else { hasData = (props.labels ?? []).length > 0 && (props.series ?? []).some((s) => s.values.some((v) => v != null)); body = <Cartesian xValues={linked ? props.xValues : undefined} events={linked ? props.events : undefined} onZoom={linked && full.zoomable ? zoom : undefined} metrics={metrics} kind={kind} labels={props.labels ?? []} series={props.series ?? []} fmt={valueFormatter} uid={uid} xTicks={props.xTicks ?? "auto"} w={w} h={h} thresholds={props.thresholds} stacked={props.stacked} yMin={props.yMin} yMax={props.yMax} hover={hover} setHover={setHover} />; }
  /* Text readout for the keyboard-selected point; same content as the visual Tip. */
  const readout = hover == null ? "" : [
    kind === "pie" ? props.segments?.[hover]?.label : kind === "radar" ? props.axes?.[hover] : props.labels?.[hover],
    ...(props.series ?? []).map((s) => `${s.label} ${cell(valueFormatter, s.values[hover])}`),
    kind === "pie" ? cell(valueFormatter, props.segments?.[hover]?.value) : null,
  ].filter(Boolean).join(", ");
  /** @param {import("react").KeyboardEvent<HTMLDivElement>} e */
  const onKey = (e) => {
    if (!count) return;
    /** @type {number | null | undefined} */
    let next;
    if (e.key === "ArrowRight") next = hover == null ? 0 : Math.min(count - 1, hover + 1);
    else if (e.key === "ArrowLeft") next = hover == null ? count - 1 : Math.max(0, hover - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else if (e.key === "Escape") next = null;
    else return;
    e.preventDefault(); setHover(next ?? null);
  };
  let center = null;
  if (hasData && kind === "pie") {
    const R = Math.max(0, Math.min(w, h) / 2 - 4), stroke = Math.min(R, Math.max(10, R * 0.34)), side = Math.max(0, (R - stroke) * Math.SQRT2);
    const selected = hover == null ? null : props.segments?.[hover];
    const total = (props.segments ?? []).reduce((sum, segment) => sum + Math.max(0, segment.value ?? 0), 0);
    center = <PlotValue metrics={metrics} value={selected ? cell(valueFormatter, selected.value) : valueFormatter(total)} caption={selected ? selected.label : props.caption} box={{ left: (w - side) / 2, top: (h - side) / 2, width: side, height: side }} />;
  } else if (hasData && kind === "radial") {
    const { r, stroke, cy0 } = radialGeometry(w, h), side = Math.max(0, (r - stroke / 2) * Math.SQRT2);
    center = <PlotValue metrics={metrics} value={valueFormatter(Math.min(1, Math.max(0, props.value ?? 0)))} caption={props.label} tone={toneInk(props.tone)} box={{ left: (w - side) / 2, top: cy0 - side / 2, width: side, height: side / 1.5 }} />;
  }
  const sortedSamples = bins ? [...bins.xs].sort((a, b) => a - b) : [];
  const notes = kind === "histogram" && bins ? (props.percentiles ?? []).map((p) => { const sorted = sortedSamples; return `p${Math.round(p * 100)} ${valueFormatter(sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))])}${props.unit ?? ""}`; }) : (props.thresholds ?? []).map((t) => t.label ?? valueFormatter(t.value));
  return (
    <div ref={ref} role="group" aria-label={ariaLabel ?? "차트"} className={cx("bds-chart", `bds-chart--${kind}`, anim && "bds-chart--animate", className)} style={frameStyle({ fit, width, style })}>
      {linked && full.zoomable && <div className="bds-explore-tools" role="group" aria-label="차트 구간 선택">
        <Select aria-label="확대 시작" value={draftStart} options={(full.labels ?? []).map((label, i) => ({ value: String(coordinates?.[i]), label }))} onChange={e => setDraftRange([Number(e.target.value), draftEnd ?? 0])} />
        <Select aria-label="확대 종료" value={draftEnd} options={(full.labels ?? []).map((label, i) => ({ value: String(coordinates?.[i]), label }))} onChange={e => setDraftRange([draftStart ?? 0, Number(e.target.value)])} />
        <Button variant="secondary" disabled={draftStart == null || draftEnd == null || draftStart >= draftEnd} onClick={() => { if (draftStart != null && draftEnd != null) zoom([draftStart, draftEnd]); }}>확대</Button>
        <Button variant="ghost" disabled={!range} onClick={() => { zoom(null); setDraftRange(null); }}>초기화</Button>
      </div>}
      {hasData ? <div className="bds-chart__stage" style={{ height: h }} role="application" tabIndex={0} aria-label={`${ariaLabel ?? "차트"} 탐색`} aria-describedby={`${srId} ${srId}-now`} onKeyDown={onKey} onMouseLeave={() => setHover(null)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHover(null); }}>{w > 0 && body}</div> : <div id={srId} className="bds-chart__empty" style={{ height: h }}>{emptyText}</div>}
      {center}
      {linked && !!props.events?.length && <div className="bds-chart__notes" aria-label="차트 이벤트">{props.events.filter(event => !range || (event.value >= range[0] && event.value <= range[1])).map(event => <span key={event.id}>{event.label}</span>)}</div>}
      {hasData && notes.length > 0 && <div className="bds-chart__notes">{notes.map((note, index) => <span key={index}>{note}</span>)}</div>}
      {hasData && <p id={`${srId}-now`} className="bds-sr" role="status">{readout}</p>}
      {hasData && <SrTable id={srId} kind={kind} props={props} bins={bins} fmt={valueFormatter} />}
      {hasData && legend.length > 0 && <Legend items={legend} compact />}
    </div>
  );
}
