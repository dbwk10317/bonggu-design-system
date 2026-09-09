/* 차트 공용 계산. 렌더와 분리해 테스트·재사용 가능하게 둔다. */
export const r1 = (n) => Math.round(n * 10) / 10;
/* 범주형 8색. tone에 문자열("rx","tx","used","reserved","free")을 주면 의미 고정 쌍을 쓴다. */
const METER = { ok: 1, warn: 1, crit: 1 };
export const toneVar = (tone, i) => typeof tone === "string" ? (METER[tone] ? `var(--meter-${tone})` : `var(--series-${tone})`) : `var(--series-${tone ?? ((i % 8) + 1)})`;
/* 미터 톤이면 값 텍스트도 같은 상태 잉크로 */
export const toneInk = (tone) => (typeof tone === "string" && METER[tone] ? `var(--${tone}-ink)` : undefined);
export const fmtKo = (v) => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString("ko-KR") : Number.isInteger(v) ? String(v) : v.toFixed(1));

/** 보기 좋은 축 눈금: 데이터 범위를 1·2·5×10^n 간격으로 나눈다. */
export function niceTicks(lo, hi, count = 4) {
  if (lo === hi) { hi = lo === 0 ? 1 : lo * 1.2; lo = lo === 0 ? 0 : lo * 0.8; }
  const span = hi - lo, raw = span / count, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag, step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.floor(lo / step) * step, end = Math.ceil(hi / step) * step;
  const ticks = []; for (let v = start; v <= end + step / 2; v += step) ticks.push(r1(v));
  return { ticks, lo: start, hi: end };
}

/** Catmull-Rom → 베지어. 두 점이면 직선. */
export function smoothPath(pts, tension = 0.18) {
  if (pts.length < 3) return pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) * tension)} ${r1(p1[1] + (p2[1] - p0[1]) * tension)}, ${r1(p2[0] - (p3[0] - p1[0]) * tension)} ${r1(p2[1] - (p3[1] - p1[1]) * tension)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** null 구간에서 끊은 점 배열들. */
export function runsOf(values, x, y) {
  const runs = []; let run = [];
  values.forEach((v, i) => { if (v == null) { if (run.length) runs.push(run); run = []; } else run.push([x(i), y(v)]); });
  if (run.length) runs.push(run);
  return runs;
}

export function pathLength(pts) { let l = 0; for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return l * 1.15; }

/** 텍스트 폭 추정(mono 10.5px ≈ 6.4px/char). y축 여백 계산용. */
export const estWidth = (s) => String(s).length * 6.4 + 10;

/** 3계열 이상이면 선 스타일을 실선·대시·점·대시점 순으로 돌린다. series.dash로 명시(문자열=그 패턴, false=실선). */
export const DASHES = ["", "6 4", "2 4", "8 3 2 3"];
export const seriesDash = (s, i, count) => s.dash === false ? undefined : typeof s.dash === "string" ? (s.dash || undefined) : count >= 3 ? (DASHES[i % DASHES.length] || undefined) : undefined;

/** 히스토그램 구간. 표본 2개 미만이면 null. n은 bins 또는 √n(6~30). */
export function histBins(samples, bins) {
  const xs = (samples ?? []).filter((v) => v != null && Number.isFinite(v));
  if (xs.length < 2) return null;
  const lo = Math.min(...xs), hi = Math.max(...xs), span = hi - lo || 1;
  const n = bins ?? Math.max(6, Math.min(30, Math.round(Math.sqrt(xs.length))));
  const counts = Array(n).fill(0); xs.forEach((v) => { counts[Math.min(n - 1, Math.floor(((v - lo) / span) * n))]++; });
  return { xs, lo, hi, span, n, counts };
}
