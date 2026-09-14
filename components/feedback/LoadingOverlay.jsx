import React from "react";
import { cx } from "../core/frame.js";
import { Spinner } from "./Spinner.jsx";

/** Loading overlay for a region. With children it wraps them and covers them while active; fixed covers the whole screen (route changes, long saves).
 * @param {Parameters<typeof import("./LoadingOverlay.d.ts").LoadingOverlay>[0]} props */
export function LoadingOverlay({ active = true, label = "불러오는 중", fixed = false, className, children }) {
  const layer = active && <div className={cx("bds-loading", fixed && "bds-loading--fixed")} role="status" aria-live="polite" aria-busy="true"><div className="bds-loading__box"><Spinner size={22} /><span>{label}</span></div></div>;
  if (!children) return layer || null;
  return <div className={cx("bds-loadwrap", className)} aria-busy={active || undefined}>{children}{layer}</div>;
}
