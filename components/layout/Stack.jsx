import React from "react";
import { cx, spaceToken } from "../core/frame.js";


/** Vertical stack. gap is an --sp step (1–10) or CSS length; align/justify are flex values; as changes the tag.
 * @param {Parameters<typeof import("./Stack.d.ts").Stack>[0]} props */
export function Stack({ gap = 4, align, justify, as: Tag = "div", className, style, children, ...rest }) {
  return <Tag className={cx("bds-vstack", className)} style={{ gap: spaceToken(gap), alignItems: align, justifyContent: justify, ...style }} {...rest}>{children}</Tag>;
}
