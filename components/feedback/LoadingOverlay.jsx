import React from "react";
import { cx } from "../core/frame.js";
import { Spinner } from "./Spinner.jsx";

/** 영역 위 로딩 덮개. children이 있으면 그 영역을 감싸고 active일 때 덮는다. fixed는 전체 화면(라우트 전환·긴 저장). */
export function LoadingOverlay({ active = true, label = "불러오는 중", fixed = false, className, children }) {
  const layer = active && <div className={cx("bds-loading", fixed && "bds-loading--fixed")} role="status" aria-live="polite" aria-busy="true"><div className="bds-loading__box"><Spinner size={22} /><span>{label}</span></div></div>;
  if (!children) return layer || null;
  return <div className={cx("bds-loadwrap", className)} aria-busy={active || undefined}>{children}{layer}</div>;
}
