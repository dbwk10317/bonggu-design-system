/* Shared chart math, kept out of render so it can be tested and reused.
   Every export returns a finite result or null for any input; missing detection is core/missing.js numeric() only.
   Types come from the public Chart.d.ts; the same shapes are not redeclared here. */
import { numeric } from "../core/missing.js";

/** @typedef {import("./Chart.d.ts").ChartTone} ChartTone */
/** @typedef {import("./Chart.d.ts").ChartSeries} ChartSeries */
/** @typedef {[number, number]} Point Pixel coordinate */

/** @param {number} n */
export const r1 = (n) => Math.round(n * 10) / 10;
/* 8 categorical colors; a string tone ("rx","tx","used","reserved","free") selects a fixed semantic pair. */
/** @type {Record<string, 1>} */
const METER = { ok: 1, warn: 1, crit: 1 };
/** @param {ChartTone | undefined} tone @param {number} [i] */
export const toneVar = (tone, i) => typeof tone === "string" ? (METER[tone] ? `var(--meter-${tone})` : `var(--series-${tone})`) : `var(--series-${tone ?? (((i ?? 0) % 8) + 1)})`;
/* Meter tones color the value text with the matching state ink */
/** @param {ChartTone | undefined} tone */
export const toneInk = (tone) => (typeof tone === "string" && METER[tone] ? `var(--${tone}-ink)` : undefined);
/** @param {number} v */
export const fmtKo = (v) => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString("ko-KR") : Number.isInteger(v) ? String(v) : v.toFixed(1));

/** Nice axis ticks: split the data range at 1·2·5×10^n steps.
 * @param {number} lo @param {number} hi @param {number} [count]
 * @returns {{ ticks: number[], lo: number, hi: number }} */
export function niceTicks(lo, hi, count = 4) {
  if (lo === hi) { const pad = Math.abs(lo) * 0.2 || 1; hi = lo + pad; lo = lo === 0 ? 0 : lo - pad; }
  const span = hi - lo, raw = span / count, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag, step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.floor(lo / step) * step, end = Math.ceil(hi / step) * step;
  // Data ticks are not rounded with the pixel-space r1; generating by index also avoids accumulated float error.
  const ticks = Array.from({ length: Math.round((end - start) / step) + 1 }, (_, i) => Number((start + i * step).toPrecision(15)));
  return { ticks, lo: start, hi: end };
}

/** Stacked bars: positives and negatives each stack from 0. null makes no band and adds nothing to the totals.
 * @param {ChartSeries[]} series @param {number} count
 * @returns {{ bands: ({ start: number, end: number } | null)[][], lo: number, hi: number }} */
export function stackBars(series, count) {
  const positive = Array(count).fill(0), negative = Array(count).fill(0);
  const bands = series.map((s) => Array.from({ length: count }, (_, i) => {
    const value = numeric(s.values[i]);
    if (value == null) return null;
    const totals = value < 0 ? negative : positive, start = totals[i];
    totals[i] += value;
    return { start, end: totals[i] };
  }));
  return { bands, lo: Math.min(0, ...negative), hi: Math.max(0, ...positive) };
}

/** Catmull-Rom → cubic Bézier. Two points fall back to a straight line.
 * @param {Point[]} pts @param {number} [tension] */
export function smoothPath(pts, tension = 0.18) {
  if (pts.length < 3) return pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) * tension)} ${r1(p1[1] + (p2[1] - p0[1]) * tension)}, ${r1(p2[0] - (p3[0] - p1[0]) * tension)} ${r1(p2[1] - (p3[1] - p1[1]) * tension)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** Point runs, split at missing values.
 * @param {(number | null)[]} values @param {(i: number) => number} x @param {(v: number) => number} y
 * @returns {Point[][]} */
export function runsOf(values, x, y) {
  /** @type {Point[][]} */
  const runs = [];
  /** @type {Point[]} */
  let run = [];
  values.forEach((raw, i) => { const v = numeric(raw); if (v == null) { if (run.length) runs.push(run); run = []; } else run.push([x(i), y(v)]); });
  if (run.length) runs.push(run);
  return runs;
}

/** @param {Point[]} pts */
export function pathLength(pts) { let l = 0; for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return l * 1.15; }

/** Text width estimate (mono 10.5px ≈ 6.4px/char) for the y-axis gutter.
 * @param {unknown} s */
export const estWidth = (s) => String(s).length * 6.4 + 10;

/** With 3+ series, line styles cycle solid · dash · dot · dash-dot. series.dash overrides (string = that pattern, false = solid). */
export const DASHES = ["", "6 4", "2 4", "8 3 2 3"];
/** @param {ChartSeries} s @param {number} i @param {number} count */
export const seriesDash = (s, i, count) => s.dash === false ? undefined : typeof s.dash === "string" ? (s.dash || undefined) : count >= 3 ? (DASHES[i % DASHES.length] || undefined) : undefined;

/** Histogram bins. null with fewer than 2 samples. n is bins or √samples clamped to 6–30.
 * @param {(number | null)[] | undefined} samples @param {number} [bins]
 * @returns {{ xs: number[], lo: number, hi: number, span: number, n: number, counts: number[] } | null} */
export function histBins(samples, bins) {
  const xs = /** @type {number[]} */ ((samples ?? []).map(numeric).filter((v) => v != null));
  if (xs.length < 2) return null;
  const lo = Math.min(...xs), hi = Math.max(...xs), span = hi - lo || 1;
  const n = bins ?? Math.max(6, Math.min(30, Math.round(Math.sqrt(xs.length))));
  const counts = Array(n).fill(0); xs.forEach((v) => { counts[Math.min(n - 1, Math.floor(((v - lo) / span) * n))]++; });
  return { xs, lo, hi, span, n, counts };
}
