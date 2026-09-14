import React from "react";
import { cx } from "../core/frame.js";

/** Inline code fragment: an identifier, path or short command.
 * @param {Parameters<typeof import("./Code.d.ts").Code>[0]} props */
export function Code({ children, className, ...rest }) { return <code className={cx("bds-code bds-mono", className)} {...rest}>{children}</code>; }
/** Code block for multi-line commands or JSON. Scrolls horizontally, never wraps.
 * @param {Parameters<typeof import("./Code.d.ts").CodeBlock>[0]} props */
export function CodeBlock({ children, language, className, ...rest }) { return <pre className={cx("bds-codeblock bds-mono", className)} data-lang={language} {...rest}><code>{children}</code></pre>; }
/** Keyboard key.
 * @param {Parameters<typeof import("./Code.d.ts").Kbd>[0]} props */
export function Kbd({ children, className, ...rest }) { return <kbd className={cx("bds-kbd", className)} {...rest}>{children}</kbd>; }
