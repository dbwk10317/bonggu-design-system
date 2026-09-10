/* 차트 공용 계산. 렌더와 분리해 테스트·재사용 가능하게 둔다.
   내보내는 함수는 어떤 입력에도 유한한 결과나 null만 낸다. 결측 판정은 core/missing.js의 numeric 하나를 쓴다.
   타입은 공개 Chart.d.ts의 것을 그대로 쓴다. 같은 모양을 여기 다시 적지 않는다. */
import { numeric } from "../core/missing.js";

/** @typedef {import("./Chart.d.ts").ChartTone} ChartTone */
/** @typedef {import("./Chart.d.ts").ChartSeries} ChartSeries */
/** @typedef {[number, number]} Point 픽셀 좌표 */

/** @param {number} n */
export const r1 = (n) => Math.round(n * 10) / 10;
/* 범주형 8색. tone에 문자열("rx","tx","used","reserved","free")을 주면 의미 고정 쌍을 쓴다. */
/** @type {Record<string, 1>} */
const METER = { ok: 1, warn: 1, crit: 1 };
/** @param {ChartTone | undefined} tone @param {number} [i] */
export const toneVar = (tone, i) => typeof tone === "string" ? (METER[tone] ? `var(--meter-${tone})` : `var(--series-${tone})`) : `var(--series-${tone ?? (((i ?? 0) % 8) + 1)})`;
/* 미터 톤이면 값 텍스트도 같은 상태 잉크로 */
/** @param {ChartTone | undefined} tone */
export const toneInk = (tone) => (typeof tone === "string" && METER[tone] ? `var(--${tone}-ink)` : undefined);
/** @param {number} v */
export const fmtKo = (v) => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString("ko-KR") : Number.isInteger(v) ? String(v) : v.toFixed(1));

/** 보기 좋은 축 눈금: 데이터 범위를 1·2·5×10^n 간격으로 나눈다.
 * @param {number} lo @param {number} hi @param {number} [count]
 * @returns {{ ticks: number[], lo: number, hi: number }} */
export function niceTicks(lo, hi, count = 4) {
  if (lo === hi) { const pad = Math.abs(lo) * 0.2 || 1; hi = lo + pad; lo = lo === 0 ? 0 : lo - pad; }
  const span = hi - lo, raw = span / count, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag, step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.floor(lo / step) * step, end = Math.ceil(hi / step) * step;
  // 데이터 눈금은 픽셀 좌표용 r1로 반올림하지 않는다. 인덱스로 생성해 누적 오차도 피한다.
  const ticks = Array.from({ length: Math.round((end - start) / step) + 1 }, (_, i) => Number((start + i * step).toPrecision(15)));
  return { ticks, lo: start, hi: end };
}

/** 누적 막대: 양수와 음수를 각각 0에서 쌓는다. null은 구간을 만들거나 합계에 기여하지 않는다.
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

/** Catmull-Rom → 베지어. 두 점이면 직선.
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

/** 결측 구간에서 끊은 점 배열들.
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

/** 텍스트 폭 추정(mono 10.5px ≈ 6.4px/char). y축 여백 계산용.
 * @param {unknown} s */
export const estWidth = (s) => String(s).length * 6.4 + 10;

/** 3계열 이상이면 선 스타일을 실선·대시·점·대시점 순으로 돌린다. series.dash로 명시(문자열=그 패턴, false=실선). */
export const DASHES = ["", "6 4", "2 4", "8 3 2 3"];
/** @param {ChartSeries} s @param {number} i @param {number} count */
export const seriesDash = (s, i, count) => s.dash === false ? undefined : typeof s.dash === "string" ? (s.dash || undefined) : count >= 3 ? (DASHES[i % DASHES.length] || undefined) : undefined;

/** 히스토그램 구간. 표본 2개 미만이면 null. n은 bins 또는 √n(6~30).
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
