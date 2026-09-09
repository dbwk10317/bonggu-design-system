import React from "react";
import { cx } from "../core/frame.js";

const NOT = "수집 안 됨";
/** 키·값 행 목록. rows: [key, value][] 또는 {k,v,mono?}[]. 수치 값은 mono, 결측 문구는 mono를 벗는다. */
export function KeyValues({ rows = [], lined = false, className, ...rest }) {
  return (
    <div className={cx("bds-kv", lined && "bds-kv--lined", className)} {...rest}>
      {rows.map((r, i) => {
        const [k, v, mono] = Array.isArray(r) ? [r[0], r[1], r[2]] : [r.k, r.v, r.mono];
        const isMono = mono ?? (typeof v === "number" || (typeof v === "string" && v !== NOT && /\d/.test(v)));
        return (
          <div key={i} className="bds-kv__row">
            <span className="bds-kv__k">{k}</span>
            <span className={cx("bds-kv__v bds-ellipsis", isMono && "bds-mono", v === NOT && "bds-kv__v--na")} style={v === NOT ? { color: "var(--text-3)", fontWeight: 400 } : undefined}>{v}</span>
          </div>
        );
      })}
    </div>
  );
}
