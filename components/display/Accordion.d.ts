import type { HTMLAttributes, ReactNode } from "react";
export interface AccordionItem { id: string; title: ReactNode; meta?: ReactNode; icon?: string; content: ReactNode; }
export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  /** 테두리 없음(Panel 안) */
  plain?: boolean;
}
export declare function Accordion(props: AccordionProps): ReactNode;
