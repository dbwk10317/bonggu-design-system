/* fit 계약: 모든 컨테이너형 컴포넌트가 공유하는 크기 규칙.
   fit="flex"  (기본) 부모 폭을 채우고 높이는 내용/비율로 정한다. min-width:0으로 격자에서 찌그러지지 않는다.
   fit="fixed" width/height(px 또는 CSS 길이)를 그대로 쓴다. 내용은 그 상자 안에서 스크롤·축소된다.
   fit="auto"  내용 크기(버튼·pill 같은 컨트롤 기본). */
export function frameStyle({ fit = "flex", width, height, minHeight, style } = {}) {
  const len = (v) => (typeof v === "number" ? `${v}px` : v);
  const out = { minWidth: 0 };
  if (fit === "flex") { out.width = "100%"; if (height != null) out.height = len(height); }
  else if (fit === "fixed") { if (width != null) out.width = len(width); if (height != null) out.height = len(height); out.flex = "none"; }
  else if (fit === "auto") { out.width = width != null ? len(width) : "auto"; if (height != null) out.height = len(height); }
  if (minHeight != null) out.minHeight = len(minHeight);
  return { ...out, ...style };
}
export const cx = (...a) => a.filter(Boolean).join(" ");
