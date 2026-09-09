import React, { cloneElement, useId, useState } from "react";
import { cx } from "../core/frame.js";

/** 범용 툴팁. 자식 하나를 감싸 hover/focus에 content를 보인다. 잘린 텍스트·아이콘 버튼 설명용. 상호작용 요소는 넣지 않는다. */
export function Tooltip({ content, side = "top", delay = 300, children, className }) {
  const [open, setOpen] = useState(false);
  const id = useId().replace(/:/g, "");
  let t;
  const show = () => { clearTimeout(t); t = setTimeout(() => setOpen(true), delay); };
  const hide = () => { clearTimeout(t); setOpen(false); };
  const child = React.Children.only(children);
  return (
    <span className={cx("bds-tipwrap", className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {cloneElement(child, { "aria-describedby": open ? id : child.props["aria-describedby"] })}
      {open && content != null && <span role="tooltip" id={id} className={cx("bds-tip", `bds-tip--${side}`)}>{content}</span>}
    </span>
  );
}
