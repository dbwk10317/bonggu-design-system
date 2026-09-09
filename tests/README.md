# 회귀 검증

제품에 의존성을 추가하지 않고 tests 폴더에서 검증 도구를 관리합니다. 고정된 버전은 package-lock.json으로 공유합니다.

Node.js 24.11 이상을 사용합니다(Babel 8 실행 환경).

```sh
npm ci --prefix tests
cd tests
npx playwright install chromium
npm test
```

`npm test`는 소스로 번들을 다시 생성한 뒤 클래스 정합성, 전체 컴포넌트 렌더, 데이터 계산, React 입력 상태, 오버레이 렌더링, 실제 브라우저 통합 검증을 순서대로 실행합니다. 실패하면 즉시 중단합니다. 생성된 `_ds_bundle.js`와 `_ds_manifest.json` 변경은 소스와 함께 검토합니다.

기존 외부 의존성을 사용하는 경우 `DS_TEST_NODE_MODULES`에 node_modules 절대 경로를 설정하고 `node tests/run.cjs`를 실행할 수 있습니다. 설치된 Chrome/Edge로 검증하려면 `DS_TEST_BROWSER_EXECUTABLE`에 실행 파일 경로를 설정합니다. 스크린샷을 저장하려면 `DS_TEST_SCREENSHOTS`에 출력 폴더를 설정합니다. 로컬 파일 서버는 loopback에만 바인딩하고 테스트 종료 시 닫습니다.

- consistency-regressions.cjs: CSS와 소스의 클래스 사용을 양방향으로 대조합니다. 소스가 붙이는 `bds-*` 클래스에 규칙이 없거나, `styles/`·`tokens/`에 있는 클래스를 아무 소비자도 붙이지 않으면 위반 목록을 모두 출력하고 실패합니다. `bds-btn--${variant}` 같은 동적 조합은 고정 접두사로 인정합니다.
- manifest-token-regressions.cjs: 먼저 `token-parser.mjs`를 `fixtures/token-parser`의 독립 fixture와 손으로 적은 기대값으로 시험하고, 같은 파서로 `_ds_manifest.json`의 토큰 이름·값·scope·정의 파일을 `tokens/*.css` 선언과 대조합니다. 모든 토큰이 `:root` 계열 블록 안에 있는지도 평면 스캔과 교차 확인합니다. 같은 이름이 scope별로 있으면 별도 선언으로 셉니다(로그에 declarations·unique를 함께 찍습니다).
- rule-regressions.cjs: `readme.md`의 규칙 중 기계로 판별할 수 있는 항목을 검사합니다. 현재 13종으로, 가시 텍스트 em-dash, inline style의 색·폰트 선언, CSS 클래스의 `bds-` 접두사, 토큰 별칭 정의, 본문 글자 크기 하한, Phosphor Bold 아이콘 이름, 미사용 토큰, 원색을 글자색으로 쓰는 자리, 장식 그라디언트, 차트 면 채움 alpha, 그룹 카드 누락, 가이드 페이지 누락, 템플릿 미사용 컴포넌트입니다. 뒤 3종은 `.d.ts`의 공개 선언에서 컴포넌트 목록을 읽어 그 컴포넌트를 눈으로 확인할 자리가 있는지 봅니다. 기준값은 `readme.md`에 있고 이 파일은 그 기준을 검사만 합니다. 판단이 필요한 카피 품질·색 조합·컴포넌트 선택은 검사하지 않습니다. 위반마다 파일·줄·권장 수정안을 출력합니다.
- smoke-regressions.cjs: `_ds_manifest.json`에 실린 컴포넌트 전부를 소스에서 로드해 서버 렌더가 오류 없이, 그리고 경고 없이 끝나는지 확인합니다. 목록을 매니페스트에서 읽으므로 새 컴포넌트가 자동으로 포함됩니다.
- data-regressions.cjs: 소수 눈금, 양음 누적 막대, 결측 표현, 가용성 공식. 실제 계산 함수와 React 서버 렌더링을 사용합니다.
- input-regressions.cjs: 숫자 편집과 확정, 선택 후 목록, 달력 동기화, OTP 자리 보존. React test renderer로 상태 전이를 검증합니다.
- overlay-regressions.cjs: 독립 폼 ID, 확인 세션, busy/제출 없음 계약, 알림의 공통 dialog 사용.
- browser-regressions.cjs: 모달 크기, 실제 폼 제출, 재개방·중첩·역순 닫기·포커스, 메뉴 clipping/키보드/뷰포트/스크롤, 입력 수정. 1280·834·390 × 라이트·다크 × 포인터·터치 총 12개 조합을 추가 확인합니다. 실제 `templates/dashboard/Dashboard.dc.html`을 라우트 7개(개요·노드·장치·배포·접근·설정과 셸 없이 서는 공개 상태 페이지) × 1280·390 전수와 834 대표 3개로 열어 콘솔 오류·가로 넘침·레일과 드로어 전환을 확인하고, coarse pointer에서 노출된 조작 대상의 실제 bounding box가 선언한 하한과 24px을 지키는지 잽니다.

## 게이트 범위

- 검증은 외부 네트워크에 의존하지 않습니다. 브라우저 검증에 필요한 스크립트는 로컬 `node_modules`에서 서빙합니다. CDN을 그대로 받아 쓰는 구성은 게이트에 넣지 않습니다.
- 같은 원천을 읽는 파서를 빌드와 검사에 각각 두지 않습니다. 파서는 하나만 두고, 검사는 독립 fixture와 기대값으로 그 파서를 시험합니다. 빌드가 만든 결과를 같은 알고리즘으로 다시 계산해 비교하는 것은 검증이 아닙니다.
- 게이트가 아직 덮지 않는 것을 여기 적어 둡니다. `templates/dashboard/Dashboard.dc.html`의 로더·라우팅·화면 조립과 화면별 반응형 동작은 자동 검사에 포함되어 있지 않습니다. 컴포넌트 단위 회귀만으로는 이 경로의 회귀를 잡지 못합니다.
- 브라우저 검증은 Chromium 계열 기준입니다. Safari/Firefox 또는 실제 스크린리더 전수 검증을 대신하지 않습니다.
