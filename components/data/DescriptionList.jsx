import React from "react";
import { cx } from "../core/frame.js";

/** Description list (dl). Use instead of KeyValues for long values or sentences; collapses to one column when narrow.
 * @param {Parameters<typeof import("./DescriptionList.d.ts").DescriptionList>[0]} props */
export function DescriptionList({ items = [], className, ...rest }) {
  return (
    <dl className={cx("bds-dl", className)} {...rest}>
      {items.map((it, i) => <React.Fragment key={i}><dt>{it.term}</dt><dd className={it.mono ? "bds-mono" : undefined}>{it.detail}</dd></React.Fragment>)}
    </dl>
  );
}
