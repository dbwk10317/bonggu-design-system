// 이 시스템은 토큰 값을 인라인 커스텀 속성(`style={{ "--bar": ... }}`)으로 넘긴다.
// React의 CSSProperties는 `--*` 키를 모르므로 여기서 한 번만 넓힌다.
// 검사 전용이다. package.json files에 없으므로 배포물에 들어가지 않는다.
import "react";
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
