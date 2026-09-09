import React from "react";
import { cx } from "../core/frame.js";

/** Phosphor Bold 아이콘. name은 Phosphor 아이콘 이름(kebab-case, 예: "bell", "gear-six").
 *  리액트 프로젝트에서는 @phosphor-icons/react의 동일 아이콘을 weight="bold"로 쓴다. 장식 아이콘은 aria-hidden. */
export function Icon({ name, size = 16, label, className, style, ...rest }) {
  return <i className={cx("bds-icon", "ph-bold", `ph-${name}`, className)} style={{ "--icon-size": `${size}px`, ...style }}
    aria-hidden={label ? undefined : true} aria-label={label} role={label ? "img" : undefined} {...rest} />;
}
