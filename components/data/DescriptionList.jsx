import React from "react";
import { cx } from "../core/frame.js";

/** 설명 목록(dl). 긴 값·문장이 있을 때 KeyValues 대신. 좁으면 한 열로 접힌다.
 * @param {Parameters<typeof import("./DescriptionList.d.ts").DescriptionList>[0]} props */
export function DescriptionList({ items = [], className, ...rest }) {
  return (
    <dl className={cx("bds-dl", className)} {...rest}>
      {items.map((it, i) => <React.Fragment key={i}><dt>{it.term}</dt><dd className={it.mono ? "bds-mono" : undefined}>{it.detail}</dd></React.Fragment>)}
    </dl>
  );
}
