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

`@babel/standalone`이 전역에 없으면 tests에 설치된 것을 가리킨다.

```bash
BABEL_STANDALONE="$PWD/tests/node_modules/@babel/standalone" node build-bundle.mjs
```

```bash
DS_TEST_BROWSER_EXECUTABLE="C:\Program Files\Google\Chrome\Application\chrome.exe" node tests/run.cjs
```

- `tests/run.cjs`가 번들을 먼저 다시 만들므로, 검증까지 돌릴 때 `build-bundle.mjs`를 따로 실행할 필요는 없다.
- Playwright 번들 Chromium이 설치돼 있지 않다. 설치된 Chrome을 `DS_TEST_BROWSER_EXECUTABLE`로 지정하거나 `npx playwright install chromium`을 먼저 실행한다.
- `_ds_bundle.js`·`_ds_manifest.json`은 생성물이다. 직접 고치지 않고 소스를 고친 뒤 다시 만든다.

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
