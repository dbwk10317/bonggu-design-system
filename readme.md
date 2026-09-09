# 봉구 대시보드 디자인 시스템 (Bonggu Dashboard DS)

운영·모니터링 대시보드를 위한 디자인 시스템입니다. 실시간 수치, 장치 제어, 사용자·리소스 관리처럼 **숫자가 많고 상태가 자주 바뀌는 화면**을 라이트·다크, PC·태블릿·모바일 어디서나 같은 규칙으로 그리기 위해 만들었습니다. 시각 규칙은 `봉구서버 스타일가이드 v1`을 토큰으로 옮긴 것이고, 마스코트 **봉구**(시츄+페키니즈 믹스)가 시스템의 감정 표현을 맡습니다.

## 설계 원칙

- **데이터는 nullable이 기본.** 수집되지 않은 값은 꾸미지 않고 **"수집 안 됨"**으로 그대로 보여준다. 일부 실패는 페이지 실패가 아니라 `degraded` + 해당 카드의 결측으로 표현한다.
- **상태는 색 단독으로 전하지 않는다.** 항상 텍스트를 병기한다. 알림은 래치되어 읽음 처리 전까지 남는다.
- **고정 픽셀 대신 `fit` 계약 + 컨테이너 쿼리.** 모든 컨테이너형 컴포넌트가 `fit="flex" | "fixed" | "auto"`를 받는다. flex(기본)는 부모 폭을 채우고 `min-width:0`으로 격자에서 찌그러지지 않으며, fixed는 `width`/`height`를 그대로 쓴다. 열 숨김·격자 접힘은 뷰포트가 아니라 **컨테이너 폭**(`@container`) 기준이다. 차트는 ResizeObserver로 실제 픽셀을 재서 viewBox를 맞춘다. 격자는 `repeat(auto-fit, minmax(min(100%, N), 1fr))`로만 만든다.
- **차트와 UI는 한 팔레트, 한 크롬.** 차트 색은 범주형 8색(`--series-1~8`, oklch 명도 0.62·채도 0.14 고정), 의미 고정 쌍(`--series-rx/tx/used/reserved/free`), 순차 램프(`--ramp-1~6`) 세 계열만. 상태색은 임계선·미터 전용. 모든 차트(`Chart` kind 7종)는 격자(hairline)·축(mono 10.5)·범례·툴팁(elev-2)·빈 상태 크롬을 공유한다. 결측 구간은 0으로 그리지 않고 선을 끊는다.
- **반응형 검수 폭**: PC 1280 · 태블릿 834 · 모바일 390 + 라이트(기본)·다크 양쪽이 항상 깨지지 않아야 한다.

## CONTENT FUNDAMENTALS (카피)

- **한국어 평문, 해요체가 아닌 서술형 종결("합니다", "됩니다").** 사용자는 "당신/여러분"으로 부르지 않고 주어를 생략한다. 예: "적용하면 데몬이 하드웨어에 즉시 반영합니다."
- **버튼 라벨은 동사 하나**: 적용 · 저장 · 삭제 · 추가 · 확인 · 취소 · 켜기 · 끄기. 파괴적 행동은 `danger`.
- **상태 문구는 짧은 명사구**: "모든 서비스 정상", "일부 수집 지연", "연결 끊김", "수집 안 됨", "실행 중", "응답 없음".
- **결측은 "수집 안 됨"** 한 가지로 통일하고 mono를 벗는다(한글 고정폭은 벌어져 보인다).
- **em-dash(—) 금지**, 구분은 가운뎃점(·)과 쉼표. 영문 식별자(서비스명, 디바이스명, 해시)는 그대로 mono로.
- **이모지 없음.** 아이콘은 Phosphor Bold, 감정은 봉구 마스코트 표정으로 전한다(정상 smiling · 지연 worried · 끊김 crying · 연결 중 sleepy · 빈 상태 curious).
- 설명문은 한 문장, 44~56em 폭 안에서 어절 단위로만 줄이 바뀐다. 제목은 `text-wrap: balance`.
- 수치는 항상 단위와 함께: `61.5°C`, `1.4 GiB`, `31.4 Mb/s`, `12d 04:31`, `184 ms`.

## VISUAL FOUNDATIONS

- **색**: 라이트 기본(`:root`), 다크는 `:root.dark` / `[data-theme="dark"]`에서 같은 이름, 명도만 반전. 살짝 차가운 중성 회색(`--canvas #fff`, `--canvas-sunken #f4f5f7`, `--panel-2/3`, `--line #e4e7ec`) 위에 **시그널 파랑 하나** `oklch(0.55 0.17 255)`. 시그널은 선택·포커스·주 버튼·활성 탭·송신(tx)에만 쓰고, 상태색 넷(`--ok` 초록 · `--warn` 호박 · `--crit` 빨강 · `--info` 청록)과 절대 섞지 않는다. 각 상태는 원색 · `-tint`(배경) · `-ink`(그 위 글자) 세 개. 미터 임계는 0~70 정상 · 70~90 주의 · 90~ 위험이고 값 텍스트도 같은 상태 잉크. 장치 프리뷰 스테이지(LCD·LED)는 테마와 무관하게 `--stage #0a0b10` 검정. 입력 컨트롤 경계는 `--line-input`(비텍스트 대비 3:1 이상).
- **타이포**: UI·본문 **Spoqa Han Sans Neo**(300·400·500·700), 수치·코드·식별자 **JetBrains Mono** + `tabular-nums`. 두 서체 역할을 절대 바꾸지 않는다(한글에 monospace 금지). 크기: display 28/700 · title 20/700 · heading 16 · subheading 14.5 · body 14/1.55 · label 12.5 · caption 11.5 · micro 10.5(mono 단위·타임스탬프만) · metric 24/19/36. 모바일은 display 24 · title 18 · metric 22. 한글 자간 0(음수 금지), 영문 대문자 라벨(CPU, VRAM)만 +0.06em. `word-break: keep-all`, 본문 14 이하로 내리지 않는다. 본문체(Spoqa) 최소 11.5px. 10.5px(micro)는 `.bds-mono` 계열 단위·타임스탬프에만.
- **간격**: 4px 스케일 `--sp-1…10`(4·8·12·16·20·24·32·40·48·64), 별칭 `--space-N`은 1:1. 패널 패딩 16(모바일 14), 격자 gap 14(12), 페이지 좌우 20(16), kv 행 사이 6, 버튼·칩 나열 8. 컨트롤 높이 28/32/40. **터치 기기(`pointer:coarse`)는 36/44/48로 자동 승격.** 밀도 `<html data-density="compact">`는 패딩 12·gap 10·컨트롤 24/28/36(글자 크기는 그대로).
- **브레이크포인트**: 뷰포트 4단 `sm 640 · md 768 · lg 1024 · xl 1380`(`--bp-*`, media는 리터럴). 컴포넌트 접힘은 컨테이너 5단 `xs 240 · sm 320 · md 480 · lg 640 · xl 900`(`--cq-*`, `@container`). 셸: ≥1024 레일, <1024 드로어, <768 상태바 숨김, <640 모달은 바텀시트. 최대 폭 `--content-max 1440`(`Container`), 폼 `--content-narrow 760`. iOS safe-area는 `--safe-*`로 셸이 흡수한다.
- **반경**: ctl 6 · panel 10 · sheet 14 · pill.
- **층·그림자**: 패널은 흰 면 + 1px 선, **그림자 없음**. `--elev-1/2/3`은 떠 있는 것(드롭다운·모달·토스트)에만. 블러 없음(모달 스크림만 반투명).
- **배경**: 단색. 이미지·패턴·그라디언트 없음. 차트 면 채움만 alpha .14.
- **카드(Panel)**: `--panel` + 1px `--line` + 10px. 선택은 `border: signal + 0 0 0 1px signal`, 배경은 바꾸지 않는다. 빈 상태는 점선 + 침강 바탕. 카드 제목 14.5/500, 헤더 메타 12.5 `--ink-3`.
- **호버**: 배경 한 단계(panel → panel-2), 선 line → line-strong. **프레스**: signal-active, 크기 축소 없음. **포커스**: `--focus-ring` 2px 외곽선 + 2px 오프셋. 위험 동작은 crit 외곽선 버튼, 채움은 확인 모달 안에서만.
- **모션**: 짧고 절제. fast 120(hover·색) · base 180(토글·드롭다운·탭 잉크) · slow 260(드로어·모달) · gauge 600(게이지·바 값 변화, 차트 진입 1회). `--ease-out cubic-bezier(.2,.8,.2,1)`. 실시간 숫자는 트랜지션 없이 즉시 바뀐다(tabular-nums로 흔들림 방지). reduced-motion이면 전부 0. 상시 루프는 실시간 pulse·스피너·마스코트 깜빡임만. StatTile 등 수치 카운트업 없음(animate 기본 false).
- **레이아웃 고정 요소**: ≥1024 레일 228px(활성 항목 signal-tint 배경 + signal 글자), 미만은 상단 바 48 + 오버레이 드로어. 화면 안 2차 내비는 상단 탭 44(활성 2px 밑줄 signal). 하단 상태바 28(데스크톱). 모바일 하단 탭바 없음. 패널 격자는 컨테이너 쿼리 우선(auto-fit 3열 · 2열 · 1열), media는 폴백.
- **이미지**: 장치 사진(4:3 크롭)만. 일러스트는 봉구 마크 하나.

## ICONOGRAPHY

- **Phosphor Icons, `weight="bold"` 고정.** 리액트에서는 `@phosphor-icons/react`, 정적 HTML·이 시스템의 카드에서는 Phosphor Bold 웹폰트(`tokens/icons.css`가 `fonts/phosphor/`의 셀프호스팅 웹폰트를 로드, CDN 없음). `Icon name="bell"` 래퍼가 이를 감싼다. React 프로젝트는 같은 아이콘 이름으로 `@phosphor-icons/react`의 `weight="bold"`를 대신 써도 된다.
- 크기 16 / 20 / 24, 색은 `currentColor`. 유니코드 도형은 상태 점(●)만 허용.
- 손으로 그린 SVG 아이콘 금지. 예외는 `MascotMark`(봉구) 하나. 이모지·유니코드 기호를 아이콘으로 쓰지 않는다(가운뎃점 `·`은 텍스트 구분자로만).
- 자산: `assets/mascot-neutral.svg`(정적 마스코트), `assets/favicon.svg`. 로고 워드마크는 없다. 브랜드 이름은 Spoqa 700 텍스트로 쓴다.

## fit 계약 (모든 컨테이너형 컴포넌트)

```jsx
<Chart kind="area" … />                       // fit="flex": 부모 폭, height만 지정
<Chart kind="radial" fit="fixed" width={124} height={92} … />
<Button fit="flex">모바일 전폭</Button>        // 컨트롤은 auto 기본
```
`components/core/frame.js`의 `frameStyle()`이 한 곳에서 구현한다. 새 컴포넌트도 이것을 쓴다.

## 컴포넌트 사용 규칙

- 행 액션 3개 이상 → `DropdownMenu`, 목록 옆 상세 → `Drawer`, 복사 전용 값 → `CopyField`, JSON 입력 → `CodeEditor`, 긴 선택 목록 → `Combobox`.
- 밀도 격자는 `Heatmap`(ramp), 진행은 `ProgressBar`/`Stepper`, 시간축 사건은 `Timeline`, 설정 변경 비교는 `DiffView`.
- 수치 하나만 있는 타일은 허전하다. `StatTile`에 `detail`·`pill`·`icon`으로 "무엇이 N개인지"를 함께 보여준다.
- 격자는 `Grid`로만 만든다. 화면별 CSS에 격자를 다시 쓰지 않는다.
- 빈 상태·힌트 문구도 서술형으로 쓴다(예: '카드를 누르면 적용 대상으로 선택됩니다').

## Index

- `styles.css` · 진입점(@import만). `tokens/` fonts · colors · typography · layout · icons · base
- `styles/c-*.css` · 컴포넌트 클래스(action · input · status · data · chart · layout · overlay · feedback · extra · more)
- `fonts/` · Spoqa Han Sans Neo 300/400/500/700, JetBrains Mono latin/latin-ext (woff2), `fonts/phosphor/` Phosphor Bold 웹폰트(셀프호스팅)
- `assets/` · mascot-neutral.svg, favicon.svg
- `guidelines/` · 색·타이포·간격·반응형·모션 스펙 카드 13장
- `theme-toggle.js` · 문서 카드 우상단 라이트/다크 토글(localStorage로 모든 카드 동기화). 제품에서는 `:root.dark` 클래스만 토글한다
- `components/` · 9그룹, `components/<group>/<Name>.jsx` + `.d.ts` + `.prompt.md`(사용법), 그룹별 카드(`*.card.html`). 스타일은 `styles/c-*.css`의 `bds-*` 클래스와 토큰만. 번들 네임스페이스는 `window.Ds_d3ea90`(훅은 대문자 export만 노출되므로 `ToastProvider.useToast()`로 접근).
- `templates/dashboard/` · 대시보드 템플릿(`Dashboard.dc.html`; 모니터링·인증·조명·쿨러·모델·학습·설정 7화면, 클릭 가능, 라이트 기본 + 다크 토글). 소비 프로젝트는 `ds-base.js` 한 줄만 고쳐 쓴다.
- `STYLEGUIDE.html` · 스타일가이드 원문 번들
- `build-bundle.mjs` · `_ds_bundle.js`·`_ds_manifest.json` 빌드. 컴포넌트 소스를 고치면 `node build-bundle.mjs`로 다시 만든다(`@babel/standalone` 필요, 없으면 `BABEL_STANDALONE=<경로>`)

### Components (96 · 9그룹)
- action: Button, IconButton, Icon
- brand: MascotMark
- layout: PageStack, PageHeader, Panel, CardHead, Toolbar, ToolbarGrow, Grid, GridItem, StatusBar, Container, Stack, Inline, Spacer, Divider, AspectRatio, Visible
- navigation: SidebarShell, SidebarNavItem, SidebarNavGroup, TopNav, Tabs, Breadcrumb, Pagination, Link, CommandPalette
- input: Field, TextField, TextArea, Select, Checkbox, RadioGroup, Switch, SearchField, SegmentedControl, Slider, NumberStepper, ColorInput, Combobox, MultiSelect, DatePicker, DateRangePicker, TimePicker, PasswordField, OTPInput, CodeEditor, Dropzone, FileUpload
- data: Chart(line·area·bar·pie·radial·radar·histogram), Sparkline, Gauge, Heatmap, StatTile, TrendDelta, BarList, KeyValues, DescriptionList, DataTable, LogViewer, Timeline, DiffView, Legend, UptimeBar
- display: StatusPill, Tag, Badge, Avatar, AvatarGroup, Accordion, Code, CodeBlock, Kbd, CopyField
- overlay: Modal, FormModal, Drawer, Popover, Tooltip, DropdownMenu
- feedback: AlertBanner, Toast, ToastProvider, NotificationDrawer, NotificationTrigger, InlineMessage, ProgressBar, Stepper, Skeleton, Spinner, LoadingOverlay, EmptyState, ErrorState, ConfirmDialog

그룹 기준: **action** 행동을 일으킴 · **layout** 자리와 간격 · **navigation** 화면·뷰 이동 · **input** 값을 받음 · **data** 수치·기록을 보임 · **display** 짧은 표식·텍스트 · **overlay** 위에 뜸 · **feedback** 시스템이 사용자에게 말함(진행·알림·상태).

### 컴포넌트 선택 가이드
- 나열: 세로 `Stack`, 가로 `Inline`, 양끝 정렬 `Spacer`, 최대 폭 `Container`, 카드 격자 `Grid`(비대칭은 `columns={12}` + `GridItem span`), 비율 상자 `AspectRatio`, 뷰포트별 표시 `Visible`.
- 이동: 화면 5개 이하 `TopNav`, 그 이상 `SidebarShell`. 3단 이상 깊이 `Breadcrumb`, 20행 초과 목록 `Pagination`, 키보드 이동 `CommandPalette`(⌘K), 인라인 이동 `Link`.
- 선택: 2~3개 `SegmentedControl`, 2~5개(설명 포함) `RadioGroup`, 6개 이상 `Select`, 검색 필요 `Combobox`, 여러 개 `MultiSelect`. 날짜 하나 `DatePicker`, 기간 `DateRangePicker`, 시각 `TimePicker`. 비밀번호 `PasswordField`, 인증 코드 `OTPInput`.
- 표시: 사람·서비스 `Avatar`, 건수 `Badge`(0이면 없음), 상태 문구 `StatusPill`, 분류 `Tag`. 접이식 `Accordion`(설정 고급 옵션만), 클릭 설명 패널 `Popover`, 한 줄 설명 `Tooltip`.
- 피드백: 필드·카드 안 한 줄 `InlineMessage`, 페이지 `AlertBanner`, 일시 `Toast`. 재조회 `LoadingOverlay`, 첫 로딩 `Skeleton`. 파괴적 동작 `ConfirmDialog`(crit 채움은 여기서만). 카드 실패 `ErrorState`, 빈 결과 `EmptyState`, 값 하나 결측은 텍스트 "수집 안 됨".
- 수치: 사용률 하나 `Gauge`(70/90 자동 톤), 증감 `TrendDelta`(나쁜 지표는 inverse), 공유 범례 `Legend`, 가용성 `UptimeBar`.
