/* Single implementation of the fit contract; every container component routes through frameStyle(). See RULE.md "fit 계약". */

/** Token values are passed as inline custom properties, and React's CSSProperties rejects `--*` keys, so widen it here.
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

/** Attach a forwarded ref alongside an inner one; accepts callback and object refs.
 * @template T @param {import("react").ForwardedRef<T>} ref @param {T | null} el */
export const assignRef = (ref, el) => { if (typeof ref === "function") ref(el); else if (ref) ref.current = el; };

/* Spacing scale shared by Stack·Inline·Spacer: --sp step number (0–10) or a CSS length passed through. */
/** @type {Record<number, string | number>} */
const GAP = { 0: 0, 1: "var(--sp-1)", 2: "var(--sp-2)", 3: "var(--sp-3)", 4: "var(--sp-4)", 5: "var(--sp-5)", 6: "var(--sp-6)", 7: "var(--sp-7)", 8: "var(--sp-8)", 9: "var(--sp-9)", 10: "var(--sp-10)" };
/** @param {number | string | undefined} g */
export const spaceToken = (g) => (typeof g === "number" && GAP[g] !== undefined ? GAP[g] : g);
