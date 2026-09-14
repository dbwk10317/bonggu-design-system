import React from "react";
import { cx } from "../core/frame.js";

/** Tool row above a table: search (grows) + filters + end actions; wraps when narrow. No role="toolbar": that role promises arrow-key navigation, and controls here move with Tab.
 * @param {Parameters<typeof import("./Toolbar.d.ts").Toolbar>[0]} props */
export function Toolbar({ children, end, className, ...rest }) {
  return <div className={cx("bds-toolbar", className)} {...rest}>{children}{end && <div className="bds-toolbar__end">{end}</div>}</div>;
}
/** Growing slot inside a Toolbar (search field etc.).
 * @param {Parameters<typeof import("./Toolbar.d.ts").ToolbarGrow>[0]} props */
export function ToolbarGrow({ children }) { return <div className="bds-toolbar__grow">{children}</div>; }
