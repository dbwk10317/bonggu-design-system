import React from "react";
import { cx } from "../core/frame.js";

/** 최대 폭 중앙 정렬 컨테이너. 기본 --content-max 1440, narrow는 760(설정·폼 페이지). pad는 좌우 --gutter. */
export function Container({ narrow = false, pad = false, className, children, ...rest }) {
  return <div className={cx("bds-container", narrow && "bds-container--narrow", pad && "bds-container--pad", className)} {...rest}>{children}</div>;
}
