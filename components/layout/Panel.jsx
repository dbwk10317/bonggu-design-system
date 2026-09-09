import React from "react";
import { cx, frameStyle } from "../core/frame.js";

/** 카드/패널. 층 구분은 보더, 그림자는 최소. caption은 상단 소문자 캡션. interactive면 호버 상승, selected면 악센트 링. */
export function Panel({ caption, padding = "md", sunken = false, interactive = false, selected = false, enter = false, as: Tag = "div", fit = "flex", width, height, className, style, children, ...rest }) {
  return (
    <Tag className={cx("bds-panel", padding !== "md" && `bds-panel--${padding}`, sunken && "bds-panel--sunken", interactive && "bds-panel--interactive", selected && "bds-panel--selected", enter && "bds-panel--enter", className)}
      style={frameStyle({ fit, width, height, style })} {...rest}>
      {caption && <span className="bds-panel__cap">{caption}</span>}
      {children}
    </Tag>
  );
}
