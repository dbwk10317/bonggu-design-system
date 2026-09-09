# 봉구 대시보드 디자인 시스템 (Bonggu Dashboard DS)

운영·모니터링 대시보드를 위한 디자인 시스템입니다. 실시간 수치, 장치 제어, 사용자·리소스 관리처럼 **숫자가 많고 상태가 자주 바뀌는 화면**을 라이트·다크, PC·태블릿·모바일 어디서나 같은 규칙으로 그리기 위해 만들었습니다. 시각 규칙은 `봉구서버 스타일가이드 v1`을 토큰으로 옮긴 것이고, 마스코트 **봉구**(시츄+페키니즈 믹스)가 시스템의 감정 표현을 맡습니다.

## 설계 원칙

- **데이터는 nullable이 기본.** 수집되지 않은 값은 꾸미지 않고 **"수집 안 됨"**으로 그대로 보여준다. 일부 실패는 페이지 실패가 아니라 `degraded` + 해당 카드의 결측으로 표현한다. 표기 문구·판정·클래스는 `components/core/frame.js`의 fit 계약처럼 `components/core/missing.js` 한 곳에서 나온다(`MISSING_TEXT`·`isMissing()`·`bds-na`). `null`·`undefined`·`NaN`이 결측이고 `""`·`0`은 수집된 값이다. 이 판정은 표기만의 규칙이 아니다. 좌표·누적·합계·축 범위 같은 계산에도 같은 기준을 쓰고, 유한한 수가 아닌 값은 계산에 들어가지 않는다.
- **상태는 색 단독으로 전하지 않는다.** 항상 텍스트를 병기한다. 알림은 래치되어 읽음 처리 전까지 남는다.
- **고정 픽셀 대신 `fit` 계약 + 컨테이너 쿼리.** 모든 컨테이너형 컴포넌트가 `fit="flex" | "fixed" | "auto"`를 받는다. flex(기본)는 부모 폭을 채우고 `min-width:0`으로 격자에서 찌그러지지 않으며, fixed는 `width`/`height`를 그대로 쓴다. 열 숨김·격자 접힘은 뷰포트가 아니라 **컨테이너 폭**(`@container`) 기준이다. 차트는 ResizeObserver로 실제 픽셀을 재서 viewBox를 맞춘다. 격자는 `repeat(auto-fit, minmax(min(100%, N), 1fr))`로만 만든다.
- **전역 토큰은 별칭 없이 정본 하나로 유지한다.** 이름을 바꿀 때는 별칭을 추가하지 않고 정본을 개명한 뒤 모든 사용처를 함께 이관한다. 기존 소비 프로젝트와의 호환은 이 시스템의 범위에 포함하지 않는다.
- **차트와 UI는 한 팔레트, 한 크롬.** 차트 색은 범주형 8색(`--series-1~8`, oklch 명도 0.62·채도 0.14 고정), 의미 고정 쌍(`--series-rx/tx/used/reserved/free`), 순차 램프(`--ramp-1~6`) 세 계열만. 상태색은 임계선·미터 전용. 모든 차트(`Chart` kind 7종)는 격자(hairline)·축(mono 10.5)·범례·툴팁(elev-2)·빈 상태 크롬을 공유한다. 결측은 0으로 그리지 않고 종류마다 생략 방식이 정해져 있다. 선과 면은 구간을 끊고, 막대는 그리지 않으며 누적 합계에서도 뺀다. 파이는 세그먼트를 링과 합계에서 빼고 범례에는 결측으로 남긴다. 레이더는 결측 축에 닿는 선과 그 계열의 면 채움을 생략한다. 방사 게이지와 Sparkline은 값 자리에 결측을 표시한다. 어느 종류든 결측 하나가 축 범위나 다른 계열의 좌표를 바꾸지 않는다.
- **반응형 검수 폭**: PC 1280 · 태블릿 834 · 모바일 390 + 라이트(기본)·다크 양쪽이 항상 깨지지 않아야 한다.

## 동작 계약

이 문서가 규칙의 유일한 출처다. 기계로 판별할 수 있는 항목의 검사는 `tests/rule-regressions.cjs`에 있다. 작업 원칙은 [AGENTS.md](AGENTS.md), 검증 실행법은 [tests/README.md](tests/README.md)를 따른다. 코드 주석이나 컴포넌트 문서에 여기 없는 규칙을 새로 만들지 않는다.

**오버레이와 피드백**

- Modal·Drawer·NotificationDrawer는 네이티브 dialog의 개방 세션·포커스·스크롤 잠금 규칙을 공유한다. 확인 문구는 확인 세션 소유이며 폼 ID는 인스턴스별로 독립적이다. busy인 동안은 모든 닫기 경로를 막는다.
- DropdownMenu는 네이티브 Popover API의 top layer를 사용해 표 스크롤과 분리한다. 메뉴의 수명은 소속 dialog의 개방 세션을 넘지 않는다. Popover API 지원 브라우저가 필요하다.
- Toast는 등장과 퇴장이 짝이다. `dismiss`는 퇴장 표시를 세운 뒤 `--dur-base`만큼 두었다가 목록에서 뺀다. reduced-motion이면 즉시 뺀다. 퇴장 중인 토스트는 `max` 계산에서 제외하고 클릭을 받지 않는다.

**입력**

- NumberStepper의 편집 문자열은 blur·Enter·증감 시 숫자로 확정한다. 빈칸은 마지막 값으로 되돌린다.
- OTP의 부분값은 중간 빈자리를 ASCII 공백으로 보존한다. 말미 공백만 생략하고 모든 칸이 숫자일 때만 완성으로 본다.
- MultiSelect는 선택한 뒤 활성 인덱스를 목록 시작으로 옮기고, 바뀐 목록 범위 안에서 키보드 이동을 계속한다.
- DatePicker는 외부 선택값이 바뀌거나 팝업이 다시 열릴 때 선택된 월로 맞춘다. 달을 넘기는 것만으로는 선택값이 바뀌지 않는다.
- Select의 목록은 네이티브 `select`가 그린다. `appearance: base-select`를 지원하는 브라우저에서는 같은 토큰으로 다시 그리고, 지원하지 않으면 브라우저 기본 목록으로 남는다. 목록 모양을 완전히 통제해야 하면 Select가 아니라 Combobox를 쓴다.

**데이터와 결측**

- 차트 데이터 정밀도는 픽셀 반올림과 분리한다. 누적 막대는 양수·음수를 각각 0에서 쌓고 양쪽 합계를 축 범위에 포함한다. 가용성은 `(ok+warn)/(ok+warn+crit)`이며 off는 분모에서 제외한다.
- DataTable에서 `render`가 없는 열의 `null`은 결측으로 표시한다. `render`가 돌려준 `null`은 React 규칙대로 빈 칸이다. 값 대신 빈 칸을 원하면 빈 문자열을 넘긴다.
- 결측 표기는 그리는 매체를 따른다. **HTML 텍스트**면 `bds-na`, **SVG 텍스트**면 `fill`로 색을 받고(Gauge), **텍스트가 아닌 칸**이면 track 색과 `title`로 알린다(UptimeBar). 문구 상수는 셋 다 공통을 쓴다. StatTile의 `deltaLabel`은 결측 표기가 아니라 보조 라벨이다.

**접근성**

- 조작 가능한 것은 네이티브 요소로 만든다. 시각 스타일만 바꾸는 prop은 조작 가능성을 뜻하지 않는다. `div`에 역할을 얹어야 한다면 role·tabIndex·Enter·Space를 컴포넌트가 함께 제공하고, 그렇게 하지 않을 것이면 그 prop이 시각 전용임을 문서에 적는다.
- 파생 정보를 접근 가능한 이름에 넣는 책임은 그 정보를 그리는 컴포넌트 한 곳에 둔다. 호출자는 기본 동작만 설명하는 이름을 넘기고 숫자를 직접 적지 않는다. 건수 단위는 "N건"으로 통일한다.
- 조작 대상은 서버 렌더에서 경고 없이 끝난다. 브라우저 전용 훅은 서버에서 같은 결과를 내는 형태로 감싼다.

**생성과 검증**

- `tokenKinds`는 `tokens/*.css`의 `@token-kinds` 원천 주석에서만 생성한다. 모든 토큰이 한 번씩 분류되어야 하고 누락·중복·정의되지 않은 분류는 번들 생성을 실패시킨다.
- prop 규칙 생성기가 공개 props 타입을 해석하지 못하면 빌드를 실패시킨다. 컴포넌트명과 해석하지 못한 타입 표현을 함께 알린다. 규칙 대상에서 빼는 컴포넌트는 명시 목록과 사유를 둔다.
- 같은 값을 읽는 파서를 빌드와 검사에 각각 두지 않는다. 파서는 하나만 두고, 검사는 그 파서를 독립 fixture와 기대값으로 시험한다.

## CONTENT FUNDAMENTALS (카피)

- **한국어 평문, 해요체가 아닌 서술형 종결("합니다", "됩니다").** 사용자는 "당신/여러분"으로 부르지 않고 주어를 생략한다. 예: "적용하면 데몬이 하드웨어에 즉시 반영합니다."
- **버튼 라벨은 동사 하나**: 적용 · 저장 · 삭제 · 추가 · 확인 · 취소 · 켜기 · 끄기. 파괴적 행동은 `danger`.
- **상태 문구는 짧은 명사구**: "모든 서비스 정상", "일부 수집 지연", "연결 끊김", "수집 안 됨", "실행 중", "응답 없음".
- **결측은 "수집 안 됨"** 한 가지로 통일하고 mono를 벗는다(한글 고정폭은 벌어져 보인다). 문구와 `bds-na` 표기는 `components/core/missing.js`·`styles/c-data.css` 각 한 곳에서만 나오며, 표(DataTable)도 결측을 빈 칸으로 감추지 않는다. 차트 툴팁에도 결측 계열을 남긴다. 레이더는 축 라벨에 마우스·터치하거나 키보드로 축을 선택하면 결측 상태를 확인할 수 있고, 모든 축이 결측이면 빈 상태를 표시한다. 그래프 종류별 생략 방식은 설계 원칙에 있다.
- **em-dash(—) 금지**, 구분은 가운뎃점(·)과 쉼표. 영문 식별자(서비스명, 디바이스명, 해시)는 그대로 mono로.
- **이모지 없음.** 아이콘은 Phosphor Bold, 감정은 봉구 마스코트 표정으로 전한다(정상 smiling · 지연 worried · 끊김 crying · 연결 중 sleepy · 빈 상태 curious).
- 설명문은 한 문장, 44~56em 폭 안에서 어절 단위로만 줄이 바뀐다. 제목은 `text-wrap: balance`.
- 수치는 항상 단위와 함께: `61.5°C`, `1.4 GiB`, `31.4 Mb/s`, `12d 04:31`, `184 ms`.

## VISUAL FOUNDATIONS

- **색**: 라이트 기본(`:root`), 다크는 `:root.dark` / `[data-theme="dark"]`에서 같은 이름, 명도만 반전. 살짝 차가운 중성 회색(`--canvas #fff`, `--canvas-sunken #f4f5f7`, `--panel-2/3`, `--line #e4e7ec`) 위에 **시그널 파랑 하나** `oklch(0.55 0.17 255)`. 시그널은 선택·포커스·주 버튼·활성 탭·송신(tx)에만 쓰고, 상태색 넷(`--ok` 초록 · `--warn` 호박 · `--crit` 빨강 · `--info` 청록)과 절대 섞지 않는다. 시그널과 각 상태색은 원색 · `-tint`(배경) · `-ink`(그 위 글자) 세 개를 갖춘다. `-tint` 배경 위의 글자는 언제나 같은 계열의 `-ink`를 쓴다. 원색은 채움 배경이고 그 위의 글자는 `-fg`이므로 원색을 글자색으로 쓰지 않는다. 본문 크기 글자와 배경의 대비는 라이트·다크 양쪽에서 4.5:1 이상이다. 미터 임계는 0~70 정상 · 70~90 주의 · 90~ 위험이고 값 텍스트도 같은 상태 잉크. **컨트롤을 식별하는 시각 요소**는 비텍스트 대비 3:1 이상이다. 입력·체크박스·스위치·드롭존은 경계선이 그 역할을 하므로 `--line-input`을 쓰고 면은 `--panel`과 같아도 된다. 채움이 식별을 맡는 자리(세그먼티드 컨테이너 같은 것)의 경계선은 `--line`이다.
- **타이포**: UI·본문 **Spoqa Han Sans Neo**(300·400·500·700), 수치·코드·식별자 **JetBrains Mono** + `tabular-nums`. 두 서체 역할을 절대 바꾸지 않는다(한글에 monospace 금지). 크기: display 28/700 · title 20/700 · heading 16 · subheading 14.5 · body 14/1.55 · label 12.5 · caption 11.5 · micro 10.5(mono 단위·타임스탬프만) · metric 24. 모바일은 display 24 · title 18 · metric 22. 한글 자간 0(음수 금지), 영문 대문자 라벨(CPU, VRAM)만 +0.06em. `word-break: keep-all`, 본문 14 이하로 내리지 않는다. 본문체(Spoqa) 최소 11.5px. 10.5px(micro)는 `.bds-mono` 계열 단위·타임스탬프에만.
- **간격**: 4px 스케일 `--sp-1…10`(4·8·12·16·20·24·32·40·48·64). 패널 패딩 16(모바일 14), 격자 gap 14(12), 페이지 좌우 20(16), kv 행 사이 6, 버튼·칩 나열 8. 컨트롤 높이 28/32/40. **터치 기기(`pointer:coarse`)는 36/44/48로 자동 승격.** 밀도 `<html data-density="compact">`는 패딩 12·gap 10·컨트롤 24/28/36(글자 크기는 그대로). 터치 기기는 compact에서도 컨트롤 36/44/48을 유지한다. **조작 영역은 하한이지 고정 상자가 아니다.** 컨트롤은 위 높이 스케일을 `min-height`로 받고, 정사각 아이콘 버튼은 같은 값을 `min-width`에도 받는다. **상자로 그리는** 조작 요소 중 스케일보다 작은 것(표 펼치기, 색 칩, 태그 닫기 같은 것)은 터치 기기에서 `--h-touch`(44)를 하한으로 받는다. **글줄의 일부로 그려지는** 조작 대상(`Link`)의 크기는 타이포 규칙이 정한다. 44로 키우면 위아래 줄을 침범해 이웃 줄의 링크가 눌리지 않는다. 상자 하한이 필요한 자리에는 `Link`가 아니라 `Button`·`IconButton`을 쓴다. 어떤 조작 대상도 24px 미만으로 그리지 않는다. 선언한 하한은 flex·grid 배치에서 줄어들지 않는다. 크기를 픽셀 리터럴로 다시 적지 않고 `--h-ctl-sm`/`--h-ctl`/`--h-ctl-lg`/`--h-touch`를 참조한다. 좁은 폭에서 자리가 부족하면 조작 요소를 줄이지 않고 항목을 접거나 감춘다.
- **브레이크포인트**: 뷰포트 4단 `sm 640 · md 768 · lg 1024 · xl 1380`(`--bp-*`, media는 리터럴). 컴포넌트 접힘은 컨테이너 5단 `xs 240 · sm 320 · md 480 · lg 640 · xl 900`(`--cq-*`, `@container`). 셸: ≥1024 레일, <1024 드로어, <768 상태바 숨김, <640 모달은 바텀시트. 최대 폭 `--content-max 1440`(`Container`), 폼 `--content-narrow 760`. iOS safe-area는 `--safe-*`로 셸이 흡수한다.
- **반경**: ctl 6 · panel 10 · sheet 14 · pill.
- **층·그림자**: 패널은 흰 면 + 1px 선, **그림자 없음**. `--elev-1/2/3`은 떠 있는 것(드롭다운·모달·토스트)에만. 블러 없음(모달 스크림만 반투명).
- **배경**: 단색. 이미지·패턴 없음. 그라디언트는 하는 일로 갈린다. **값이나 진행을 그리는** 그라디언트는 세 자리에 쓴다. 차트 면 채움(축이 있는 차트 alpha .14, 면이 겹치거나 높이 32 이하인 소형 차트 .2), 진행 구간과 남은 구간의 경계, 로딩 shimmer. **색을 예쁘게 하려는** 그라디언트는 어디에도 두지 않는다.
- **카드(Panel)**: `--panel` + 1px `--line` + 10px. 선택은 `border: signal + 0 0 0 1px signal`, 배경은 바꾸지 않는다. 빈 상태는 점선 + 침강 바탕. 카드 제목 14.5/500, 헤더 메타 12.5 `--ink-3`.
- **호버**: 배경 한 단계(panel → panel-2), 선 line → line-strong. **프레스**: signal-active, 크기 축소 없음. **포커스**: `--focus-ring` 2px 외곽선 + 2px 오프셋. 위험 동작은 crit 외곽선 버튼, 채움은 확인 모달 안에서만.
- **모션**: 짧고 절제. fast 120(hover·색) · base 180(토글·드롭다운·탭 잉크) · slow 260(드로어·모달) · gauge 600(게이지·바 값 변화, 차트 진입 1회). `--ease-out cubic-bezier(.2,.8,.2,1)`. 실시간 숫자는 트랜지션 없이 즉시 바뀐다(tabular-nums로 흔들림 방지). reduced-motion이면 전부 0. 상시 루프는 실시간 pulse·스피너·마스코트 깜빡임만. StatTile 등 수치 카운트업 없음(animate 기본 false).
- **레이아웃 고정 요소**: ≥1024 레일 228px(활성 항목 signal-tint 배경 + signal-ink 글자), 미만은 상단 바 48 + 오버레이 드로어. 화면 안 2차 내비는 상단 탭 44(활성 2px 밑줄 signal). 하단 상태바 28(데스크톱). 모바일 하단 탭바 없음. 패널 격자는 컨테이너 쿼리 우선(auto-fit 3열 · 2열 · 1열), media는 폴백.
- **이미지**: 장치 사진(4:3 크롭)만. 일러스트는 봉구 마크 하나. 특정 하드웨어를 흉내 내는 화면(LCD 미리보기, 조명 링 같은 것)은 그 제품의 것이므로 이 시스템에 두지 않는다.

## ICONOGRAPHY

- **Phosphor Icons, `weight="bold"` 고정.** 리액트에서는 `@phosphor-icons/react`, 정적 HTML·이 시스템의 카드에서는 Phosphor Bold 웹폰트(`tokens/icons.css`가 `fonts/phosphor/`의 셀프호스팅 웹폰트를 로드, CDN 없음). `Icon name="bell"` 래퍼가 이를 감싼다. React 프로젝트는 같은 아이콘 이름으로 `@phosphor-icons/react`의 `weight="bold"`를 대신 써도 된다.
- 크기 16 / 20 / 24, 색은 `currentColor`. 유니코드 도형은 상태 점(●)만 허용.
- **아이콘**은 Phosphor Bold에서만 온다. 손으로 그린 SVG를 아이콘으로 두지 않고, 이모지·유니코드 기호도 아이콘이 아니다(가운뎃점 `·`은 텍스트 구분자로만). **브랜드 마크**는 아이콘이 아니라 브랜드 자산이고 `MascotMark`(봉구) 하나뿐이다.
- 자산: `assets/mascot-neutral.svg`(정적 마스코트), `assets/favicon.svg`. 로고 워드마크는 없다. 브랜드 이름은 Spoqa 700 텍스트로 쓴다.

## fit 계약 (모든 컨테이너형 컴포넌트)

```jsx
<Chart kind="area" … />                       // fit="flex": 부모 폭, height만 지정
<Chart kind="radial" fit="fixed" width={124} height={92} … />
<Button fit="flex">모바일 전폭</Button>        // 컨트롤은 auto 기본
```
`components/core/frame.js`의 `frameStyle()`이 한 곳에서 구현한다. 새 컴포넌트도 이것을 쓴다. 결측 계약도 같은 방식으로 `components/core/missing.js`에 있다.

## 컴포넌트 사용 규칙

- 행 액션 3개 이상 → `DropdownMenu`, 목록 옆 상세 → `Drawer`, 복사 전용 값 → `CopyField`, JSON 입력 → `CodeEditor`, 긴 선택 목록 → `Combobox`.
- 밀도 격자는 `Heatmap`(ramp), 진행은 `ProgressBar`/`Stepper`, 시간축 사건은 `Timeline`, 설정 변경 비교는 `DiffView`.
- 수치 하나만 있는 타일은 허전하다. `StatTile`에 `detail`·`pill`·`icon`으로 "무엇이 N개인지"를 함께 보여준다.
- 격자는 `Grid`로만 만든다. 화면별 CSS에 격자를 다시 쓰지 않는다.
- 빈 상태·힌트 문구도 서술형으로 쓴다(예: '카드를 누르면 적용 대상으로 선택됩니다').
- **컴포넌트는 눈으로 확인할 수 있어야 한다.** 컴포넌트를 추가하면 세 곳을 함께 채운다. 자기 그룹의 `components/<그룹>/<그룹>.card.html`에 한 번 이상 그리고, `guidelines/index.html`의 목록과 목차에 넣고, `templates/dashboard`의 화면에서 실제로 쓴다. 화면이 직접 마운트하지 않는 `Toast`(ToastProvider가 렌더한다)만 템플릿 사용 대상에서 빠진다.

## Index

- `styles.css` · 진입점(@import만). `tokens/` fonts · colors · typography · layout · icons · base
- `styles/c-*.css` · 컴포넌트 클래스(action · input · status · data · chart · layout · overlay · feedback · extra · more)
- `fonts/` · Spoqa Han Sans Neo 300/400/500/700, JetBrains Mono latin/latin-ext (woff2), `fonts/phosphor/` Phosphor Bold 웹폰트(셀프호스팅)
- `assets/` · mascot-neutral.svg, favicon.svg
- `guidelines/` · `index.html`(컴포넌트 96개 목록 + 카드·템플릿을 검수 폭별로 열어 보는 가이드 페이지)와 색·타이포·간격·반응형·모션 스펙 카드 13장
- `theme-toggle.js` · 문서 카드 우상단 라이트/다크 토글(localStorage로 모든 카드 동기화). 제품에서는 `:root.dark` 클래스만 토글한다
- `components/` · 9그룹, `components/<group>/<Name>.jsx` + `.d.ts` + `.prompt.md`(사용법), 그룹별 카드(`*.card.html`). 스타일은 `styles/c-*.css`의 `bds-*` 클래스와 토큰만. 번들 네임스페이스는 `window.Ds_d3ea90`(훅은 대문자 export만 노출되므로 `ToastProvider.useToast()`로 접근).
- `templates/dashboard/` · 조립 예시. 가상 제품 "봉구 엣지 콘솔"을 이 시스템의 컴포넌트만으로 만든 클릭 가능한 대시보드(`Dashboard.dc.html`; 개요·노드·장치·배포·접근·설정 6화면 + 공개 상태 페이지, 라이트 기본 + 다크 토글). 소비 프로젝트는 `ds-base.js` 한 줄만 고쳐 쓴다.
- `build-bundle.mjs` · `_ds_bundle.js`·`_ds_manifest.json` 빌드. 컴포넌트 소스를 고치면 `node build-bundle.mjs`로 다시 만든다(`@babel/standalone` 필요, 없으면 `BABEL_STANDALONE=<경로>`)
- `token-parser.mjs` · `tokens/*.css`를 읽는 유일한 파서. 빌드와 검사가 같이 쓰고, 파서 자체는 `tests/fixtures/token-parser`가 검증한다

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
