/* 결측 계약의 단일 출처. 판정 규칙과 근거는 readme.md에 있다.
   문자열 비교가 이 파일 한 곳에만 있으므로 문구를 바꾸면 판정과 표기가 함께 움직인다. */
export const MISSING_TEXT = "수집 안 됨";
/** 표기 스타일 선언은 styles/c-data.css의 한 블록에만 있다. */
export const MISSING_CLASS = "bds-na";
/** @param {unknown} v */
export const isMissing = (v) => v == null || v === MISSING_TEXT || (typeof v === "number" && Number.isNaN(v));
/** 계산에 들어갈 값의 경계. 유한한 수가 아니면 결측(null)으로 만든다. 0과 음수는 값이다. */
/** @param {unknown} v @returns {number | null} */
export const numeric = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
