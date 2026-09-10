import React from "react";
import { cx } from "../core/frame.js";
import { MascotMark } from "../brand/MascotMark.jsx";

/** 빈 상태. 봉구 표정으로 톤을 전한다(기본 curious, 오류는 worried). actions에 다음 행동 버튼.
 * @param {Parameters<typeof import("./EmptyState.d.ts").EmptyState>[0]} props */
export function EmptyState({ title, description, face = "curious", tone = "default", plain = false, actions, className, ...rest }) {
  return (
    <div className={cx("bds-empty", plain && "bds-empty--plain", tone === "error" && "bds-empty--error", className)} {...rest}>
      {face && <MascotMark face={tone === "error" && face === "curious" ? "worried" : face} size={36} animated={false} />}
      <div className="bds-empty__t">{title}</div>
      {description && <div className="bds-empty__d">{description}</div>}
      {actions && <div className="bds-empty__a">{actions}</div>}
    </div>
  );
}
