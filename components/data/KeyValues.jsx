import React from "react";
import { cx } from "../core/frame.js";
import { MISSING_CLASS, MISSING_TEXT, isMissing } from "../core/missing.js";

/** 키·값 행 목록. rows: [key, value][] 또는 {k,v,mono?}[]. 수치 값은 mono, 결측 값은 "수집 안 됨"으로 그리고 mono를 벗는다.
 * @param {Parameters<typeof import("./KeyValues.d.ts").KeyValues>[0]} props */
export function KeyValues({ rows = [], lined = false, className, ...rest }) {
  return (
    <div className={cx("bds-kv", lined && "bds-kv--lined", className)} {...rest}>
      {rows.map((r, i) => {
        const [k, v, mono] = Array.isArray(r) ? [r[0], r[1], r[2]] : [r.k, r.v, r.mono];
        const na = isMissing(v);
        const isMono = mono ?? (!na && (typeof v === "number" || (typeof v === "string" && /\d/.test(v))));
        return (
          <div key={i} className="bds-kv__row">
            <span className="bds-kv__k">{k}</span>
            <span className={cx("bds-kv__v bds-ellipsis", isMono && "bds-mono", na && MISSING_CLASS)} title={na ? MISSING_TEXT : typeof v === "string" || typeof v === "number" ? String(v) : undefined}>{na ? MISSING_TEXT : v}</span>
          </div>
        );
      })}
    </div>
  );
}
