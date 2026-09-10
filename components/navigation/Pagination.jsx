import React from "react";
import { cx } from "../core/frame.js";
import { IconButton } from "../action/IconButton.jsx";

/** 페이지 번호. page는 1부터. total은 총 페이지 수. info에 "1–20 / 184" 같은 범위를 준다.
 * @param {Parameters<typeof import("./Pagination.d.ts").Pagination>[0]} props */
export function Pagination({ page = 1, total = 1, onChange, siblings = 1, info, size = "sm", className, ...rest }) {
  /** @type {(number | string)[]} */
  const pages = [];
  const push = (/** @type {number | string} */ p) => pages.push(p);
  const lo = Math.max(2, page - siblings), hi = Math.min(total - 1, page + siblings);
  push(1); if (lo > 2) push("…"); for (let p = lo; p <= hi; p++) push(p); if (hi < total - 1) push("…"); if (total > 1) push(total);
  return (
    <nav aria-label="페이지" className={cx("bds-pager", className)} {...rest}>
      <IconButton icon="caret-left" size={size} variant="ghost" aria-label="이전 페이지" disabled={page <= 1} onClick={() => onChange?.(page - 1)} />
      {pages.map((p, i) => p === "…" ? <span key={"g" + i} className="bds-pager__gap" aria-hidden="true">…</span>
        : <button key={p} type="button" className="bds-pager__pg" aria-current={p === page ? "page" : undefined} onClick={() => onChange?.(p)}>{p}</button>)}
      <IconButton icon="caret-right" size={size} variant="ghost" aria-label="다음 페이지" disabled={page >= total} onClick={() => onChange?.(page + 1)} />
      {info && <span className="bds-pager__info">{info}</span>}
    </nav>
  );
}
