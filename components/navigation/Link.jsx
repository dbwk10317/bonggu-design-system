import React from "react";
import { cx } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** Text link. external adds the icon and rel automatically; quiet uses the body text color.
 * @param {Parameters<typeof import("./Link.d.ts").Link>[0]} props */
export function Link({ href, external = false, quiet = false, className, children, ...rest }) {
  return <a href={href} className={cx("bds-link", quiet && "bds-link--quiet", className)} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...rest}>{children}{external && <Icon name="arrow-square-out" size={12} label="새 창에서 열림" />}</a>;
}
