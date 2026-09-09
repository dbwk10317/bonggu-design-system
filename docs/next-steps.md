# 다음 작업 인수인계

2026-09-09 시점. 이 문서는 잔여 작업 목록이며, 항목이 끝나면 지운다. 작업 원칙은 [AGENTS.md](../AGENTS.md), 실행 환경은 [CLAUDE.md](../CLAUDE.md), 계약 결정은 [behavior-contracts.md](behavior-contracts.md)를 따른다.

## 현재 상태

전체 검증이 통과하는 상태로 커밋되어 있다. 시작 전에 먼저 돌려서 초록인지 확인한다.

```sh
DS_TEST_BROWSER_EXECUTABLE="C:\Program Files\Google\Chrome\Application\chrome.exe" node tests/run.cjs
```

Playwright 번들 Chromium이 설치돼 있지 않아 설치된 Chrome을 지정한다. `npx playwright install chromium`을 먼저 하면 환경변수 없이 돌아간다.

직전에 끝난 작업은 이렇다. 검증 게이트 신설(`consistency`·`smoke`), 결측 표기의 공통 구조화(`components/core/missing.js`), 색 별칭 40개 제거, 게이트 위반 11건 소진, `_adherence.oxlintrc.json`의 생성물 전환, 문서 관할표 신설.

## 1. 반경 별칭 `--r-*` 이관

`tokens/layout.css:31`에 `--r-sm/md/lg/pill`이 정본 `--radius-ctl/panel/sheet/pill`을 가리키는 별칭으로 남아 있다. **이 시스템은 별칭을 두지 않는다**(사유는 아래 "별칭 원칙" 참조). `--space-1…10` 별칭은 같은 이유로 이미 제거했다.

치환표는 이렇다.

| 별칭 | 정본 | 값 |
|---|---|---|
| `--r-sm` | `--radius-ctl` | 6px |
| `--r-md` | `--radius-panel` | 10px |
| `--r-lg` | `--radius-sheet` | 14px |
| `--r-pill` | `--radius-pill` | 999px |

`var(--r-*)` 참조는 16건이고 **전부 문서 표면**이다. `.jsx`·`styles/*.css`·`templates/**` 참조는 0건이다.

- `guidelines/` 13개 파일에 각 1건씩: colors-accent · colors-chart · colors-dark · colors-status · colors-surface · colors-text · layout-breakpoints · motion · spacing-radius · spacing-scale · type-korean · type-mono · type-ui
- `components/navigation/navigation.card.html` 2건, `components/layout/layout.card.html` 1건

16건을 정본으로 바꾼 뒤 `tokens/layout.css:31`의 정의를 지운다. 값이 같은 별칭이므로 라이트·다크 모두 렌더 결과가 바뀌지 않아야 한다. 값이 달라지는 치환이 생기면 그건 실수다.

**주의**: 앞선 작업자가 이 항목을 끝내지 못한 이유는 난이도가 아니라 `guidelines/`와 `*.card.html`이 그 작업자의 소유 범위 밖이었기 때문이다. 이 작업을 맡으면 그 파일들의 소유권을 받아야 한다.

끝나면 정의되지 않은 토큰을 참조하는 곳이 없는지 확인한다. `--span`·`--pct`·`--cols`처럼 컴포넌트가 `style` prop으로 런타임에 주입하는 변수는 정의가 없는 것이 정상이므로 오탐으로 세지 않는다.

## 2. 검수하지 못한 판단 3건

앞선 작업이 최종 보고 전에 중단되어 근거를 확인하지 못했다. 결과물 자체는 검증을 통과하지만, 아래는 판단의 타당성을 되짚어야 한다.

- **`_adherence.oxlintrc.json`의 `tokenKinds`** — 토큰 194개 중 31개만 `tokens/*.css`의 `/* @kind ... */` 주석에서 왔다. 나머지 163개를 무엇으로 분류했는지, 그 방식이 옳은지 확인한다. 분류 규칙을 신뢰할 수 없으면 `@kind` 주석을 출처로 삼아 소스에 주석을 채우는 쪽이 낫다.
- **prop 규칙에서 제외된 컴포넌트 6개** — `Chart`, `Code`, `Kbd`, `SidebarNavGroup`, `ToastProvider`, `ToolbarGrow`가 "props 인터페이스 없음"으로 빠졌다. `.d.ts`를 읽고 정당한 제외인지, 아니면 `.d.ts`가 인터페이스를 안 내보내는 것이 문제인지 판단한다.
- **`.bds-num`·`.bds-clamp-1`·`.bds-clamp-2` 삭제** — 소비 프로젝트용 공개 유틸리티가 아니라고 판단해 지웠다. 같은 파일의 `.u-num`·`.u-data`·`.u-caps`와의 관계를 확인하고, 공개 유틸리티였다면 되살린 뒤 게이트에 항목별 근거가 붙은 최소 허용 목록을 만든다.

## 3. 문서 규칙을 검사로 이관

문서에만 있는 규칙은 지켜지는지 알 수 없다. 실제로 결측 문구가 mono로 렌더되던 위반이 세 컴포넌트에서 오래 살아 있었고, 공통 구조로 모으고 나서야 드러났다.

기계로 확인할 수 있는 규칙을 `tests/`로 내린다. 아직 대상 목록을 뽑지 않았으므로 **목록 작성부터** 시작한다. readme.md의 CONTENT FUNDAMENTALS와 VISUAL FOUNDATIONS를 훑어 각 문장이 기계 검증 가능한지 분류하면 된다. 후보는 이렇다.

- 가시 텍스트에 em-dash 금지
- 컴포넌트에서 색·폰트를 인라인 `style`로 지정 금지(토큰과 `bds-*` 클래스만)
- `bds-` 네임스페이스 밖 클래스 선택자 금지. 현재 `styles/c-data.css`의 `.ck`·`.num`·`.sorted`·`.d-hide`·`.m-hide`와 `styles/c-chart.css`의 `.n`·`.v`가 해당한다
- 본문체 최소 11.5px, 10.5px는 `.bds-mono` 계열만
- `Icon name`이 Phosphor Bold 웹폰트에 실재하는 이름인지

판단이 필요한 규칙("행 액션 3개 이상이면 DropdownMenu", 카피 톤)은 검사로 만들지 않는다. readme에 남긴다.

## 별칭 원칙

이 디자인 시스템은 기존 소비 프로젝트와의 호환을 염두에 두지 않는다. 소비 프로젝트의 UI를 통째로 새로 만들 계획이고, 기존 시스템의 실패를 물려받지 않으려 한다. 즉 시스템이 자체로 완결해야 한다.

따라서 `--x: var(--y)` 형태의 별칭을 추가하지 않는다. 이름이 마음에 들지 않으면 별칭을 얹지 말고 정본을 개명하고 사용처를 전부 이관한다. 별칭이 필요해 보인다면 그것은 이관을 미루는 것이므로 먼저 확인을 받는다.

## 작업 방식

- 게이트(`tests/consistency-regressions.cjs`)를 통과시키려고 게이트를 무르게 만들지 않는다. 위반은 원인을 판단해서 옳은 쪽으로 고친다. 지우는 것이 맞는 경우도 있고 빠진 구현을 채우는 것이 맞는 경우도 있다.
- 여러 작업자에게 나눌 때는 파일 소유권을 겹치지 않게 자른다. `node build-bundle.mjs`는 한 사람만 실행한다. `_ds_bundle.js` 재생성이 서로 충돌한다.
- `_ds_bundle.js`·`_ds_manifest.json`·`_adherence.oxlintrc.json`은 생성물이다. 손으로 고치지 않는다.
