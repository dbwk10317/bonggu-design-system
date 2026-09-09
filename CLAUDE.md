# CLAUDE.md

프로젝트 작업 원칙·동작 계약·검증 규칙은 [AGENTS.md](AGENTS.md)를 따른다. 이 문서에는 Claude Code 실행 환경에만 해당하는 내용만 둔다.

## 실행 환경 (Windows)

- Node는 `C:\nvm4w\nodejs`에 있다. PATH에 없으면 먼저 넣는다.
- 기본 셸은 PowerShell이다. POSIX 문법(`&&`, heredoc, `2>/dev/null`)이 필요하면 Bash 도구를 쓴다.
- 임시 파일은 저장소가 아니라 세션 스크래치패드 디렉터리에 만든다.

## 번들과 검증

```bash
node build-bundle.mjs
```

```bash
DS_TEST_BROWSER_EXECUTABLE="C:\Program Files\Google\Chrome\Application\chrome.exe" node tests/run.cjs
```

- `tests/run.cjs`가 번들을 먼저 다시 만들므로, 검증까지 돌릴 때 `build-bundle.mjs`를 따로 실행할 필요는 없다.
- Playwright 번들 Chromium이 설치돼 있지 않다. 설치된 Chrome을 `DS_TEST_BROWSER_EXECUTABLE`로 지정하거나 `npx playwright install chromium`을 먼저 실행한다.
- `_ds_bundle.js`·`_ds_manifest.json`은 생성물이다. 직접 고치지 않고 소스를 고친 뒤 다시 만든다.

## 도구 사용

- 파일 탐색·검색은 Glob/Grep을 쓴다. `_ds_bundle.js`(245 KB)와 `STYLEGUIDE.html`(1.2 MB)은 통째로 읽지 않는다.
- 커밋 메시지는 한국어로 쓰고 끝에 다음 줄을 넣는다.

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
