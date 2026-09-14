import React, { forwardRef, useRef, useState } from "react";
import { cx, frameStyle } from "../core/frame.js";
import { Icon } from "../action/Icon.jsx";

/** 파일 드롭존. 클릭/드롭/키보드로 파일을 받아 onFiles(File[])를 호출한다. */
export const Dropzone = forwardRef(
  /**
   * @param {import("./Dropzone.d.ts").DropzoneProps} props
   * @param {import("react").ForwardedRef<HTMLDivElement>} ref
   */
  function Dropzone({ accept, multiple = false, onFiles, title = "파일을 끌어다 놓거나 클릭해서 선택", hint, icon = "upload-simple", fit = "flex", width, height, disabled, className, style, ...rest }, ref) {
  const input = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [over, setOver] = useState(false);
  const emit = (/** @type {FileList | File[] | null | undefined} */ list) => { const files = Array.from(list ?? []); if (files.length) onFiles?.(multiple ? files : files.slice(0, 1)); };
  return (
    <div ref={ref} role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled || undefined}
      className={cx("bds-drop", over && "bds-drop--over", className)} style={frameStyle({ fit, width, height, style })}
      onClick={() => !disabled && input.current?.click()}
      onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); input.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) emit(e.dataTransfer.files); }} {...rest}>
      <Icon name={icon} />
      <b>{title}</b>
      {hint && <small>{hint}</small>}
      <input ref={input} type="file" accept={accept} multiple={multiple} onChange={(e) => { emit(e.target.files); e.target.value = ""; }} />
    </div>
  );
});
