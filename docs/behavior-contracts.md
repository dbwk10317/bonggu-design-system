# 동작 계약과 근본 원인 수정

2026-09-09 추가 리뷰의 12건을 원인별로 정리했습니다. readme는 시각 원칙, .d.ts는 공개 API, .prompt.md는 사용 계약을 담당하며 세 자료와 구현을 함께 갱신합니다.

## 후속 검증과 생성 규칙

추가 검수에서 생성물이 이전 설정의 우연한 상태를 되풀이하지 않도록 원천과 검사 경계를 정했습니다.

- `tokenKinds`는 `tokens/*.css`의 `@token-kinds` 원천 주석에서만 생성합니다. 모든 토큰은 이 주석에 한 번씩 분류되어야 하며, 누락·중복·정의되지 않은 주석이 있으면 번들 생성이 실패합니다. 기존 `_adherence.oxlintrc.json` 값이나 CSS 값 추정은 분류 근거로 사용하지 않습니다.
- prop 규칙 생성기는 실제 함수 선언의 props 타입을 따라갑니다. 인터페이스 본문과 상속, type alias와 union, 인라인 객체를 해석하고 React의 HTML/SVG attribute 계열은 표준·ARIA·data 속성이 열려 있는 계약으로 처리합니다. `Code`와 `Kbd`는 직접 HTML attributes를 받으므로 미지 prop 금지 규칙을 만들지 않습니다. `Chart`는 union 전체의 허용 prop과 `kind`·`fit`·`xTicks` 값을 검사하고, `SidebarNavGroup`·`ToastProvider`·`ToolbarGrow`는 인라인 props 선언을 검사합니다.
- `.bds-num`과 `.bds-clamp-1/2`는 선언 외 사용처와 문서 계약이 처음부터 없었으므로 삭제 상태를 유지합니다. `.u-num`·`.u-data`·`.u-caps`도 공개 계약이 없고 `bds-` namespace 규칙에 맞지 않으므로 제거합니다. 수치·데이터·대문자 표기는 컴포넌트 전용 `bds-*` 클래스와 토큰으로 처리합니다.
- readme에서 기계적으로 판별 가능한 규칙 6종을 `tests/rule-regressions.cjs`로 이관했습니다. 가시 텍스트 em-dash, 색·폰트 inline style, CSS class의 `bds-` 접두사, 토큰 별칭, 본문 글자 크기, Phosphor Bold 아이콘 이름을 검사하며 기존 위반은 함께 수정했습니다.
- 반경을 포함한 컴포넌트 토큰 별칭은 정본으로 사용처를 모두 이관한 뒤 정의를 삭제했습니다. 이 시스템은 자체 완결을 목표로 하므로 이전 소비 프로젝트와의 별칭 호환을 유지하지 않습니다.

공개 영향은 세 가지입니다. 토큰 별칭과 미사용 유틸리티가 제거되어 그 이름을 직접 참조하던 외부 코드와 내부 class 이름 의존은 수정이 필요합니다. `Code`·`Kbd`에서는 표준 HTML attributes를 계속 사용할 수 있고, 제한 규칙이 생긴 `Chart` 및 인라인 props 컴포넌트는 선언된 prop만 허용됩니다. 토큰 종류와 prop 규칙이 원천에서 다시 생성되므로 생성물을 직접 고친 설정은 다음 빌드에서 유지되지 않습니다.

## 오버레이: 인스턴스와 개방 세션

| 문제 | 원인 분류 | 기준과 해결 |
|---|---|---|
| 서로 다른 FormModal이 같은 폼 제출 | 구현 오류: 문서 전체 ID를 인스턴스 ID로 사용 | useId로 폼과 외부 제출 버튼을 인스턴스별 연결 |
| ConfirmDialog 재개방 시 이전 입력 유지 | 상태 수명 계약 누락 | 확인 문구는 개방 세션 소유. 닫으면 세션 종료, 확인 대상 문자열이 바뀌면 새 세션 |
| Modal size 무효 | DOM 구조 변경 후 CSS 계약 불일치 | 크기 modifier는 --modal-width만 결정하고 패널/모바일 규칙은 배치를 담당 |
| NotificationDrawer 배경 포커스 노출 | 공통 구조 부재 | 별도 드로어 구현을 제거하고 Drawer에 내용만 전달 |
| 표 안 메뉴 잘림 | 레이어 계약 누락 | 표 overflow는 유지. 메뉴는 native popover top layer, 트리거 기준 fixed 배치 |

Modal과 Drawer는 useModalDialog 하나로 네이티브 showModal/close, 스크롤 잠금, 포커스 복귀를 공유합니다. 문서별 활성 세션을 관리하여 중첩 또는 역순 닫기에도 마지막 세션이 닫히기 전까지 잠금을 유지합니다. busy인 FormModal/ConfirmDialog는 모든 닫기 경로를 차단합니다.

비모달 메뉴는 모달로 취급하지 않습니다. useAnchoredPopover가 뷰포트 경계·스크롤·크기 변경을 처리하며 React DOM 소속과 테마 상속을 유지합니다. 메뉴에서 Esc를 누르면 메뉴만 닫히고 부모 dialog는 유지됩니다. 메뉴 내부가 길면 자체 스크롤을 사용합니다. Popover API 지원 브라우저가 필요하며, 미지원 환경에서 잘리는 대체 구현을 유지하지 않습니다.

메뉴의 수명은 소속 dialog의 개방 세션을 넘지 않습니다. 부모가 닫히면 남아 있는 manual popover를 숨기고 메뉴의 open 상태도 종료합니다. 다시 열린 드로어에 이전 메뉴가 남지 않도록 검증합니다.

기존 NotificationDrawer의 독립 레이어 CSS와 Drawer의 중복 dim을 제거했습니다. feedback 카드의 강제 inline 드로어 예시도 실제 열기/닫기 사용으로 바꾸었습니다.

## 피드백: 토스트의 수명

| 문제 | 원인 분류 | 기준과 해결 |
|---|---|---|
| 토스트가 등장 애니메이션만 있고 툭 사라짐 | 구현이 CSS 계약을 이행하지 않음 | 등장 `bds-toast-in`과 짝인 퇴장 `bds-toast--leaving`을 ToastProvider가 실제로 세운다 |

`dismiss`는 목록에서 곧바로 빼지 않고 해당 항목에 `leaving`을 세운 뒤 `--dur-base`(180ms)만큼 두었다가 제거합니다. 등장만 있고 퇴장이 없으면 readme 모션 규칙의 일관성이 깨지고, CSS에 이미 있던 퇴장 규칙은 죽은 코드로 남습니다. 지연 언마운트가 늘어나는 대신 상태는 항목의 불리언 하나뿐이고 별도의 전환 관리자는 두지 않았습니다.

경계 조건과 근거:

- **reduced-motion**: `matchMedia("(prefers-reduced-motion:reduce)")`이면 `leaving`을 세우지 않고 즉시 제거합니다. 전역 CSS가 트랜지션을 0으로 만들어도 목록에서 빠지는 시점은 JS가 정하므로, 자리만 180ms 남는 일을 만들지 않습니다.
- **연속 닫기**: 같은 토스트를 다시 닫아도 `leaving`은 그대로이고 제거 시도만 한 번 더 일어납니다. 이미 없는 id를 제거하는 것은 무시됩니다.
- **max 초과**: 퇴장 중인 토스트는 자리를 비우는 중이므로 `max` 계산에서 제외합니다. 그렇지 않으면 사라지는 중인 토스트가 살아 있는 토스트를 밀어냅니다. `max`를 넘겨 잘려나가는 토스트는 종전처럼 애니메이션 없이 즉시 사라집니다.
- 퇴장 중에는 `pointer-events:none`이라 사라지는 토스트의 행동 버튼을 누를 수 없습니다.

공개 영향: `Toast`에 `leaving?: boolean`이 추가됩니다. Provider가 세우므로 직접 그리는 경우가 아니면 쓸 일이 없습니다. `useToast().dismiss(id)` 호출 뒤 토스트가 DOM에서 빠지는 시점이 즉시에서 180ms 뒤로 바뀝니다.

## 입력: 편집 상태와 확정값

| 문제 | 원인 분류 | 기준과 해결 |
|---|---|---|
| NumberStepper 첫 숫자/빈칸 강제 변환 | 편집 문자열과 숫자 확정값 혼동 | draft는 입력 그대로, blur/Enter/증감 시 숫자 확정·범위 보정. 빈칸은 마지막 값으로 복원 |
| MultiSelect 선택 후 Enter 무반응 | 파생 목록과 활성 인덱스 불일치 | 선택 후 시작점으로 이동, 변경된 목록 범위에 맞는 activeIdx로 렌더·키보드 처리 통일 |
| DatePicker 외부값과 표시 월 불일치 | 선택값과 탐색 월의 동기화 계약 누락 | 외부 선택 변경과 팝업 재개방 시 선택 월로 동기화. 달 탐색 자체는 선택값을 바꾸지 않음 |
| OTP 중간 삭제 시 뒷자리 당김 | 문자열이 자리별 빈칸을 표현하지 못함 | 부분 문자열의 ASCII 공백은 빈자리. 말미 공백만 생략하고 모든 칸이 숫자일 때만 onComplete |

OTP는 부모가 전달한 value로 화면을 결정합니다. 부모의 echo를 추측해서 숨은 자리 상태를 유지하거나 소비자에게 강제 리마운트를 요구하지 않습니다.

## 데이터: 의미와 정밀도

| 문제 | 원인 분류 | 기준과 해결 |
|---|---|---|
| 작은 소수 눈금이 0에 겹침 | 데이터 계산에서 픽셀 반올림 함수 재사용 | niceTicks는 step 기반 데이터 정밀도를 유지, r1은 좌표에만 사용 |
| 양음 누적 막대 잘림 | 축 계산과 막대 계산의 의미 불일치 | stackBars가 양수·음수를 각기 0에서 누적하고 범위와 band를 함께 산출 |
| warn이 가용성에서 차감됨 | 구현이 기존 주석의 지표 정의 위반 | 가용성=(ok+warn)/(ok+warn+crit). off는 분모 제외, 전부 off면 결측 |

UptimeBar를 정상률로 조용히 바꾸지 않았습니다. 가용성과 정상률은 다른 지표이므로 기존 ok+warn 계약을 타입·문서에도 명시했습니다. 명시적 uptime prop은 종전처럼 우선합니다.

## 결측: 표기의 단일 출처

| 문제 | 원인 분류 | 기준과 해결 |
|---|---|---|
| DataTable이 null을 빈 칸으로 감춤 | 구현이 readme 최상위 원칙 위반(`?? ""`) | 값 열의 결측은 빈 칸이 아니라 "수집 안 됨"으로 표시 |
| 결측 판정이 문자열 동등비교 | 공통 구조 부재. 문구 상수가 컴포넌트마다 재선언 | 판정·문구·클래스를 core/missing.js 한 곳에서 내보내고 비교도 그 상수로만 |
| 표기 스타일이 인라인·죽은 클래스·네임스페이스 밖 클래스로 갈라짐 | 공통 구조 부재 | 표기 클래스 `bds-na` 하나. 선언은 styles/c-data.css의 한 블록뿐 |

`components/core/missing.js`가 `MISSING_TEXT`·`MISSING_CLASS`·`isMissing()` 셋을 내보냅니다. `frameStyle()`이 fit 계약을 한 곳에서 구현하듯, 결측 계약도 여기 하나입니다.

판정 규칙(`isMissing`)과 근거:

- `null`·`undefined`는 결측입니다. "데이터는 nullable이 기본"의 기본형입니다.
- `NaN`은 결측입니다. 계산이 실패한 수치를 "NaN"으로 꾸며 보여주지 않습니다. 결측을 꾸미지 않는다는 원칙과 같은 이유입니다.
- `MISSING_TEXT` 문자열은 결측입니다. 이미 문구로 포맷해서 넘기는 사용처를 계속 지원합니다(아래 호환성 참조). 문자열 비교는 이 파일 한 곳에만 있으므로 문구를 바꾸면 판정과 표기가 함께 움직입니다.
- `""`·`0`·`false`는 값입니다. 수집된 결과가 비어 있거나 0인 것과 수집 실패는 다른 사실이며, 빈 문자열을 결측으로 보면 의도한 빈 칸이 전부 "수집 안 됨"이 됩니다.
- ReactNode(요소·배열)는 판정하지 않습니다. 노드를 만드는 것은 소비자 몫이고 React 규칙(`null` = 아무것도 그리지 않음)을 따릅니다. 그래서 `DataTable`의 `render` 있는 열은 반환된 `null`을 결측으로 보지 않고, `render` 없는 열의 `row[key]`만 위 규칙으로 판정합니다.

`isMissing`은 **어떻게 보여줄지**를 정합니다. 차트의 좌표·누적 계산은 종전대로 값이 `null`인지로 판단하며(결측 구간에서 선을 끊고 레이더는 면 채움을 생략), 이번 변경으로 기하는 바뀌지 않았습니다.

통일한 곳: BarList · KeyValues · Heatmap · Chart · DataTable · Gauge · TrendDelta · UptimeBar · StatTile. 통일하지 않은 것 둘은 성격이 다릅니다.

- Gauge의 결측 문구는 SVG `text`라 색이 `color`가 아니라 `fill`입니다. 문구만 공통 상수를 쓰고 표기는 기존 `.bds-gauge--off .bds-gauge__v`가 계속 담당합니다. `.bds-na`를 겹쳐 붙이면 이기지도 못하는 규칙이 하나 늘 뿐입니다.
- UptimeBar의 칸 `off`는 그 구간이 수집되지 않았다는 뜻이므로 문구는 같은 상수를 씁니다. 다만 칸의 표기는 텍스트가 아니라 track 색이고 문구는 `title` 속성이라 `.bds-na`를 붙이지 않습니다. 헤더의 가용성 비율만 결측 문구·클래스를 씁니다.
- StatTile의 `deltaLabel` 인라인 style은 결측 표기가 아니라 보조 라벨이었습니다. `.bds-na`로 합치지 않고 `.bds-stat__dl` 클래스로 옮겼습니다.

## 기존 사용처 및 호환성 영향

- NumberStepper onChange는 매 키 입력에서 확정 시점으로 변경됩니다. 실시간 저장/미리보기 소비자는 호출 시점을 확인해야 합니다.
- OTP의 미완성 value/onChange에는 공백이 들어갈 수 있습니다. 부모는 공백을 제거하지 않고 보존해야 합니다. 완성된 onComplete 값은 기존 숫자 문자열과 동일합니다.
- 위 두 입력의 실행 사용처는 이 저장소에서 발견되지 않았으며 제공된 prompt 예시를 확인했습니다. 외부 프로젝트까지 검증했다는 의미는 아닙니다.
- FormModal은 TrainingScreen에서 여러 인스턴스가 사용됩니다. SettingsScreen의 submitLabel=null은 제출 버튼 없음으로 명확히 정의했습니다.
- ModelsScreen/TrainingScreen의 표 행 메뉴는 표 레이아웃을 수정하지 않고 새 top layer를 사용합니다.
- NotificationDrawer의 공개 props는 유지하지만 DOM/CSS 구조는 공통 Drawer로 바뀝니다. 외부 코드가 내부 bds-drawer 레이어 클래스에 의존하면 변경이 필요합니다.
- DataTable에서 `render` 없는 열의 `null`·`undefined`는 지금까지 빈 칸이었고 앞으로 "수집 안 됨"으로 보입니다. 값 대신 빈 칸을 원하던 열은 빈 문자열로 넘겨야 합니다. templates/dashboard의 다섯 표를 확인한 결과 `render` 없는 열(MonitoringScreen 이름, AuthScreen 이메일·마지막 로그인·설명·역할 키)의 값은 모두 채워져 있어 화면상 변화는 없습니다.
- DataTable의 `render`가 돌려준 `null`은 종전대로 빈 칸입니다(SettingsScreen의 폐기된 토큰 행에 작업 버튼이 없는 경우). 결측으로 바꾸지 않았습니다.
- 소비자가 "수집 안 됨" 문구를 값으로 직접 넣던 사용법은 계속 지원합니다. MonitoringScreen·ModelsScreen과 data.card.html이 `fmt.*`나 리터럴로 그렇게 쓰고 있고, 문자열 비교가 core/missing.js 한 곳으로 모였으므로 문구를 바꿔도 조용히 깨지지 않습니다. 다만 권장은 `null`을 넘기고 컴포넌트가 문구를 정하게 하는 쪽입니다.
- 결측 표기 클래스가 `bds-barlist__v--na`·`bds-kv__v--na`·`.bds-table td.na`에서 `bds-na` 하나로 바뀌었습니다. 외부 CSS가 이 이름들에 걸려 있으면 수정이 필요합니다(앞의 둘은 CSS 규칙이 없던 죽은 클래스, 셋째는 `bds-` 네임스페이스 밖 이름이었습니다).
- StatTile의 `value`에 `null`을 넘기면 빈 수치 대신 "수집 안 됨"이 나옵니다. 저장소 안에서 그렇게 쓰는 곳은 없습니다. TrendDelta·Gauge·BarList·KeyValues·Heatmap의 결측 표시 조건은 `NaN`이 추가된 것 말고는 종전과 같습니다.
- ConfirmDialog의 확인 대상은 기존 typeToConfirm 문자열로 식별합니다. 같은 문구를 쓰는 다른 엔티티로 바꿀 때는 진행 중 세션을 먼저 닫아야 합니다.

## 검증과 후속 범위

재현 사례는 tests에 저장했습니다. 데이터/React 상태 검증과 실제 Chromium 브라우저 검증을 분리하며, 테스트 러너는 번들을 먼저 재생성합니다. 컴포넌트별 세부 동작과 공개 타입도 함께 갱신했습니다.

이번 범위는 확정된 12건과 그 공통 원인에 한정합니다. DatePicker의 완전한 방향키 calendar 모델, 다른 비모달 팝업의 공통 레이어 이관, 실제 스크린리더 및 Safari/Firefox 검수는 별도 후속 범위입니다. 전체 컴포넌트 전수 검증이 완료된 것은 아닙니다.
