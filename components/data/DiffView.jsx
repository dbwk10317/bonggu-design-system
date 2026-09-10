import React from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 필드 단위 변경 비교(Revision diff). changes: {field, from, to, kind?: changed|added|removed}. 값은 mono.
 * @param {Parameters<typeof import("./DiffView.d.ts").DiffView>[0]} props */
export function DiffView({ changes = [], from, to, emptyText = "변경된 항목이 없습니다", fit = "flex", width, "aria-label": ariaLabel, className, style }) {
  return (
    <div className={cx("bds-diff", className)} aria-label={ariaLabel} style={frameStyle({ fit, width, style })}>
      {(from || to) && <div className="bds-diff__hd bds-mono"><span>{from}</span><span aria-hidden="true">→</span><span>{to}</span></div>}
      {!changes.length ? <p className="bds-diff__empty">{emptyText}</p> : (
        <ul className="bds-diff__list">
          {changes.map((c, i) => { const kind = c.kind ?? (c.from == null ? "added" : c.to == null ? "removed" : "changed"); return (
            <li key={i} className={cx("bds-diff__row", `bds-diff__row--${kind}`)}>
              <span className="bds-diff__f bds-mono">{c.field}</span>
              <span className="bds-diff__vals">
                {c.from != null && <del className="bds-mono">{String(c.from)}</del>}
                {c.to != null && <ins className="bds-mono">{String(c.to)}</ins>}
              </span>
            </li>
          ); })}
        </ul>
      )}
    </div>
  );
}
