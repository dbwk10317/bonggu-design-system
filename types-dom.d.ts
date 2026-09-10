// 이 시스템은 토큰 값을 인라인 커스텀 속성(`style={{ "--bar": ... }}`)으로 넘긴다.
// React의 CSSProperties는 `--*` 키를 모르므로 여기서 한 번만 넓힌다.
// 검사 전용이다. package.json files에 없으므로 배포물에 들어가지 않는다.
import "react";
declare module "react" {
  /** popover 는 HTML 표준이지만 React 18 타입에 아직 없다. DropdownMenu 가 native popover 를 쓴다. */
  interface HTMLAttributes<T> {
    popover?: "auto" | "manual";
  }
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
