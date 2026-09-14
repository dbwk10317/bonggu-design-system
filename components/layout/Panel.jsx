import React from "react";
import { cx, frameStyle } from "../core/frame.js";

/** Card / panel. caption is the small top caption; interactive adds hover lift (visual only), selected adds the accent ring.
 * @param {Parameters<typeof import("./Panel.d.ts").Panel>[0]} props */
export function Panel({ caption, padding = "md", sunken = false, interactive = false, selected = false, enter = false, as: Tag = "div", fit = "flex", width, height, className, style, children, ...rest }) {
  return (
    <Tag className={cx("bds-panel", padding !== "md" && `bds-panel--${padding}`, sunken && "bds-panel--sunken", interactive && "bds-panel--interactive", selected && "bds-panel--selected", enter && "bds-panel--enter", className)}
      style={frameStyle({ fit, width, height, style })} {...rest}>
      {caption && <span className="bds-panel__cap">{caption}</span>}
      {children}
    </Tag>
  );
}
