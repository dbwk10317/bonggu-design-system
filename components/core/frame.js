/* fit 계약: 모든 컨테이너형 컴포넌트가 공유하는 크기 규칙.
   fit="flex"  (기본) 부모 폭을 채우고 높이는 내용/비율로 정한다. min-width:0으로 격자에서 찌그러지지 않는다.
   fit="fixed" width/height(px 또는 CSS 길이)를 그대로 쓴다. 내용은 그 상자 안에서 스크롤·축소된다.
   fit="auto"  내용 크기(버튼·pill 같은 컨트롤 기본). */

/** 이 시스템은 토큰 값을 인라인 커스텀 속성으로 넘긴다. React의 CSSProperties는 `--*` 키를 받지 않아 여기서 함께 선언한다.
 * @typedef {import("react").CSSProperties & Partial<Record<`--${string}`, string | number>>} DSStyle */
/** @typedef {"flex" | "fixed" | "auto"} Fit */
/** @typedef {number | string} Length */

/**
 * @param {{ fit?: Fit, width?: Length, height?: Length, minHeight?: Length, style?: DSStyle }} [props]
 * @returns {DSStyle}
 */
export function frameStyle({ fit = "flex", width, height, minHeight, style } = {}) {
  /** @param {Length | undefined} v */
  const len = (v) => (typeof v === "number" ? `${v}px` : v);
  /** @type {DSStyle} */
  const out = { minWidth: 0 };
  if (fit === "flex") { out.width = "100%"; if (height != null) out.height = len(height); }
  else if (fit === "fixed") { if (width != null) out.width = len(width); if (height != null) out.height = len(height); out.flex = "none"; }
  else if (fit === "auto") { out.width = width != null ? len(width) : "auto"; if (height != null) out.height = len(height); }
  if (minHeight != null) out.minHeight = len(minHeight);
  return { ...out, ...style };
}

/** @param {...(string | false | null | undefined)} a */
export const cx = (...a) => a.filter(Boolean).join(" ");

/* 간격 계약: gap·size는 --sp 단계 번호(0~10) 또는 CSS 길이 그대로. Stack·Inline·Spacer가 공유한다. */
/** @type {Record<number, string | number>} */
const GAP = { 0: 0, 1: "var(--sp-1)", 2: "var(--sp-2)", 3: "var(--sp-3)", 4: "var(--sp-4)", 5: "var(--sp-5)", 6: "var(--sp-6)", 7: "var(--sp-7)", 8: "var(--sp-8)", 9: "var(--sp-9)", 10: "var(--sp-10)" };
/** @param {number | string | undefined} g */
export const spaceToken = (g) => (typeof g === "number" && GAP[g] !== undefined ? GAP[g] : g);
