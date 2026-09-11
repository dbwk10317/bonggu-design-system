# 봉구 대시보드 디자인 시스템 (Bonggu Dashboard DS)

운영·모니터링 대시보드를 위한 디자인 시스템입니다. 실시간 수치, 장치 제어, 사용자·리소스 관리처럼 **숫자가 많고 상태가 자주 바뀌는 화면**을 라이트·다크, PC·태블릿·모바일 어디서나 같은 규칙으로 그리기 위해 만들었습니다. 시각 규칙은 `봉구서버 스타일가이드 v1`을 토큰으로 옮긴 것이고, 마스코트 **봉구**(시츄+페키니즈 믹스)가 시스템의 감정 표현을 맡습니다.

## 설계 원칙

- **데이터는 nullable이 기본.** 수집되지 않은 값은 꾸미지 않고 **"수집 안 됨"**으로 그대로 보여준다. 일부 실패는 페이지 실패가 아니라 `degraded` + 해당 카드의 결측으로 표현한다. 표기 문구·판정·클래스는 `components/core/frame.js`의 fit 계약처럼 `components/core/missing.js` 한 곳에서 나온다(`MISSING_TEXT`·`isMissing()`·`bds-na`). `null`·`undefined`·`NaN`이 결측이고 `""`·`0`은 수집된 값이다. 이 판정은 표기만의 규칙이 아니다. 좌표·누적·합계·축 범위 같은 계산에도 같은 기준을 쓰고, 유한한 수가 아닌 값은 계산에 들어가지 않는다.
- **상태는 색 단독으로 전하지 않는다.** 항상 텍스트를 병기한다. 알림은 래치되어 읽음 처리 전까지 남는다.
- **고정 픽셀 대신 `fit` 계약 + 컨테이너 쿼리.** 모든 컨테이너형 컴포넌트가 `fit="flex" | "fixed" | "auto"`를 받는다. flex(기본)는 부모 폭을 채우고 `min-width:0`으로 격자에서 찌그러지지 않으며, fixed는 `width`/`height`를 그대로 쓴다. 열 숨김·격자 접힘은 뷰포트가 아니라 **컨테이너 폭**(`@container`) 기준이다. 차트는 ResizeObserver로 실제 픽셀을 재서 viewBox를 맞춘다. 격자는 `repeat(auto-fit, minmax(min(100%, N), 1fr))`로만 만든다.
- **전역 토큰은 별칭 없이 정본 하나로 유지한다.** 이름을 바꿀 때는 별칭을 추가하지 않고 정본을 개명한 뒤 모든 사용처를 함께 이관한다. 공개 토큰의 삭제·개명은 major 변경으로 처리하고 이관표를 제공한다.
- **차트와 UI는 한 팔레트, 한 크롬.** 차트 색은 범주형 8색(`--series-1~8`, oklch 명도 0.62·채도 0.14 고정), 의미 고정 쌍(`--series-rx/tx/used/reserved/free`), 순차 램프(`--ramp-1~6`) 세 계열만. 상태색은 임계선·미터 전용. 모든 차트(`Chart` kind 7종)는 격자(hairline)·축(mono 10.5)·범례·툴팁(elev-2)·빈 상태 크롬을 공유한다. 결측은 0으로 그리지 않고 종류마다 생략 방식이 정해져 있다. 선과 면은 구간을 끊고, 막대는 그리지 않으며 누적 합계에서도 뺀다. 파이는 세그먼트를 링과 합계에서 빼고 범례에는 결측으로 남긴다. 레이더는 결측 축에 닿는 선과 그 계열의 면 채움을 생략한다. 방사 게이지와 Sparkline은 값 자리에 결측을 표시한다. 어느 종류든 결측 하나가 축 범위나 다른 계열의 좌표를 바꾸지 않는다.
- **반응형 검수 폭**: PC 1280 · 태블릿 834 · 모바일 390 + 라이트(기본)·다크 양쪽이 항상 깨지지 않아야 한다.

## 동작 계약

이 문서가 규칙의 유일한 출처다. 기계로 판별할 수 있는 항목의 검사는 `tests/rule-regressions.cjs`에 있다. 작업 원칙은 [AGENTS.md](AGENTS.md), 검증 실행법은 [tests/README.md](tests/README.md)를 따른다. 코드 주석이나 컴포넌트 문서에 여기 없는 규칙을 새로 만들지 않는다.

**오버레이와 피드백**

- Modal·Drawer·NotificationDrawer는 네이티브 dialog의 개방 세션·포커스·스크롤 잠금 규칙을 공유한다. 확인 문구는 확인 세션 소유이며 폼 ID는 인스턴스별로 독립적이다. busy인 동안은 모든 닫기 경로를 막는다.
- CommandPalette는 모달 dialog 세션이다. 열면 포커스가 안에 갇히고 Esc·배경으로 닫히며 닫으면 열기 전 요소로 돌아간다. 열 때마다 새 세션이라 검색어와 강조는 남지 않는다. **명령은 세션이 닫힌 뒤에 실행된다.** 모달이 열려 있는 동안 바깥 요소는 inert라, 포커스를 옮기는 명령이 열린 채로 실행되면 아무 일도 일어나지 않기 때문이다. 명령이 포커스를 옮겼으면 닫힘 복원이 그것을 덮지 않는다.
- DropdownMenu는 네이티브 Popover API의 top layer를 사용해 표 스크롤과 분리한다. 메뉴의 수명은 소속 dialog의 개방 세션을 넘지 않는다. Popover API 지원 브라우저가 필요하다.
- Toast는 등장과 퇴장이 짝이다. `dismiss`는 퇴장 표시를 세운 뒤 `--dur-base`만큼 두었다가 목록에서 뺀다. reduced-motion이면 즉시 뺀다. 퇴장 중인 토스트는 `max` 계산에서 제외하고 클릭을 받지 않는다.

**입력**

- NumberStepper의 편집 문자열은 blur·Enter·증감 시 숫자로 확정한다. 빈칸은 마지막 값으로 되돌린다.
- OTP의 부분값은 중간 빈자리를 ASCII 공백으로 보존한다. 말미 공백만 생략하고 모든 칸이 숫자일 때만 완성으로 본다.
- MultiSelect는 선택한 뒤 활성 인덱스를 목록 시작으로 옮기고, 바뀐 목록 범위 안에서 키보드 이동을 계속한다.
- DatePicker는 외부 선택값이 바뀌거나 팝업이 다시 열릴 때 선택된 월로 맞춘다. 달을 넘기는 것만으로는 선택값이 바뀌지 않는다.
- Select의 선택값은 기본·compact·터치 컨트롤 높이 안에서 세로 중앙에 둔다. 목록은 네이티브 `select`가 그린다. `appearance: base-select`를 지원하는 브라우저에서는 같은 토큰으로 다시 그리고, 지원하지 않으면 브라우저 기본 목록으로 남는다. 목록 모양을 완전히 통제해야 하면 Select가 아니라 Combobox를 쓴다.

**데이터와 결측**

- 차트 데이터 정밀도는 픽셀 반올림과 분리한다. 누적 막대는 양수·음수를 각각 0에서 쌓고 양쪽 합계를 축 범위에 포함한다. 가용성은 `(ok+warn)/(ok+warn+crit)`이며 off는 분모에서 제외한다.
- UptimeBar의 구간은 컨테이너 안에서 같은 폭으로 나뉜다. 90칸의 최소폭과 간격을 고정해 작은 카드나 모바일에서 가로로 넘기지 않는다.
- **DataTable 행의 신원은 위치가 아니라 값이다.** `rowKey`나 `row.id`가 신원이고, 선택·펼침은 그 신원에 붙는다. 정렬은 표시만 하고 실제 정렬은 소비자가 `rows`에 반영하므로, 인덱스를 신원으로 쓰면 정렬·필터 뒤 같은 인덱스가 다른 레코드를 가리킨다. 신원 없이 선택·펼침을 켜면 알린다.
- DataTable에서 `render`가 없는 열의 `null`은 결측으로 표시한다. `render`가 돌려준 `null`은 React 규칙대로 빈 칸이다. 값 대신 빈 칸을 원하면 빈 문자열을 넘긴다.
- 결측 표기는 그리는 매체를 따른다. **HTML 텍스트**면 `bds-na`, **SVG 텍스트**면 `fill`로 색을 받고(Gauge), **텍스트가 아닌 칸**이면 track 색과 `title`로 알린다(UptimeBar). 문구 상수는 셋 다 공통을 쓴다. StatTile의 `deltaLabel`은 결측 표기가 아니라 보조 라벨이다.

**접근성**

- 조작 가능한 것은 네이티브 요소로 만든다. 시각 스타일만 바꾸는 prop은 조작 가능성을 뜻하지 않는다. `div`에 역할을 얹어야 한다면 role·tabIndex·Enter·Space를 컴포넌트가 함께 제공하고, 그렇게 하지 않을 것이면 그 prop이 시각 전용임을 문서에 적는다.
- 파생 정보를 접근 가능한 이름에 넣는 책임은 그 정보를 그리는 컴포넌트 한 곳에 둔다. 호출자는 기본 동작만 설명하는 이름을 넘기고 숫자를 직접 적지 않는다. 건수 단위는 "N건"으로 통일한다.
- 조작 대상은 서버 렌더에서 경고 없이 끝난다. 브라우저 전용 훅은 서버에서 같은 결과를 내는 형태로 감싼다.
- **셸은 본문으로 건너뛰는 링크를 낸다.** 화면마다 같은 내비게이션이 앞에 오므로, 키보드 사용자가 매번 그것을 지나야 본문에 닿는다. 링크는 첫 탭 스톱이고 평소에는 보이지 않다가 초점을 받으면 나타난다(`.bds-sr` 로 숨기기만 하면 초점을 받아도 보이지 않는다).
- **잘리는 스크롤 영역은 초점을 받는다.** 가로·세로로 내용이 잘리는 상자(넓은 표, 로그)는 `tabIndex=0`과 이름을 주고 그 영역을 뜻하는 역할(`region`·`log`)을 붙인다. 마우스 없이는 잘린 내용에 닿을 방법이 없다(WCAG 2.1.1).
- **라디오그룹과 그리드는 탭 스톱이 하나다.** 선택된 것(없으면 첫 항목)만 `tabIndex=0`이고 나머지는 `-1`이며, 화살표로 옮긴다. 옮길 때 선택과 **포커스를 함께** 옮긴다. 포커스가 따라가지 않으면 스크린리더가 옛 항목을 계속 읽는다. 화살표는 `preventDefault`로 페이지 스크롤을 막는다.
- **그림으로 그리는 데이터(Chart·Heatmap)는 세 가지를 함께 낸다.** ① 시각(`aria-hidden`), ② 같은 데이터를 담은 숨김 표(`bds-sr`), ③ 화살표로 지점을 옮기며 읽는 탐색 표면. 셋을 감싸는 루트는 `role="group"`이다. 루트에 `role="img"`를 두면 후손이 접근성 트리에서 잘려 숨김 표와 탐색 표면이 함께 사라진다.
- **탐색 표면은 `role="application"` + `tabIndex=0`이다.** 화살표를 컴포넌트가 받아야 하는데, 역할이 없으면 스크린리더의 브라우즈 모드가 화살표를 먼저 가져가 탐색이 동작하지 않는다. 표면은 접근 가능한 이름을 갖고, 현재 지점의 읽을거리를 `role="status"` 라이브 영역으로 알린다. 라이브 영역은 표면 밖(루트 안)에 두어야 갱신이 전달된다.

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

- **테마를 바꿀 때는 트랜지션을 끈다.** 테마를 뒤집으면 색·배경·선·그림자에 걸린 트랜지션이 한꺼번에 발화해 스냅이 아니라 번짐이 된다. 클래스를 토글하기 전에 `*,*::before,*::after{transition:none!important}`를 넣고, 리플로우로 확정한 뒤, 다음 프레임에 뺀다. 제품 앱이 `:root.dark`를 직접 토글하므로 이 처방은 제품에도 그대로 적용된다.
- **컴포넌트가 DOM id를 만들면 `useId`로 만든다.** 리터럴 id는 한 화면에 그 컴포넌트가 둘 있으면 `aria-controls`·`aria-activedescendant`·`htmlFor`가 서로를 가리킨다. 소비자가 `id`를 넘기면 그것을 쓰고, 없을 때만 만든다.
- **색**: 라이트 기본(`:root`), 다크는 `:root.dark` / `[data-theme="dark"]`에서 같은 이름, 명도만 반전. 살짝 차가운 중성 회색(`--canvas #fff`, `--canvas-sunken #f4f5f7`, `--panel-2/3`, `--line #e4e7ec`) 위에 **시그널 파랑 하나** `oklch(0.55 0.17 255)`. 시그널은 선택·포커스·주 버튼·활성 탭·송신(tx)에만 쓰고, 상태색 넷(`--ok` 초록 · `--warn` 호박 · `--crit` 빨강 · `--info` 청록)과 절대 섞지 않는다. 시그널과 각 상태색은 원색 · `-tint`(배경) · `-ink`(그 위 글자) 세 개를 갖춘다. `-tint` 배경 위의 글자는 언제나 같은 계열의 `-ink`를 쓴다. 원색은 채움 배경이고 그 위의 글자는 `-fg`이므로 원색을 글자색으로 쓰지 않는다. 본문 크기 글자와 배경의 대비는 라이트·다크 양쪽에서 4.5:1 이상이다. 미터 임계는 0~70 정상 · 70~90 주의 · 90~ 위험이고 값 텍스트도 같은 상태 잉크. **컨트롤을 식별하는 시각 요소**는 비텍스트 대비 3:1 이상이다. 입력·체크박스·스위치·드롭존은 경계선이 그 역할을 하므로 `--line-input`을 쓰고 면은 `--panel`과 같아도 된다. 채움이 식별을 맡는 자리(세그먼티드 컨테이너 같은 것)의 경계선은 `--line`이다.
- **타이포**: UI·본문 **Spoqa Han Sans Neo**(300·400·500·700), 수치·코드·식별자 **JetBrains Mono** + `tabular-nums`. 두 서체 역할을 절대 바꾸지 않는다(한글에 monospace 금지). 크기: display 28/700 · title 20/700 · heading 16 · subheading 14.5 · body 14/1.55 · label 12.5 · caption 11.5 · micro 10.5(mono 단위·타임스탬프만) · metric 24. 모바일은 display 24 · title 18 · metric 22. 한글 자간 0(음수 금지), 영문 대문자 라벨(CPU, VRAM)만 +0.06em. `word-break: keep-all`, 본문 14 이하로 내리지 않는다. 본문체(Spoqa) 최소 11.5px. 10.5px(micro)는 `.bds-mono` 계열 단위·타임스탬프에만.
- **모서리**: `--radius-ctl` 6(컨트롤) · `--radius-panel` 10(패널) · `--radius-sheet` 14(모달·시트) · `--radius-pill` 999(알약). 컨트롤 안에 드는 작은 컨트롤(닫기 버튼, 체크 상자, 색 견본, 목록 항목)은 `--radius-xs` 4를 쓴다. 상자 안에 상자를 넣으면 **안쪽 모서리 = 바깥 모서리 − 패딩**이고, 그 값이 토큰과 다르면 관계를 `calc()`로 적는다. **막대·잉크·격자 셀·구분선 같은 그래픽 마크**는 컨트롤이 아니다. 모서리가 도형 크기에 비례하므로 토큰이 아니라 그 자리의 값을 쓴다.
- **간격·밀도**: 4px 스케일 `--sp-1…10`(4·8·12·16·20·24·32·40·48·64). 기본 밀도는 패널 패딩 20(모바일 16), 격자 gap 20(16), 페이지 좌우 24(20), kv 행 사이 8, 버튼·칩 나열 12다. 패널 내부의 직접 자식과 기본 `Stack`은 16 간격을 쓴다. compact 밀도 `<html data-density="compact">`는 패널 패딩 12·격자 gap 10·페이지 좌우 16·kv 행 4·버튼 나열 6·컨트롤 24/28/36으로 줄이고 글자 크기는 유지한다. 기본 컨트롤 높이는 28/32/40이고 **터치 기기(`pointer:coarse`)는 36/44/48로 자동 승격**하며 compact에서도 이 터치 높이를 유지한다. **조작 영역은 하한이지 고정 상자가 아니다.** 컨트롤은 위 높이 스케일을 `min-height`로 받고, 정사각 아이콘 버튼은 같은 값을 `min-width`에도 받는다. **상자로 그리는** 조작 요소 중 스케일보다 작은 것(표 펼치기, 색 칩, 태그 닫기 같은 것)은 터치 기기에서 `--h-touch`(44)를 하한으로 받는다. **글줄의 일부로 그려지는** 조작 대상(`Link`)의 크기는 타이포 규칙이 정한다. 44로 키우면 위아래 줄을 침범해 이웃 줄의 링크가 눌리지 않는다. 상자 하한이 필요한 자리에는 `Link`가 아니라 `Button`·`IconButton`을 쓴다. 어떤 조작 대상도 24px 미만으로 그리지 않는다. 선언한 하한은 flex·grid 배치에서 줄어들지 않는다. 크기를 픽셀 리터럴로 다시 적지 않고 `--h-ctl-sm`/`--h-ctl`/`--h-ctl-lg`/`--h-touch`를 참조한다. 좁은 폭에서 자리가 부족하면 조작 요소를 줄이지 않고 항목을 접거나 감춘다.
- **브레이크포인트**: 뷰포트 4단 `sm 640 · md 768 · lg 1024 · xl 1380`(`--bp-*`, media는 리터럴). 컴포넌트 접힘은 컨테이너 5단 `xs 240 · sm 320 · md 480 · lg 640 · xl 900`(`--cq-*`, `@container`). 셸: ≥1024 레일, <1024 드로어, <768 상태바 숨김, <640 모달은 바텀시트. 최대 폭 `--content-max 1440`(`Container`), 폼 `--content-narrow 760`. iOS safe-area는 `--safe-*`로 셸이 흡수한다.
- **반경**: ctl 6 · panel 10 · sheet 14 · pill.
- **층·그림자**: 패널은 흰 면 + 1px 선, **그림자 없음**. `--elev-1/2/3`은 떠 있는 것(드롭다운·모달·토스트)에만. 블러 없음(모달 스크림만 반투명).
- **배경**: 단색. 이미지·패턴 없음. 그라디언트는 하는 일로 갈린다. **값이나 진행을 그리는** 그라디언트는 세 자리에 쓴다. 차트 면 채움(축이 있는 차트 alpha .14, 면이 겹치거나 높이 32 이하인 소형 차트 .2), 진행 구간과 남은 구간의 경계, 로딩 shimmer. **색을 예쁘게 하려는** 그라디언트는 어디에도 두지 않는다.
- **카드(Panel)**: `--panel` + 1px `--line` + 10px. 선택은 `border: signal + 0 0 0 1px signal`, 배경은 바꾸지 않는다. 빈 상태는 점선 + 침강 바탕. 카드 제목 14.5/500, 헤더 메타 12.5 `--ink-3`.
- **호버와 프레스는 표면 종류로 갈린다. 프레스는 호버에서 한 단계 더 간다.** 표면은 셋이다. **중립**은 호버 `--panel-2` · 프레스 `--panel-3`. **채움**은 호버 `--signal-hover` · 프레스 `--signal-active`(위험 채움은 `--crit`를 잉크와 섞어 한 단계씩 진하게). **틴트**는 호버 `--<tone>-tint` · 프레스 `color-mix(in oklch, var(--<tone>) 16%, transparent)`. 선은 호버에서 line → line-strong. **크기는 줄이지 않는다.**
- **눌러서 동작을 일으키는 표면은 호버와 프레스를 짝으로 낸다.** 짝이 없으면 터치 기기에서 아무 반응이 없다(호버가 없기 때문이다). 호버만 있고 프레스가 없는 것은 눌러도 아무 일도 하지 않는 강조 전용 표면(표 행, 로그 줄)이다. **포커스**: `--focus-ring` 2px 외곽선 + 2px 오프셋. 위험 동작은 crit 외곽선 버튼, 채움은 확인 모달 안에서만.
- **모션**: 짧고 절제. fast 120(hover·색) · base 180(토글·드롭다운·탭 잉크) · slow 260(드로어·모달) · gauge 600(게이지·바 값 변화, 차트 진입 1회). `--ease-out cubic-bezier(.2,.8,.2,1)`. 실시간 숫자는 트랜지션 없이 즉시 바뀐다(tabular-nums로 흔들림 방지). reduced-motion이면 전부 0. 상시 루프는 실시간 pulse·스피너·마스코트 깜빡임만. StatTile 등 수치 카운트업 없음(animate 기본 false).
- **레이아웃 고정 요소**: ≥1024 레일 228px(활성 항목 signal-tint 배경 + signal-ink 글자), 미만은 상단 바 48 + 오버레이 드로어. 화면 안 2차 내비는 상단 탭 44(활성 2px 밑줄 signal). 하단 상태바 28(데스크톱)이며 한글 상태 라벨은 UI 서체, 수치·시각·식별자만 `bds-mono`를 쓴다. 모바일 하단 탭바 없음. 패널 격자는 컨테이너 쿼리 우선(auto-fit 3열 · 2열 · 1열), media는 폴백.
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
- **그룹 카드는 예제의 소속을 바로 알 수 있어야 한다.** 컴포넌트 이름을 섹션 머리의 단순 목록으로 모아 쓰지 않고 해당 예제 바로 위 라벨에 둔다. 서로 관련된 예제는 선과 패딩이 있는 한 섹션으로 묶는다. 독립 섹션은 React 마운트 루트 안에서도 데스크톱 `--sp-8`, 모바일 `--sp-6`의 위아래·좌우 간격을 둔다. 그룹 카드와 값 카드는 `guidelines/card.css`의 기본 검수 밀도를 함께 쓴다.
- **문서 테마 조작은 보는 맥락으로 나눈다.** `guidelines/index.html` 안에 삽입된 카드와 템플릿은 가이드 상단 바의 토글 하나를 따르고 자체 토글을 그리지 않는다. 새 탭으로 연 독립 카드와 값 카드는 우상단 토글을 그린다.

## Index

- `styles.css` · 진입점(@import만). `tokens/` fonts · colors · typography · layout · icons · base
- `styles/c-*.css` · 컴포넌트 클래스(action · input · status · data · chart · layout · overlay · feedback · extra · more)
- `fonts/` · Spoqa Han Sans Neo 300/400/500/700, JetBrains Mono latin/latin-ext (woff2), `fonts/phosphor/` Phosphor Bold 웹폰트(셀프호스팅)
- `assets/` · mascot-neutral.svg, favicon.svg
- `guidelines/` · `index.html`(컴포넌트 96개 목록 + 카드·템플릿을 검수 폭별로 열어 보는 가이드 페이지), 검수 카드 공통 레이아웃 `card.css`, 색·타이포·간격·반응형·모션 스펙 카드 13장
- `theme-toggle.js` · 문서 테마 동기화. 가이드 상단 바 또는 독립 카드 우상단의 라이트/다크 토글을 사용한다. 제품에서는 `:root.dark` 클래스만 토글한다
- `components/` · 9그룹, `components/<group>/<Name>.jsx` + `.d.ts` + `.prompt.md`(사용법), 그룹별 카드(`*.card.html`). 스타일은 `styles/c-*.css`의 `bds-*` 클래스와 토큰만. 번들 네임스페이스는 `window.Ds_d3ea90`이고, 공개 진입점이 내보내는 것은 컴포넌트든 훅이든 그대로 올라간다(`Ds_d3ea90.useToast`). 내부 훅은 올리지 않는다.
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

### 공개 API·버전·배포 계약

- **패키지 식별자·라이선스**: 패키지명은 `@dbwk10317/bonggu-design-system`이고 저장소는 `https://github.com/dbwk10317/bonggu-design-system`이다. 프로젝트 코드는 `Copyright (c) 2026 dbwk10317`의 MIT License로 배포한다. 포함된 Spoqa Han Sans Neo·JetBrains Mono·Phosphor Icons는 `THIRD_PARTY_NOTICES.md`와 `licenses/`에 적힌 각 원래 라이선스를 유지한다.
- **공개 JS·타입 표면**: 위 Components 목록의 96개 컴포넌트와 `useToast`, 그리고 각 공개 컴포넌트·훅의 `.d.ts`가 내보내는 관련 `type`·`interface`가 공개 API다. `components/core/`, `components/data/chart-math.js`, `theme-toggle.js`, `useFieldContext`, `passwordStrength`는 내부 구현이며 공개 진입점에서 내보내지 않는다. 번들 네임스페이스는 공개 진입점을 그대로 따르지만, 정본은 `public-entry.js`다.
- **SemVer 경계**: 1.0.0 이후 patch는 공개 계약을 유지하는 수정, minor는 기존 사용법을 유지하는 선택적 API 추가, major는 공개 컴포넌트·훅·타입·토큰·경로의 삭제·개명, 필수 prop·기본 동작·이벤트 시점의 비호환 변경, 지원 환경 축소다. 기본 크기·간격·타이포가 기존 레이아웃을 깨뜨리는 변경도 major다. 폐기 예정 API는 대체 방법을 먼저 알리고 major에서 제거하며, 토큰 이름은 호환 별칭을 만들지 않고 major 이관표로 안내한다.
- **스타일 범위**: `styles.css`는 토큰, 폰트, 아이콘, 컴포넌트 스타일과 `tokens/base.css`를 함께 불러오는 단일 full-app 진입점이다. 명시적으로 import한 앱 전체의 `body`·제목·링크 등 전역 요소에 base/reset이 적용된다. 현재 일부 컴포넌트만 격리해 도입하는 scoped CSS 진입점은 없으며, 이 전역 영향을 받지 않는다고 가정하지 않는다.
- **테마·밀도**: 라이트가 기본이고 다크는 `:root.dark` 또는 `[data-theme="dark"]`, compact 밀도는 `<html data-density="compact">`로 선택한다. `theme-toggle.js`는 문서 카드 전용 자동 실행 스크립트라 공개 npm 진입점에 포함하지 않는다. 컴포넌트의 브라우저 API 접근은 effect 또는 이벤트 시점에만 일어나며 모듈 import 자체가 DOM·`localStorage`·테마를 바꾸지 않는다.
- **배포 자산 경로**: 배포물은 `styles.css`에서 `tokens/`·`styles/`를 불러오고 `tokens/`에서 `fonts/`를 불러오는 현재 상대 경로를 보존한다. `fonts/phosphor/`와 `assets/`도 패키지 안의 상대 경로 자산으로 제공하며 CDN이나 호스트 절대 경로에 의존하지 않는다.
- **검증된 환경**: 현재 자동 회귀가 확인하는 React 범위는 18.3.1이고 런타임 외부 import는 `react`뿐이다. `react-dom` import는 없다. 브라우저 동작은 현재 회귀 게이트의 Chromium 계열에서 검증한다. 다른 React 버전, Safari, Firefox, 검증하지 않은 프레임워크까지 지원한다고 선언하지 않는다.
- **변경 기록**: 소비자 코드·타입·토큰·스타일·동작에 영향을 주는 변경은 Changeset에 소비자 관점의 설명과 SemVer 영향도를 기록한다. 문서·검증·빌드 도구만 바뀌어 배포 결과가 같으면 빈 Changeset으로 의도를 표시하거나 릴리스 기록에서 제외할 수 있다. `CHANGELOG.md`는 Changesets가 릴리스별 변경 사실과 이관 안내를 생성하는 기록이며 정책의 정본은 아니다.

### 컴포넌트 선택 가이드
- 나열: 세로 `Stack`, 가로 `Inline`, 양끝 정렬 `Spacer`, 최대 폭 `Container`, 카드 격자 `Grid`(비대칭은 `columns={12}` + `GridItem span`), 비율 상자 `AspectRatio`, 뷰포트별 표시 `Visible`.
- 이동: 화면 5개 이하 `TopNav`, 그 이상 `SidebarShell`. 3단 이상 깊이 `Breadcrumb`, 20행 초과 목록 `Pagination`, 키보드 이동 `CommandPalette`(⌘K), 인라인 이동 `Link`.
- 선택: 2~3개 `SegmentedControl`, 2~5개(설명 포함) `RadioGroup`, 6개 이상 `Select`, 검색 필요 `Combobox`, 여러 개 `MultiSelect`. 날짜 하나 `DatePicker`, 기간 `DateRangePicker`, 시각 `TimePicker`. 비밀번호 `PasswordField`, 인증 코드 `OTPInput`.
- 표시: 사람·서비스 `Avatar`, 건수 `Badge`(0이면 없음), 상태 문구 `StatusPill`, 분류 `Tag`. 접이식 `Accordion`(설정 고급 옵션만), 클릭 설명 패널 `Popover`, 한 줄 설명 `Tooltip`.
- 피드백: 필드·카드 안 한 줄 `InlineMessage`, 페이지 `AlertBanner`, 일시 `Toast`. 재조회 `LoadingOverlay`, 첫 로딩 `Skeleton`. 파괴적 동작 `ConfirmDialog`(crit 채움은 여기서만). 카드 실패 `ErrorState`, 빈 결과 `EmptyState`, 값 하나 결측은 텍스트 "수집 안 됨".
- 수치: 사용률 하나 `Gauge`(70/90 자동 톤), 증감 `TrendDelta`(나쁜 지표는 inverse), 공유 범례 `Legend`, 가용성 `UptimeBar`.

## 패키지·버전·배포 전환 계획 (작업 인계)

작성일: 2026-09-09. 상태: 1~2단계 검증 완료, 3단계 Changesets·CI·버전 PR 자동화 완료, 실제 publish 설정 전.

이 절은 후속 에이전트의 작업 계획이다. 현재 제공 중인 기능이나 지원 보장을 뜻하지 않는다. 각 단계에서 확정한 계약은 이 문서의 해당 규범에 반영하고, 이 절에는 진행 상태와 남은 작업을 갱신한다. 별도 계획 파일이나 코드 주석을 규칙의 출처로 만들지 않는다.

### 목표와 범위

첫 목표는 회귀 게이트와 독립 fixture로 검증한 정식 `1.0.0`을 발행하는 것이다. 실제 소비 프로젝트 적용은 그 뒤에 온다. 소비처는 정식 버전을 설치해서 쓰는 것이지 발행의 선행 조건이 아니다. 컴포넌트·타입·토큰·CSS·폰트·자산을 단일 패키지와 단일 버전으로 배포한다. 기존 HTML 카드·대시보드용 브라우저 번들도 같은 소스에서 계속 생성한다.

패키지명은 `@dbwk10317/bonggu-design-system`, 라이선스는 `Copyright (c) 2026 dbwk10317`의 MIT License로 확정했다. 배포 레지스트리와 패키지 공개 범위는 아직 확정하지 않았다. 이를 결정하기 전에는 `private: true`를 유지하고 로컬 `.tgz` 설치까지만 진행한다. 이 계획은 외부 공개나 계정 생성의 실행 승인을 뜻하지 않는다.

목표 소비 형태:

```tsx
import { Button, Panel } from '@dbwk10317/bonggu-design-system';
import '@dbwk10317/bonggu-design-system/styles.css';
```

초기 범위에서 컴포넌트별 패키지 분리, 토큰의 독립 버전, CommonJS 이중 배포, 새 문서 플랫폼 구축은 제외한다. 실제 소비 요구가 생기면 범위를 다시 정한다.

### 현재 구현 현황

- 루트 `package.json`과 단일 lockfile이 패키지 빌드와 `tests` workspace의 검증 도구를 함께 고정한다. 검증한 React 버전은 18.3.1이다. Changesets와 GitHub 버전 PR 자동화는 구성했고 실제 publish는 비활성 상태다.
- `build-bundle.mjs`는 기존 `window.Ds_d3ea90` 번들·매니페스트·adherence를 만들고, `build-package.mjs`는 같은 컴포넌트 소스에서 ESM·타입·CSS·자산 패키지를 만든다.
- `styles.css`의 CSS·폰트·아이콘 상대 경로는 배포물에서도 보존되며 독립 fixture가 모든 참조를 검사한다.
- `theme-toggle.js`는 기존 문서용 브라우저 번들에만 남고 npm 공개 진입점에는 포함되지 않는다. 패키지 import 전후 DOM·localStorage 불변을 검사한다.
- `tokens/base.css`의 body·제목·링크 전역 적용은 full-app 스타일 계약이며, 설치 패키지와 기존 앱 CSS를 함께 로드하는 브라우저 fixture가 이 영향을 검사한다.
- 공개 표면·SemVer·스타일·테마·밀도·자산 경로·검증 환경 계약은 이 문서의 공개 API·버전·배포 계약에 확정했다.

착수 에이전트는 `git status`, 현재 소스, 이 문서, `tests/rule-regressions.cjs`, `tests/README.md`를 다시 확인한다. 컴포넌트 변경 전에는 해당 `.d.ts`·`.prompt.md`·실제 사용처를 비교한다. 아래 파일명 중 아직 없는 것은 신설 후보이며, 구현 시 기존 구조와 맞춰 확정한다.

### 1단계: 공개 계약과 패키지 기반

상태: 작업 1~8의 계약·패키지 기반 구현과 저장소 내 build·pack 검증 완료. 독립 fixture 설치 검증은 2단계에서 진행한다.

작업:

1. 공개 컴포넌트·훅·타입·CSS 토큰·테마·밀도·자산 경로를 조사하고 공개 진입점을 명시한다. 기존 번들의 대문자 export 필터를 npm 공개 API 정의로 그대로 사용하지 않는다. 내부 helper는 공개 목록과 분리한다.
2. 이 문서에 버전별 호환 정책, 공개 API 경계, CSS 적용 범위, 지원 환경을 확정한다. 토큰 별칭 금지는 유지하고 이름 변경은 major와 이관표로 처리한다.
3. 루트 `package.json`, 공개 JS·타입 진입점, 패키지 빌드 스크립트를 추가한다. 개발 도구는 lockfile로 고정하고, 기존 테스트 의존성과 중복 버전이 생기지 않도록 설치 구조를 정리한다. 설치 명령 변경은 `tests/README.md`에 반영한다.
4. ESM과 `.d.ts`를 배포하고 `exports`로 공개 경로를 제한한다. React는 external·peer dependency로 관리한다. react-dom 등 나머지 의존성은 실제 import를 조사해 분류한다. 지원 버전 범위는 검증 결과로 정한다.
5. 배포용 CSS·폰트·아이콘·브랜드 자산을 생성하거나 복사하고 파일 간 상대 경로를 검증한다. CSS가 tree shaking으로 제거되지 않도록 sideEffects 설정을 맞춘다.
6. 전체 앱 적용용 스타일과 기존 앱의 컴포넌트 도입용 스타일의 경계를 정한다. 전역 reset, 토큰 scope, 폰트 로딩을 명시하며 기존 템플릿의 스타일은 유지한다. 단순히 reset을 빼고 정상 동작한다고 가정하지 않는다.
7. 문서 테마 토글의 자동 실행을 npm 진입점에서 분리한다. npm import만으로 DOM·테마·localStorage를 변경하지 않게 하고 SSR import를 검증한다.
8. `files`로 배포 파일을 제한하고 라이선스·제3자 자산 고지를 확인한다. 라이선스 종류나 자산 사용 권한을 임의로 정하지 않는다.

주요 변경 대상: `readme.md`, 루트 패키지·lockfile, 공개 진입점, 패키지 빌드 스크립트, `build-bundle.mjs`, CSS 진입점, 관련 컴포넌트 문서·타입, `tests/README.md`.

완료 기준: `npm pack` 산출물을 저장소 밖의 독립 fixture에 설치하여 공개 import·타입·CSS·폰트 로딩이 성공한다. 기존 브라우저 번들도 다시 생성되고 기존 검증을 통과한다.

### 2단계: 배포 패키지 검증

1단계 산출물인 `.tgz`를 설치해 검증한다. 소스 alias나 원본 저장소 경로로 연결하는 fixture는 배포 검증을 대신하지 못한다.

상태: 검증 완료. 실제 pack 산출물의 file dependency 설치, 공개 TSX·관련 타입, 내부 경로 차단, ESM import·서버 렌더·hydration, import 시 DOM·localStorage 불변, 프로덕션 번들과 React 단일 사본, CSS·폰트·아이콘·exported assets 경로, tarball 내용 제한과 연속 pack 재현성을 확인한다. 설치 패키지 브라우저 fixture는 Button·Toast 상호작용과 라이트·다크 × 기본·compact × 1280·834·390의 12개 조합, 가로 넘침, 기존 앱 CSS와 full-app base/reset 통합을 Chromium에서 검사한다.

| 검증 | 확인할 결과 |
|---|---|
| 공개 API·타입 | 공개 export 누락 없음, 실제 TypeScript 소비 빌드 성공, 내부 경로 접근 제한 |
| React 프로덕션 빌드 | 미변환 JSX·깨진 모듈 경로 없음, React 중복 포함 없음 |
| 정적 자산 | CSS·폰트·아이콘 요청 성공, 파일 누락·404 없음 |
| SSR·hydration | import 시 브라우저 전역 오류 없음, 서버 렌더·hydration 경고 없음 |
| 지원 환경 | 선언한 React·타입 조합 검증, 빌드 도구의 Node 요구와 소비 런타임 요구 구분 |
| 시각·동작 | 라이트·다크, 밀도, 1280·834·390 폭, 기존 앱 CSS와의 통합 검증 |
| 패키지 내용 | 필수 산출물·고지 포함, 로컬 설정·테스트 출력 등 불필요 파일 제외 |
| 재현성 | 깨끗한 checkout과 lockfile에서 빌드·pack 성공, 생성물 차이 확인 |

기존 회귀 게이트를 유지하고 실제 패키지 실패 조건의 검사를 추가한다. 기계로 판별 가능한 새 규범의 검사는 `tests/rule-regressions.cjs`에 연결하고, 통합 fixture 실행법·범위는 `tests/README.md`에 기록한다. 문서의 게이트 범위가 실제 실행 내용과 어긋난 부분도 맞춘다.

일반 React fixture를 먼저 만들고, 실제 소비처가 Next.js이면 해당 환경과 클라이언트 경계 검증을 추가한다. 검증하지 않은 프레임워크나 브라우저를 지원한다고 기재하지 않는다.

완료 기준: 원본 소스에 접근하지 않는 설치·빌드·실행 검증과 기존 회귀 검증이 모두 통과한다.

### 3단계: 버전과 릴리스 자동화

상태: Changesets 3.0.2, GitHub PR 검증, main의 버전 PR 자동화와 publish 비활성 회귀 게이트는 완료했다. 패키지명·scope·라이선스는 확정했고 레지스트리·공개 범위가 미정이라 beta publish, 인증, 태그와 GitHub Release 연결은 미착수다.

정식 버전의 분류는 이 문서의 공개 API·버전·배포 계약을 따른다. 아래 표는 릴리스 자동화가 적용할 변경 분류다.

| 분류 | 기준 |
|---|---|
| patch | 공개 계약을 유지하는 버그 수정 |
| minor | 기존 소비 코드를 유지하는 컴포넌트·선택적 기능 추가 |
| major | prop·토큰·공개 경로 삭제 또는 개명, 이벤트 계약 변경, 지원 환경 축소 |

출시 흐름은 `1.0.0-beta.N` 통합 검증 후 `1.0.0` 정식 출시다. 사전 검증 패키지는 `next`, 정식 패키지는 `latest` 채널로 구분한다. 초기 유지보수 대상은 최신 정식 major로 제안하며, 지원 범위는 출시 전에 이 문서에 명시한다.

작업:

1. Changesets를 도입한다. PR에 소비자 관점의 변경 설명과 버전 영향도를 기록하고, 릴리스 PR에서 버전·changelog를 검토한다.
2. changelog는 릴리스별 변경 사실과 이관 안내를 담는 생성 기록으로 정의한다. 이 역할을 `AGENTS.md`의 파일 역할표에도 추가하고 정책 자체는 이 문서에 둔다.
3. 실제 Git 호스팅 환경을 확인해 CI를 구성한다. GitHub 사용 시 `.github/workflows/`에 PR 검증과 릴리스 workflow를 둔다.
4. 릴리스 커밋에서 빌드·pack·설치 검증 후 검증한 동일 `.tgz`를 배포한다. 배포 단계에서 별도 재빌드하여 검증 대상과 달라지지 않도록 한다.
5. 패키지 버전·Git 태그·릴리스 기록을 연결한다. 동일 버전 중복 실행과 부분 실패 재시도를 처리하고, 이미 배포된 버전을 덮어쓰려 하지 않는다.
6. 레지스트리에 맞는 CI 인증을 설정한다. 공개 npm을 선택한 경우 지원 조건을 확인해 trusted publishing·provenance를 적용한다. 자격 증명을 저장소에 기록하지 않는다.
7. 레지스트리·공개 범위가 확정되기 전에는 실제 publish를 활성화하지 않는다. 로컬 pack과 CI 검증 작업은 먼저 완료한다.

완료 기준: 릴리스 PR에서 버전과 기록을 검토할 수 있고, 배포 설정 확정 후 beta 패키지를 설치 가능한 상태로 발행한다. 외부 설정이 미확정이면 pack·CI 완료 상태와 남은 설정을 구분해 보고한다.

### 4단계: 1.0.0 발행

1. beta에서 확인한 문제를 해결하고 1.0.0 설치 안내, 지원 환경, 공개 API, 변경 기록을 확정한다.
2. 가이드에 버전을 표시하고 해당 태그에서 같은 버전의 문서·예시를 확인할 수 있게 한다. 별도 문서 플랫폼 구축 없이 시작한다.
3. 패키지 버전·Git 태그·릴리스 기록이 같은 커밋을 가리키는지 확인하고 `1.0.0`을 발행한다.

완료 기준: 회귀 게이트와 독립 fixture 검증을 통과한 `1.0.0`이 발행되고, 같은 버전의 문서·태그·변경 기록이 함께 제공된다.

### 5단계: 소비 프로젝트 적용

1.0.0 발행 뒤에 진행한다. 여기서 발견한 문제는 1.0.0의 미완이 아니라 다음 patch·minor의 입력이다.

1. 실제 소비 프로젝트 하나를 선정한다. 경로·접근 권한이 없으면 해당 정보만 요청한다.
2. 기존 폴더 연결 또는 소스 복사를 패키지 import로 전환한다. CSS·테마·폰트·타입·오버레이·차트 등 실제 사용 흐름을 검증한다.
3. 소비 프로젝트는 정확한 버전과 lockfile로 고정한다. 업데이트 PR에서 changelog·이관 안내·대표 화면을 검토하도록 절차를 문서화한다.
4. 이전 패키지 버전과 lockfile로 되돌리는 동작을 검증한다. 잘못 배포된 버전은 레지스트리 기능에 맞게 사용 중단 안내하고 수정 버전을 발행한다.

완료 기준: 실제 소비 프로젝트에서 설치·빌드·화면·업데이트·버전 복귀가 검증된다.

### 인계와 결과 보고

진행 상태는 단계별로 미착수·진행 중·검증 완료를 기록한다. 현재 1단계 패키지 기반, 2단계 독립 `.tgz` 소비·브라우저 통합, 3단계의 Changesets·GitHub CI·버전 PR 자동화는 완료했다. 3단계의 실제 beta publish·인증·태그·GitHub Release와 4~5단계는 미착수다. 후속 작업은 외부 결정 사항을 확정해 publish를 활성화하고 4단계로 `1.0.0`을 발행하는 것이다. 5단계는 그 뒤에 실제 소비 프로젝트 경로를 받아 진행하며, 1.0.0 발행을 막지 않는다.

확정된 외부 결정은 패키지명 `@dbwk10317/bonggu-design-system`과 MIT License 저작권자 `dbwk10317`이다. 남은 외부 결정 사항은 배포 레지스트리·공개 범위와 실제 소비 프로젝트 경로다. 미확정 값을 확정값처럼 배포 설정에 넣지 않는다.

최종 보고에는 변경 원인, 확정한 README 계약, 수정 방식, 기존 템플릿·소비 코드 영향, 실행한 검증과 결과, 배포 여부·버전, 남은 외부 설정을 포함한다. 소스 변경 시 기존 번들·매니페스트·adherence 생성물을 재생성하고 직접 편집하지 않는다.

참고한 공식 자료:

- [MUI 버전 정책](https://mui.com/material-ui/getting-started/versions/): SemVer에 따른 릴리스 분류.
- [Atlassian 릴리스 단계](https://atlassian.design/release-phases/): 기능의 안정화·폐기 단계 구분.
- [Changesets](https://github.com/changesets/changesets): 변경 설명·버전·changelog·배포 관리.
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/): 배포 산출물의 출처 연결. 구현 시 최신 지원 조건을 다시 확인한다.
