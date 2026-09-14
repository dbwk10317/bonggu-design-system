import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** Tag for categories and selections. accent is for a single emphasis such as "선택됨"; onRemove adds an x button.
 * @param {Parameters<typeof import("./Tag.d.ts").Tag>[0]} props */
export function Tag({ accent = false, icon, onRemove, className, children, ...rest }) {
  return (
    <span className={cx("bds-tag", accent && "bds-tag--accent", className)} {...rest}>
      {icon && <Icon name={icon} size={12} />}
      {children}
      {onRemove && <button type="button" className="bds-tag__x" aria-label={`${typeof children === "string" ? children + " " : ""}제거`} onClick={onRemove}><Icon name="x" size={10} /></button>}
    </span>
  );
}
