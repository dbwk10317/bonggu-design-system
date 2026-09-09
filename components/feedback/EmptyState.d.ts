import type { HTMLAttributes, ReactNode } from "react";
import type { MascotFace } from "../brand/MascotMark";
/**
 * 빈 상태. 봉구 표정으로 톤을 전한다.
 */
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> { title: ReactNode; description?: ReactNode; face?: MascotFace | false; tone?: "default" | "error"; plain?: boolean; actions?: ReactNode }
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
