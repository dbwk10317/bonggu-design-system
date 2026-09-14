import React from "react";
import { cx } from "../core/frame.js";

/** Centered max-width container: --content-max 1440 by default, 760 with narrow (settings and form pages). pad adds horizontal --page-pad.
 * @param {Parameters<typeof import("./Container.d.ts").Container>[0]} props */
export function Container({ narrow = false, pad = false, className, children, ...rest }) {
  return <div className={cx("bds-container", narrow && "bds-container--narrow", pad && "bds-container--pad", className)} {...rest}>{children}</div>;
}
