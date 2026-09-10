# CLAUDE.md

디자인 규칙은 [readme.md](readme.md) 한 곳에 있고, 기계로 판별하는 검사는 `tests/rule-regressions.cjs`에 있다. 규칙의 출처 선언과 작업 원칙은 [AGENTS.md](AGENTS.md)를 따른다. 이 문서에는 Claude Code 실행 환경에만 해당하는 내용만 둔다.

## 실행 환경 (Windows)

- Node는 `C:\nvm4w\nodejs`에 있다. PATH에 없으면 먼저 넣는다.
- 기본 셸은 PowerShell이다. POSIX 문법(`&&`, heredoc, `2>/dev/null`)이 필요하면 Bash 도구를 쓴다.
- 임시 파일은 저장소가 아니라 세션 스크래치패드 디렉터리에 만든다.

## 번들과 검증

```bash
node build-bundle.mjs
```

의존성은 루트 workspace 한 곳에서 관리하므로 `@babel/standalone`은 루트 `node_modules`로 호이스팅된다.
`build-bundle.mjs`가 스스로 찾으니 `BABEL_STANDALONE`을 손으로 지정하지 않는다(없는 경로를 지정하면 빌드가 깨진다).

```bash
npm run typecheck   # tsconfig.json · components/** strict + checkJs
```

```bash
npm run lint        # eslint.config.mjs · react-hooks + jsx-a11y
```

```bash
DS_TEST_BROWSER_EXECUTABLE="C:\Program Files\Google\Chrome\Application\chrome.exe" node tests/run.cjs
```

- `tests/run.cjs`가 번들을 먼저 다시 만들므로, 검증까지 돌릴 때 `build-bundle.mjs`를 따로 실행할 필요는 없다. 번들 다음이 타입 검사와 린트다.
- `package-regressions.cjs`는 소비 fixture를 오프라인으로 깐다. npm 캐시가 비어 있으면 `ENOTCACHED`로 실패하므로 그때는 온라인으로 한 번 받아 캐시를 채운다.
- Playwright 번들 Chromium(chromium-1243)이 `~/AppData/Local/ms-playwright`에 설치돼 있고, 저장소가 핀한 playwright 1.63.0이 같은 리비전을 가리킨다. 그대로 쓰면 된다. 없어졌을 때만 설치된 Chrome을 `DS_TEST_BROWSER_EXECUTABLE`로 지정하거나 `npx playwright install chromium`을 실행한다.
- `_ds_bundle.js`·`_ds_manifest.json`은 생성물이다. 직접 고치지 않고 소스를 고친 뒤 다시 만든다.

## Claude Design 동기화 (`/design-sync`)

이 저장소는 claude.ai/design 프로젝트 `31ea8e33-9298-4158-b1df-f1299f41fed6`으로 동기화된다.
설정은 `.design-sync/config.json`, 업로드 산출물은 `ds-bundle/`(생성물).

```bash
npm run sync:ds
```

순서가 고정돼 있다: `build` → `prep.mjs` → `package-build.mjs` → `dts-fix.mjs` → `package-validate.mjs`.
**중간 단계를 빠뜨려도 에러가 아니라 "그럭저럭 도는" 상태로 끝나므로 순서를 손으로 재현하지 않는다.**
`prep.mjs`가 빠지면 토큰·컴포넌트 CSS가 통째로 누락돼 모든 디자인이 무스타일로 나가고,
`dts-fix.mjs`가 빠지면 에이전트가 읽는 API 계약에 데이터 형태가 비어 있다. 두 스크립트의
헤더 주석에 각각 왜 필요한지 적혀 있다.

- 변환기 스크립트는 `.ds-sync/`에 스테이징된다(생성물). 스킬이 갱신되면 다시 복사한다.
- `.design-sync/previews/*.tsx`는 사람이 쓴 미리보기다. 컴포넌트 prop 이름이 바뀌면 조용히
  컴파일에 실패하고 그 컴포넌트가 기본 카드로 떨어진다(빌드 로그 `! preview build failed:`).
- 업로드는 단방향이다. Claude Design에서 고친 것은 저장소로 돌아오지 않고 다음 동기화에 덮어써진다.

## 브라우저로 보기

템플릿은 `x-import`가 `fetch`로 화면 파일을 읽어 `file://`에서 열리지 않는다. 저장소 루트에서 정적 서버를 띄운다.

```bash
python -m http.server 8080
```

- 템플릿 `http://localhost:8080/templates/dashboard/Dashboard.dc.html`
- 가이드 `http://localhost:8080/guidelines/index.html`

카드(`guidelines/*.html`, `components/*/*.card.html`)는 파일을 그대로 열어도 된다.

## 도구 사용

- 파일 탐색·검색은 Glob/Grep을 쓴다. `_ds_bundle.js`(236 KB)는 통째로 읽지 않는다.
- 커밋 메시지는 한국어로 쓰고 끝에 다음 줄을 넣는다.

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
