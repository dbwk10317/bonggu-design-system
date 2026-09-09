import React from "react";
import { cx } from "../core/frame.js";

/** 페이지 제목 + 한 문장 설명 + 오른쪽 액션. 좁으면 액션이 아래로 감싼다. */
export function PageHeader({ title, description, actions, className, ...rest }) {
  return (
    <div className={cx("bds-pagehead", className)} {...rest}>
      <div className="bds-pagehead__text"><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {actions && <div className="bds-pagehead__actions">{actions}</div>}
    </div>
  );
}
