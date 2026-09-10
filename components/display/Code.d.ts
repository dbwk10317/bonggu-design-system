import type { HTMLAttributes, ReactNode } from "react";
/** 인라인 코드(식별자·경로). */
export declare function Code(props: HTMLAttributes<HTMLElement>): ReactNode;
/** 코드 블록(명령·JSON). 줄바꿈하지 않고 가로 스크롤. */
export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> { language?: string }
export declare function CodeBlock(props: CodeBlockProps): ReactNode;
/** 키보드 키 표시. */
export declare function Kbd(props: HTMLAttributes<HTMLElement>): ReactNode;
