import React from "react";
import { cx } from "../core/frame.js";

/** 인라인 코드 조각. 식별자·경로·명령 한 토막. */
export function Code({ children, className, ...rest }) { return <code className={cx("bds-code bds-mono", className)} {...rest}>{children}</code>; }
/** 코드 블록. 여러 줄 명령·JSON. 가로 스크롤, 줄바꿈 안 함. */
export function CodeBlock({ children, language, className, ...rest }) { return <pre className={cx("bds-codeblock bds-mono", className)} data-lang={language} {...rest}><code>{children}</code></pre>; }
/** 키보드 키. */
export function Kbd({ children, className, ...rest }) { return <kbd className={cx("bds-kbd", className)} {...rest}>{children}</kbd>; }
