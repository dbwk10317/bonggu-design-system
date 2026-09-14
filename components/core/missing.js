/* Single source of the missing-value contract (see RULE.md "설계 원칙").
   The string comparison lives only here, so changing the text moves detection and display together. */
export const MISSING_TEXT = "수집 안 됨";
/** Styled in exactly one block of styles/c-data.css. */
export const MISSING_CLASS = "bds-na";
/** @param {unknown} v */
export const isMissing = (v) => v == null || v === MISSING_TEXT || (typeof v === "number" && Number.isNaN(v));
/** Gate for values entering calculations: non-finite becomes null; 0 and negatives are values. */
/** @param {unknown} v @returns {number | null} */
export const numeric = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
