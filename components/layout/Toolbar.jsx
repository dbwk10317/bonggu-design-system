import React from "react";
import { cx } from "../core/frame.js";

/** 표 위 도구 줄: 검색(늘어남) + 필터 + 오른쪽 끝 액션. 좁으면 줄바꿈. role="toolbar"는 화살표 이동을 약속하므로 붙이지 않는다(Tab으로 컨트롤 사이를 이동).
 * @param {Parameters<typeof import("./Toolbar.d.ts").Toolbar>[0]} props */
export function Toolbar({ children, end, className, ...rest }) {
  return <div className={cx("bds-toolbar", className)} {...rest}>{children}{end && <div className="bds-toolbar__end">{end}</div>}</div>;
}
/** Toolbar 안에서 늘어나는 슬롯(검색 필드 등).
 * @param {Parameters<typeof import("./Toolbar.d.ts").ToolbarGrow>[0]} props */
export function ToolbarGrow({ children }) { return <div className="bds-toolbar__grow">{children}</div>; }
