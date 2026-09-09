import React, { useEffect, useId, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { r1, toneVar, toneInk, fmtKo, niceTicks, smoothPath, runsOf, pathLength, estWidth, seriesDash, histBins } from "./chart-math.js";
import { Legend } from "./Legend.jsx";

/* ---------- 공용 크롬 ---------- */
function useSize(ref, fixedW, fixedH) {
  const [size, setSize] = useState({ w: fixedW ?? 0, h: fixedH ?? 0 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); setSize((p) => { const w = Math.round(r.width), h = Math.round(r.height); return Math.abs(p.w - w) > 1 || Math.abs(p.h - h) > 1 ? { w, h } : p; }); };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}
function useAnimateOnce(enabled) {
  const [on, setOn] = useState(enabled);
  useEffect(() => { if (!enabled) return; const t = setTimeout(() => setOn(false), 1100); return () => clearTimeout(t); }, [enabled]);
  return on;
}
function Tip({ x, w, title, rows }) {
  const flip = x > w * 0.6;
  return (
    <div className={cx("bds-chart__tip", flip && "bds-chart__tip--flip")} style={{ left: x }}>
      {title != null && <div className="bds-chart__tip-t">{title}</div>}
      {rows.map((r, i) => <div key={i} className="bds-chart__tip-row"><i style={{ background: r.color }} /><span className="n bds-ellipsis">{r.name}</span><span className="v" style={r.value === MISSING ? { fontFamily: "var(--font-ui)" } : undefined}>{r.value}</span></div>)}
    </div>
  );
}
const MISSING = "수집 안 됨";
const cell = (fmt, v) => (v == null ? MISSING : fmt(v));

/* ---------- 직교(line·area·bar) ---------- */
/** hover/setHover는 Chart가 갖는다(마우스·키보드가 같은 인덱스를 움직여 같은 Tip을 띄운다). */
function Cartesian({ kind, labels, series, fmt, uid, xTicks, w, h, thresholds = [], stacked, yMin, yMax, hover, setHover }) {
  const n = labels.length;
  const stackedVals = stacked && kind === "bar" ? labels.map((_, i) => series.reduce((a, s) => a + (s.values[i] ?? 0), 0)) : null;
  const all = (stackedVals ?? series.flatMap((s) => s.values)).filter((v) => v != null).concat(thresholds.map((t) => t.value));
  if (!n || !all.length || w < 40) return null;
  const lo0 = Math.min(0, ...all), hi0 = Math.max(...all);
  const { ticks, lo, hi } = niceTicks(yMin ?? lo0, yMax ?? hi0, h < 140 ? 2 : 4);
  const padL = Math.max(...ticks.map((t) => estWidth(fmt(t)))), padR = 8, padT = 10, padB = xTicks === "none" ? 8 : 26;
  const iw = w - padL - padR, ih = h - padT - padB;
  const step = n > 1 ? iw / (n - 1) : 0;
  const bandW = iw / n;
  const x = (i) => r1(kind === "bar" ? padL + bandW * (i + 0.5) : n > 1 ? padL + i * step : padL + iw / 2);
  const y = (v) => r1(padT + (1 - (v - lo) / (hi - lo || 1)) * ih);
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 58))));
  const showX = (i) => xTicks !== "none" && (xTicks === "ends" ? i === 0 || i === n - 1 : i % every === 0 || i === n - 1);
  const groupW = Math.min(28, bandW * 0.62 / (stacked ? 1 : series.length));
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); const px = ((e.clientX ?? e.touches?.[0]?.clientX) - r.left); const i = kind === "bar" ? Math.floor((px - padL) / bandW) : Math.round((px - padL) / (step || 1)); setHover(Math.max(0, Math.min(n - 1, i))); };
  const rows = hover == null ? [] : series.map((s, si) => ({ color: toneVar(s.tone, si), name: s.label, value: cell(fmt, s.values[hover]) }));
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" onMouseMove={onMove} onTouchStart={onMove} onTouchMove={onMove} onMouseLeave={() => setHover(null)} aria-hidden="true">
        <defs>{series.map((s, si) => <linearGradient key={si} id={`${uid}-g${si}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={toneVar(s.tone, si)} stopOpacity=".14" /><stop offset="1" stopColor={toneVar(s.tone, si)} stopOpacity="0" /></linearGradient>)}
          <clipPath id={`${uid}-c`}><rect x={padL} y={0} width={iw} height={h} /></clipPath></defs>
        {ticks.map((t) => <g key={t}><line className="bds-chart__grid" x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} style={t === ticks[0] ? { stroke: "var(--plot-axis)" } : undefined} /><text className="bds-chart__tick" x={padL - 8} y={y(t) + 3.5} textAnchor="end">{fmt(t)}</text></g>)}
        {labels.map((lb, i) => showX(i) ? <text key={i} className="bds-chart__tick" x={x(i)} y={h - 8} textAnchor={i === 0 && kind !== "bar" ? "start" : i === n - 1 && kind !== "bar" ? "end" : "middle"}>{lb}</text> : null)}
        {thresholds.map((t, i) => <g key={i}><line x1={padL} x2={w - padR} y1={y(t.value)} y2={y(t.value)} stroke={`var(--${t.tone ?? "warn"})`} strokeDasharray="4 4" strokeWidth="1" /><text className="bds-chart__tick" x={w - padR} y={y(t.value) - 4} textAnchor="end" fill={`var(--${t.tone ?? "warn"})`} style={{ fill: `var(--${t.tone ?? "warn"})` }}>{t.label ?? fmt(t.value)}</text></g>)}
        <g clipPath={`url(#${uid}-c)`}>
          {series.map((s, si) => {
            const color = toneVar(s.tone, si);
            if (kind === "bar") {
              const off = stacked ? 0 : (si - (series.length - 1) / 2) * groupW;
              return <g key={si}>{s.values.map((v, i) => {
                if (v == null) return null;
                const base = stacked ? series.slice(0, si).reduce((a, p) => a + (p.values[i] ?? 0), 0) : 0;
                const y1 = y(base + v), y0 = y(base);
                return <rect key={i} className="bds-chart__bar" x={r1(x(i) + off - groupW / 2)} y={Math.min(y0, y1)} width={r1(groupW)} height={Math.max(1, Math.abs(y0 - y1))} rx={stacked ? 0 : 3} fill={color} opacity={hover == null || hover === i ? 1 : 0.45} style={{ animationDelay: `${i * 25}ms` }} />;
              })}</g>;
            }
            /* 대시는 프레젠테이션 속성으로 준다. 진입 모션 동안은 .bds-chart--animate .bds-chart__line의 CSS(그리기용 dasharray)가 속성을 덮고, 클래스가 빠지면 이 패턴이 드러난다. */
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
      {hover != null && rows.length > 0 && <Tip x={x(hover)} w={w} title={labels[hover]} rows={rows} />}
    </>
  );
}

/* ---------- 도넛 ---------- */
function Pie({ segments, fmt, caption, w, h, hover, setHover }) {
  const vals = segments.map((s) => Math.max(0, Number(s.value) || 0)), sum = vals.reduce((a, b) => a + b, 0);
  if (!sum || w < 40) return null;
  const R = Math.min(w, h) / 2 - 4, stroke = Math.max(10, R * 0.34), r = R - stroke / 2, C = 2 * Math.PI * r, cx0 = w / 2, cy0 = h / 2;
  let acc = 0;
  const arcs = vals.map((v, i) => { const a = { i, dash: (v / sum) * C, off: -(acc / sum) * C }; acc += v; return a; }).filter((a) => a.dash > 0);
  const act = hover != null ? segments[hover] : null;
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" onMouseLeave={() => setHover(null)} aria-hidden="true">
        <circle cx={cx0} cy={cy0} r={r} fill="none" strokeWidth={stroke} className="bds-chart__track" />
        {arcs.map((a) => <circle key={a.i} className="bds-chart__pieseg" cx={cx0} cy={cy0} r={r} fill="none" strokeWidth={hover === a.i ? stroke + 4 : stroke} stroke={toneVar(segments[a.i].tone, a.i)} strokeDasharray={`${Math.max(0, a.dash - 2).toFixed(2)} ${C.toFixed(2)}`} strokeDashoffset={a.off.toFixed(2)} transform={`rotate(-90 ${cx0} ${cy0})`} opacity={hover == null || hover === a.i ? 1 : 0.4} onMouseEnter={() => setHover(a.i)} style={{ transition: "stroke-width var(--dur-1) var(--ease-out), opacity var(--dur-1)" }} />)}
      </svg>
      <div className="bds-chart__center" style={{ "--center-size": `${Math.max(14, Math.round(R * 0.42))}px` }}>
        <b>{act ? fmt(vals[hover]) : fmt(sum)}</b><small>{act ? act.label : caption}</small>
      </div>
    </>
  );
}

/* ---------- 방사 게이지 ---------- */
function Radial({ value, label, tone, fmt, w, h, animate }) {
  const [shown, setShown] = useState(animate ? 0 : value);
  useEffect(() => { const t = requestAnimationFrame(() => setShown(value)); return () => cancelAnimationFrame(t); }, [value]);
  if (w < 40) return null;
  const v = Math.min(1, Math.max(0, value));
  // 240° 게이지. 높이 = 1.5r + stroke, 폭 = 2r + stroke 안에 들어오도록 r을 정한다.
  const r = Math.min(h / 1.6, w / 2.1) - 2, stroke = Math.max(6, r * 0.14), cx0 = w / 2, cy0 = r + stroke / 2 + 2;
  const a0 = Math.PI * 7 / 6, a1 = -Math.PI / 6;
  const pt = (a) => [r1(cx0 + Math.cos(a) * r), r1(cy0 - Math.sin(a) * r)];
  const [sx, sy] = pt(a0), [ex, ey] = pt(a1);
  const d = `M${sx} ${sy} A${r} ${r} 0 1 1 ${ex} ${ey}`;
  const len = r * (a0 - a1);
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" aria-hidden="true">
        <path d={d} fill="none" strokeWidth={stroke} strokeLinecap="round" className="bds-chart__track" />
        <path d={d} fill="none" strokeWidth={stroke} strokeLinecap="round" stroke={toneVar(tone, 0)} strokeDasharray={len} strokeDashoffset={r1(len * (1 - Math.min(1, Math.max(0, shown))))} className="bds-chart__arc" />
      </svg>
      <div className="bds-chart__center" style={{ "--center-size": `${Math.max(13, Math.round(r * 0.33))}px`, top: cy0 - r * 0.5, bottom: "auto", height: r * 1.05, padding: `0 ${Math.round(stroke + 6)}px` }}><b style={{ color: toneInk(tone) }}>{fmt(v)}</b>{label != null && <small>{label}</small>}</div>
    </>
  );
}

/* ---------- 레이더 ---------- */
function Radar({ axes, series, max, fmt, w, h, hover, setHover }) {
  const n = axes.length; if (n < 3 || w < 40) return null;
  const all = series.flatMap((s) => s.values).filter((v) => v != null);
  const top = (max ?? (all.length ? Math.max(...all) : 1)) || 1;
  const cx0 = w / 2, cy0 = h / 2, R = Math.min(w, h) / 2 - 18;
  const pt = (i, f) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [r1(cx0 + Math.cos(a) * R * f), r1(cy0 + Math.sin(a) * R * f)]; };
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" onMouseLeave={() => setHover(null)} aria-hidden="true">
        {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} className="bds-chart__radar-grid" points={axes.map((_, i) => pt(i, f).join(",")).join(" ")} />)}
        {axes.map((_, i) => <line key={i} className="bds-chart__radar-grid" x1={cx0} y1={cy0} x2={pt(i, 1)[0]} y2={pt(i, 1)[1]} />)}
        {series.map((s, si) => {
          const points = axes.map((_, i) => s.values[i] == null ? null : pt(i, Math.max(0, s.values[i] / top)));
          const color = toneVar(s.tone, si);
          // 닫힌 면은 모든 축이 수집된 경우에만 그린다. 결측 축 양옆을 건너 연결하지 않는다.
          if (points.every(Boolean)) return <polygon key={si} points={points.map((p) => p.join(",")).join(" ")} fill={color} fillOpacity=".2" stroke={color} strokeWidth="2" strokeLinejoin="round" />;
          return <g key={si}>{points.map((p, i) => {
            const next = points[(i + 1) % n];
            return p && next ? <line key={i} x1={p[0]} y1={p[1]} x2={next[0]} y2={next[1]} stroke={color} strokeWidth="2" /> : null;
          })}</g>;
        })}
        {series.map((s, si) => axes.map((_, i) => s.values[i] == null ? null : <circle key={`${si}-${i}`} cx={pt(i, Math.max(0, s.values[i] / top))[0]} cy={pt(i, Math.max(0, s.values[i] / top))[1]} r={hover === i ? 5 : 3} fill={toneVar(s.tone, si)} className="bds-chart__dot" onMouseEnter={() => setHover(i)} />))}
        {axes.map((ax, i) => { const [lx, ly] = pt(i, 1.14); return <text key={ax} className="bds-chart__tick" x={lx} y={ly} textAnchor="middle" dominantBaseline="central" onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)}>{ax}</text>; })}
      </svg>
      {hover != null && <Tip x={pt(hover, 1)[0]} w={w} title={axes[hover]} rows={series.map((s, si) => ({ color: toneVar(s.tone, si), name: s.label, value: cell(fmt, s.values[hover]) }))} />}
    </>
  );
}

/* ---------- 히스토그램 ---------- */
/** 원시 표본(samples)을 bins개 구간으로 나눠 막대로. 분위선(p50/p95)은 thresholds처럼 세로 점선으로. 구간 계산은 chart-math.histBins(SR 표와 공유). */
function Histogram({ samples, bins, fmt, w, h, tone, percentiles = [], unit, animate, hover, setHover }) {
  const b = histBins(samples, bins);
  if (!b || w < 40) return null;
  const { xs, lo, span, n, counts } = b;
  const max = Math.max(...counts);
  const sorted = [...xs].sort((p, q2) => p - q2);
  const q = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];
  const padL = estWidth(String(max)), padR = 8, padT = 10, padB = 26, iw = w - padL - padR, ih = h - padT - padB;
  const bw = iw / n;
  const { ticks } = niceTicks(0, max, h < 140 ? 2 : 3);
  const y = (c) => r1(padT + (1 - c / (ticks[ticks.length - 1] || 1)) * ih);
  const xv = (v) => r1(padL + ((v - lo) / span) * iw);
  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="bds-chart__svg" onMouseLeave={() => setHover(null)} aria-hidden="true">
        {ticks.map((t) => <g key={t}><line className="bds-chart__grid" x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} style={t === 0 ? { stroke: "var(--plot-axis)" } : undefined} /><text className="bds-chart__tick" x={padL - 6} y={y(t)} textAnchor="end" dominantBaseline="central">{t}</text></g>)}
        {counts.map((c, i) => <rect key={i} className="bds-chart__bar" x={r1(padL + i * bw + 1)} y={y(c)} width={Math.max(1, bw - 2)} height={r1(y(0) - y(c))} fill={toneVar(tone, 0)} opacity={hover == null || hover === i ? 1 : 0.45} onMouseEnter={() => setHover(i)} style={animate ? { transformOrigin: `0 ${y(0)}px`, animation: "bds-grow-y var(--dur-draw) var(--ease-out) both" } : undefined} />)}
        {percentiles.map((p) => { const v = q(p), x = xv(v); return <g key={p}><line x1={x} x2={x} y1={padT} y2={y(0)} stroke="var(--ink-2)" strokeDasharray="3 3" strokeWidth="1" /><text className="bds-chart__tick" x={x} y={padT - 2} textAnchor="middle" style={{ fill: "var(--ink-2)" }}>{`p${Math.round(p * 100)} ${fmt(v)}${unit ?? ""}`}</text></g>; })}
        {[lo, lo + span / 2, lo + span].map((v, i) => <text key={i} className="bds-chart__tick" x={xv(v)} y={h - 8} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}>{fmt(v)}{unit ?? ""}</text>)}
      </svg>
      {hover != null && <Tip x={r1(padL + (hover + 0.5) * bw)} w={w} title={`${fmt(lo + (hover / n) * span)}~${fmt(lo + ((hover + 1) / n) * span)}${unit ?? ""}`} rows={[{ color: toneVar(tone, 0), name: "표본", value: `${counts[hover]}건` }]} />}
    </>
  );
}

/* ---------- 스크린리더 표 ---------- */
/** 시각 차트와 같은 데이터를 표로. 항상 렌더(bds-sr로 숨김)하고 루트가 aria-describedby로 가리킨다. */
function SrTable({ id, kind, props, fmt }) {
  let head = [], rows = [];
  if (kind === "pie") { head = ["항목", "값"]; rows = (props.segments ?? []).map((sg) => [sg.label, fmt(Math.max(0, Number(sg.value) || 0))]); }
  else if (kind === "radial") { head = props.label != null ? ["값", "상태"] : ["값"]; rows = [[props.value == null ? MISSING : fmt(Math.min(1, Math.max(0, props.value)))].concat(props.label != null ? [props.label] : [])]; }
  else if (kind === "histogram") { const b = histBins(props.samples, props.bins); head = ["구간", "표본"]; rows = b ? b.counts.map((c, i) => [`${fmt(b.lo + (i / b.n) * b.span)}~${fmt(b.lo + ((i + 1) / b.n) * b.span)}${props.unit ?? ""}`, `${c}건`]) : []; }
  else { const cols = kind === "radar" ? (props.axes ?? []) : (props.labels ?? []); head = ["계열"].concat(cols); rows = (props.series ?? []).map((s) => [s.label].concat(cols.map((_, i) => cell(fmt, s.values[i])))); }
  return (
    <table id={id} className="bds-sr">
      <thead><tr>{head.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>)}</tr>)}</tbody>
    </table>
  );
}

/* ---------- 진입점 ---------- */
const DEFAULT_H = { line: 200, area: 200, bar: 200, pie: 180, radial: 110, radar: 260, histogram: 180 };

/** 단일 차트. kind: line | area | bar | pie | radial | radar | histogram.
 *  fit="flex"(기본)면 부모 폭을 채우고 height(px)만 정한다. fit="fixed"면 width·height 그대로.
 *  색은 --series-1~8만, 상태 의미는 라벨 텍스트가 전한다. 진입 시 1회 그리기 모션(live면 끔).
 *  paused=true면 마지막으로 받은 props 스냅샷을 그대로 그린다(스트림이 흘러도 화면은 멈춤).
 *  stage는 tabIndex=0: ←/→ 로 인덱스 이동, Home/End 양끝, Esc 해제. 숨김 표(bds-sr)가 aria-describedby로 연결된다. */
export function Chart(rawProps) {
  const last = useRef(rawProps);
  if (!rawProps.paused) last.current = rawProps;
  const props = rawProps.paused ? last.current : rawProps;
  const { kind = "line", fit = "flex", width, height, valueFormatter = fmtKo, emptyText = MISSING, showLegend = true, live = false, animate = !live, className, style, "aria-label": ariaLabel } = props;
  const uid = useId().replace(/:/g, "");
  const srId = `${uid}-sr`;
  const ref = useRef(null);
  const [hover, setHover] = useState(null);
  const h = height ?? DEFAULT_H[kind];
  const size = useSize(ref, fit === "fixed" ? Number(width) : undefined, Number(h));
  const anim = useAnimateOnce(animate && !live);
  const w = fit === "fixed" && typeof width === "number" ? width : size.w;
  const lineKind = kind === "line" || kind === "area";
  let body = null, hasData = false, legend = [], count = 0;
  if (showLegend) {
    if (kind === "pie") legend = (props.segments ?? []).map((sg, i) => ({ color: toneVar(sg.tone, i), label: sg.label, value: valueFormatter(Math.max(0, Number(sg.value) || 0)) }));
    else if (kind !== "radial" && (props.series ?? []).length > 1) legend = props.series.map((sr, i) => ({ color: toneVar(sr.tone, i), label: sr.label, shape: lineKind ? "line" : "square", dash: lineKind ? seriesDash(sr, i, props.series.length) : undefined }));
  }
  if (kind === "pie") { hasData = (props.segments ?? []).some((s) => s.value > 0); count = (props.segments ?? []).length; body = <Pie segments={props.segments ?? []} fmt={valueFormatter} caption={props.caption} w={w} h={h} hover={hover} setHover={setHover} />; }
  else if (kind === "radial") { hasData = props.value != null; body = <Radial value={props.value ?? 0} label={props.label} tone={props.tone} fmt={valueFormatter} w={w} h={h} animate={animate && !live} />; }
  else if (kind === "histogram") { const b = histBins(props.samples, props.bins); hasData = !!b; count = b ? b.n : 0; body = <Histogram samples={props.samples ?? []} bins={props.bins} tone={props.tone} percentiles={props.percentiles ?? []} unit={props.unit} fmt={valueFormatter} w={w} h={h} animate={anim} hover={hover} setHover={setHover} />; }
  else if (kind === "radar") { hasData = (props.axes ?? []).length >= 3 && (props.series ?? []).some((s) => props.axes.some((_, i) => s.values[i] != null)); count = (props.axes ?? []).length; body = <Radar axes={props.axes ?? []} series={props.series ?? []} max={props.max} fmt={valueFormatter} w={w} h={h} hover={hover} setHover={setHover} />; }
  else { hasData = (props.labels ?? []).length > 0 && (props.series ?? []).some((s) => s.values.some((v) => v != null)); count = (props.labels ?? []).length; body = <Cartesian kind={kind} labels={props.labels ?? []} series={props.series ?? []} fmt={valueFormatter} uid={uid} xTicks={props.xTicks ?? "auto"} w={w} h={h} thresholds={props.thresholds} stacked={props.stacked} yMin={props.yMin} yMax={props.yMax} hover={hover} setHover={setHover} />; }
  const onKey = (e) => {
    if (!count) return;
    let next;
    if (e.key === "ArrowRight") next = hover == null ? 0 : Math.min(count - 1, hover + 1);
    else if (e.key === "ArrowLeft") next = hover == null ? count - 1 : Math.max(0, hover - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else if (e.key === "Escape") next = null;
    else return;
    e.preventDefault(); setHover(next);
  };
  return (
    <div role="img" aria-label={ariaLabel ?? "차트"} aria-describedby={srId} className={cx("bds-chart", `bds-chart--${kind}`, anim && "bds-chart--animate", className)} style={frameStyle({ fit, width, style })}>
      {hasData ? <div ref={ref} className="bds-chart__stage" style={{ height: h }} tabIndex={0} onKeyDown={onKey} onBlur={() => setHover(null)}>{w > 0 && body}</div> : <div id={srId} className="bds-chart__empty" style={{ height: h }}>{emptyText}</div>}
      {hasData && <SrTable id={srId} kind={kind} props={props} fmt={valueFormatter} />}
      {hasData && legend.length > 0 && <Legend items={legend} compact />}
    </div>
  );
}
