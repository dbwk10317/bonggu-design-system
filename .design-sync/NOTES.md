# design-sync 메모 (봉구 대시보드 디자인 시스템)

## 실행 순서 — 한 명령으로

```bash
npm run sync:ds
```

`package.json`의 `sync:ds`가 순서를 고정한다:
`npm run build` → `prep.mjs` → `package-build.mjs` → **`dts-fix.mjs`** → `package-validate.mjs`.
순서를 손으로 재현하지 말고 이 스크립트를 쓴다 — 중간 단계를 빠뜨려도 에러가 아니라 "그럭저럭 도는"
상태로 끝나기 때문이다(prep 빠지면 스타일 전멸, dts-fix 빠지면 API 계약 공백).

`cfg.buildCmd`는 `npm run build && node .design-sync/prep.mjs`까지만 묶는다. `dts-fix.mjs`는
`package-build.mjs` **뒤**라 buildCmd에 넣을 수 없다. `resync.mjs`(드라이버)는 build→validate를 한 번에
돌려 dts-fix가 끼어들 자리가 없으니, 드라이버를 쓴 뒤에는 `dts-fix.mjs`를 돌리고 validate를 한 번 더 본다.
(`preview-rebuild.mjs`는 `.d.ts`를 건드리지 않으므로 미리보기만 고칠 때는 dts-fix가 필요 없다.)

## 이 저장소에 맞춰 만든 것

- **`.design-sync/prep.mjs`** — 두 가지를 만든다.
  - `.cache/flat.css`: `dist/styles.css`가 `@import`만 있는 껍데기(1 KB)라 `cfg.cssEntry`(파일 하나만 받음)로 쓸 수 없다.
    16개 파일을 재귀로 인라인해 185 KB 한 장으로 만든다. 이걸 안 하면 **토큰·컴포넌트 CSS가 통째로 누락되어
    모든 디자인이 무스타일로 렌더된다.**
  - `.cache/docs/<Name>.md`: 저장소 문서는 `components/<group>/<Name>.prompt.md`인데 변환기의 슬러그 매칭이
    `.prompt`를 이름의 일부(`buttonprompt`)로 읽어 0/96 매칭이었다. 확장자만 바꿔 복사하면 87/96이 붙는다.
    (나머지 9개 하위 컴포넌트는 `cfg.docsMap`으로 부모 문서에 연결 — 96/96.)
- **`.design-sync/dts-fix.mjs`** — 변환기가 낸 `.d.ts`를 자기완결형으로 만든다. 변환기의 손실 두 가지를 메운다.
  - **미해결 이름**: prop 타입을 이름으로만 적고(`columns: DataTableColumn<T>[]`) 선언을 넣지 않으며
    React 타입도 `React.` 없이 낸다. 32/96 파일이 해당됐다. TypeScript에 "찾을 수 없는 이름"을 직접 물어
    React 타입은 자격을 붙이고 나머지는 저장소 소스 `.d.ts`의 선언을 JSDoc째로 덧붙인다(전이 참조도 따라간다).
  - **판별 유니온 평탄화**: `<Name>Props`가 `A | B | C` 유니온이면 추출기가 공통 베이스만 남기고 각 갈래의
    prop을 통째로 잃는다. 소스 AST에서 갈래를 읽어 병합하고, 모든 갈래에 없는 prop은 선택으로 내리면서
    `/** radial 전용. */`처럼 어느 갈래 것인지 JSDoc에 적는다. 현재 `Chart`(5갈래) 하나가 걸린다.
    **손으로 베낀 사본이 없으므로 `Chart.d.ts`를 고치면 다음 빌드에 자동 반영된다.**
  - 검증: 마지막에 미해결 이름 수를 보고하고 0이 아니면 exit 1. `sync:ds`가 여기서 멈춘다.
  - `_ds_sync.json`은 `.d.ts`를 해싱하지 않는다(`renderHashFor`=`_preview/*.js`+`.html`, `auxShaFor`=guidelines+README).
    그래서 빌드 뒤 후처리가 앵커를 상하게 하지 않는다 — validate의 `render hashes match disk`로 실증됨.
    이 전제가 깨지면 dts-fix를 다른 곳으로 옮겨야 한다.
  - 저장소의 `typescript`는 7.x(네이티브 포트)라 JS 컴파일러 API가 없다. `.ds-sync/`의 ts-morph가 번들한 ts를 빌려 쓴다.
  - `.d.ts`는 선언 파일이라 **`skipLibCheck: true`면 진단이 아예 안 나온다.** 반드시 `false`.
- **`cfg.extraFonts`는 woff2가 아니라 `.css`를 가리킨다.** 맨 woff2를 주면 파일만 복사되고 `@font-face`가 없어
  `_ds_bundle.css`의 face가 "dead src"로 버려진다(Phosphor 아이콘이 빈 네모가 된다).
  `dist/tokens/fonts.css` + `dist/fonts/phosphor/bold.css`를 준다.

## 소스 쪽에서 고친 것

- `components/display/Avatar.jsx` — 한글 이니셜 판정 정규식을 `/^[가-힣]/` → `/^[\uAC00-\uD7A3]/`로 바꿨다.
  esbuild의 기본 `charset: ascii`는 **문자열 리터럴만** 이스케이프하고 정규식 리터럴은 원문 UTF-8로 남긴다.
  charset을 선언하지 않고 서빙되는 페이지에서 그 바이트가 latin1로 읽혀 `SyntaxError: Range out of order`가 나고
  **번들 전체가 죽는다**(96개 export 전부 `window.BongguDS`에 안 붙음). 이제 번들은 순수 ASCII다.
  소스에 non-ASCII 정규식을 새로 넣지 않는다.

## 알려진 경고 (Known render warns) — 새 경고가 아니다

- `[RENDER_THIN]` / `[RENDER_BLANK]`가 미리보기 미작성 컴포넌트에서 나는 것은 실패가 아니라 기본 카드다.

## 환경 (Windows)

- Node는 `C:\nvm4w\nodejs`. `BABEL_STANDALONE`은 이제 `node_modules/@babel/standalone`으로 해결된다.
- Playwright 브라우저는 `~/AppData/Local/ms-playwright`에 **chromium-1243이 이미 설치돼 있고**
  저장소가 핀한 playwright 1.63.0이 같은 리비전을 가리킨다. 추가 설치 불필요.
- **Bash 도구의 heredoc이 백슬래시를 한 단계 삼킨다.** `\\u` → `\u`, `\\s` → `\s`.
  정규식이나 이스케이프가 들어가는 스크립트는 heredoc으로 쓰지 말고 Write 도구로 파일을 만든다.
  이것 때문에 조용히 틀린 스크립트를 여러 번 돌렸다.

## 재동기화 위험 (Re-sync risks)

- **`prep.mjs`와 `dts-fix.mjs`를 건너뛰면 조용히 나빠진다.** 전자는 스타일 전멸, 후자는 API 계약 공백.
  둘 다 에러가 아니라 "그럭저럭 도는" 상태로 끝난다. `npm run sync:ds`를 쓰면 순서가 강제된다.
- `.design-sync/previews/*.tsx`는 저장소 컴포넌트 API에 묶여 있다. prop 이름이 바뀌면 미리보기 컴파일이
  조용히 실패하고 해당 컴포넌트가 기본 카드로 떨어진다(빌드 로그의 `! preview build failed:` 줄).
- dts-fix가 소스 `.d.ts`를 정본으로 읽으므로, **소스에 없는 타입을 새로 참조하면** 미해결로 남고 exit 1이 된다.
  그때는 소스에 선언을 추가하는 게 맞다(스크립트에 예외를 넣지 않는다).
- 업로드는 단방향이다. Claude Design에서 이 DS 프로젝트 파일을 고쳐도 저장소로 돌아오지 않고 다음 동기화에서 덮어써진다.
