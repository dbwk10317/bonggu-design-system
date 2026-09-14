---
"@dbwk10317/bonggu-design-system": major
---

`tokens/base.css`의 요소 리셋이 `@layer bds-reset` 안으로 들어갑니다. 소비 앱이 `body`·`ul`·`a` 같은 요소를 직접 스타일하면 이제 앱의 규칙이 리셋보다 우선합니다. 리셋이 앱 규칙을 덮어쓰던 동작에 기대고 있었다면 그 규칙을 앱에서 지우거나 `@layer bds-reset` 뒤에 오는 자기 레이어로 옮깁니다.

`DataTable` 열의 `hideOnMobile`을 삭제합니다. `hideBelow: "tablet"`으로 바꿉니다.

배포 레지스트리가 GitHub Packages에서 npmjs 공개 패키지로 바뀝니다. `.npmrc`의 `@dbwk10317:registry=https://npm.pkg.github.com` 줄과 `read:packages` 토큰을 지우고 `npm install @dbwk10317/bonggu-design-system`으로 설치합니다.
