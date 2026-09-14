import React from "react";
import { cx } from "../core/frame.js";

/** Phosphor Bold icon; name is the Phosphor icon name (kebab-case, e.g. "bell", "gear-six").
 *  React projects may use the same icon from @phosphor-icons/react with weight="bold". Decorative icons are aria-hidden. See RULE.md "ICONOGRAPHY".
 * @param {Parameters<typeof import("./Icon.d.ts").Icon>[0]} props
 */
export function Icon({ name, size = 16, label, className, style, ...rest }) {
  return <i className={cx("bds-icon", "ph-bold", `ph-${name}`, className)} style={{ "--icon-size": `${size}px`, ...style }}
    aria-hidden={label ? undefined : true} aria-label={label} role={label ? "img" : undefined} {...rest} />;
}
