import React from "react";
import { cx } from "../core/frame.js";

/** Viewport-step visibility: above="md" shows at 768 and up, below="md" under 768. Creates no layout box (display:contents).
 * @param {Parameters<typeof import("./Visible.d.ts").Visible>[0]} props */
export function Visible({ above, below, className, children }) {
  return <div className={cx("bds-visible", above && "bds-hide-" + above, below && "bds-only-" + below, className)}>{children}</div>;
}
