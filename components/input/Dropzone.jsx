import React, { useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 파일 드롭존. 클릭/드롭/키보드로 파일을 받아 onFiles(File[])를 호출한다. */
export function Dropzone({ accept, multiple = false, onFiles, title = "파일을 끌어다 놓거나 클릭해서 선택", hint, icon = "upload-simple", fit = "flex", width, height, disabled, className, style, ...rest }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const emit = (list) => { const files = Array.from(list ?? []); if (files.length) onFiles?.(multiple ? files : files.slice(0, 1)); };
  return (
    <div role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled || undefined}
      className={cx("bds-drop", over && "bds-drop--over", className)} style={frameStyle({ fit, width, height, style })}
      onClick={() => !disabled && input.current?.click()}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) emit(e.dataTransfer.files); }} {...rest}>
      <Icon name={icon} />
      <b>{title}</b>
      {hint && <small>{hint}</small>}
      <input ref={input} type="file" accept={accept} multiple={multiple} onChange={(e) => { emit(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
