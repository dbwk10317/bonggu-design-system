import React from "react";
import { cx } from "../core/frame.js";

/** Page title + one-sentence description + right-side actions; actions wrap below when narrow.
 * @param {Parameters<typeof import("./PageHeader.d.ts").PageHeader>[0]} props */
export function PageHeader({ title, description, actions, className, ...rest }) {
  return (
    <div className={cx("bds-pagehead", className)} {...rest}>
      <div className="bds-pagehead__text"><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {actions && <div className="bds-pagehead__actions">{actions}</div>}
    </div>
  );
}
