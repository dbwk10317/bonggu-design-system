import React from "react";
import { cx } from "../core/frame.js";
import { MascotMark } from "../brand/MascotMark.jsx";
import { Button } from "../action/Button.jsx";

/** 영역 실패 상태(ErrorBoundary fallback·요청 실패). 마스코트 crying + 제목 + 원인 + 다시 시도. 빈 결과는 EmptyState.
 * @param {Parameters<typeof import("./ErrorState.d.ts").ErrorState>[0]} props */
export function ErrorState({ title = "불러오지 못했습니다", description, code, onRetry, retryLabel = "다시 시도", actions, mascot = true, className, ...rest }) {
  return (
    <div className={cx("bds-errstate", className)} role="alert" {...rest}>
      {mascot && <MascotMark face="crying" size={40} animated={false} />}
      <div className="bds-errstate__t">{title}</div>
      {description && <p className="bds-errstate__d">{description}</p>}
      {code && <code className="bds-errstate__code">{code}</code>}
      {(onRetry || actions) && <div className="bds-errstate__a">{onRetry && <Button size="sm" variant="secondary" icon="arrow-clockwise" onClick={onRetry}>{retryLabel}</Button>}{actions}</div>}
    </div>
  );
}
