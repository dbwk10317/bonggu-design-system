import type { HTMLAttributes, ReactNode } from "react";
/** Inline code (identifiers, paths). */
export declare function Code(props: HTMLAttributes<HTMLElement>): ReactNode;
/** Code block (commands, JSON). No wrapping; scrolls horizontally. */
export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> { language?: string }
export declare function CodeBlock(props: CodeBlockProps): ReactNode;
/** Keyboard key. */
export declare function Kbd(props: HTMLAttributes<HTMLElement>): ReactNode;
