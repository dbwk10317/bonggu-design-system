import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 태그. 분류·선택 표시. accent는 "선택됨" 같은 강조 하나에만. onRemove가 있으면 x 버튼. */
export function Tag({ accent = false, icon, onRemove, className, children, ...rest }) {
  return (
    <span className={cx("bds-tag", accent && "bds-tag--accent", className)} {...rest}>
      {icon && <Icon name={icon} size={12} />}
      {children}
      {onRemove && <button type="button" className="bds-tag__x" aria-label={`${typeof children === "string" ? children + " " : ""}제거`} onClick={onRemove}><Icon name="x" size={10} /></button>}
    </span>
  );
}
