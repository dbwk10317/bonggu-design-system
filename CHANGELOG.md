# @dbwk10317/bonggu-design-system

## 2.0.4

### Patch Changes

- Timeline 연결선을 사건 표시와 같은 그리드 셀에서 정렬해 브라우저별 절대 위치 계산 차이를 제거합니다. 사건 사이 간격은 밀도별 간격 토큰을 사용합니다.

## 2.0.3

### Patch Changes

- 확대된 차트의 마우스·터치 위치와 드래그 구간을 SVG 데이터 좌표로 환산합니다. 공통 도형 측정의 CSS 좌표계와 포인터 좌표계를 일치시켜 확대 배율에 따라 다른 지점이 선택되는 문제를 수정합니다.

  Timeline 연결선을 사건 표시 열에 정렬합니다.

## 2.0.2

### Patch Changes

- 자연 높이 Gauge가 불필요한 스크롤 컨테이너를 만들지 않도록 수정합니다. 명시적 높이를 지정한 기존 사용처의 높이·스크롤 계약은 유지합니다. 공통 도형 측정은 확대·변환된 화면 좌표 대신 CSS 배치 좌표를 사용해 확대 시 중앙값이 경계를 벗어나는 문제를 해결합니다.

  Timeline은 날짜를 포함한 시간과 긴 식별자를 내용에 맞는 열 안에서 줄바꿈하며, 사건 표시와 본문이 겹치지 않도록 열을 공유합니다. 짧은 시각만 보여주는 사용처도 같은 배치를 사용합니다.

## 2.0.1

### Patch Changes

- FilterBar가 외부에서 복원한 조건의 식별자를 피해서 새 조건을 생성합니다. 저장된 보기를 다시 불러온 뒤 조건을 추가해도 항목 식별자가 겹치거나 개별 해제 시 다른 조건이 함께 사라지지 않습니다.

## 2.0.0

### Major Changes

- 시각화의 글자와 배치를 실제 폰트·토큰·컨테이너 크기로 계산합니다. 파이·라디얼·Gauge 대표값은 역할별 글자 크기 범위를 지키며, 내부에 들어가지 않는 값과 설명은 도형 아래로 이동합니다. 축·레이더·히스토그램 라벨 충돌과 툴팁 넘침을 방지하고, Heatmap은 셀 크기를 유지하는 내부 스크롤을 제공합니다. Heatmap의 투명했던 색상 범례도 셀과 같은 색 단계로 표시합니다. UptimeBar 간격과 범례·BarList의 긴 값도 좁은 폭에 대응합니다.

  이관: Chart의 `height`는 그래픽 탐색 영역 높이입니다. 전체 높이를 고정하거나 자르는 부모는 도형 아래의 값·주석·범례를 위한 세로 공간을 허용해야 합니다. Gauge의 `height`는 값·설명·눈금을 포함한 전체 높이이며, 공간이 부족하면 내부 스크롤을 제공합니다. 기본 대표값 타이포와 배치가 바뀌므로 고정 높이에 의존한 화면을 재검수해야 합니다. 이 레이아웃 영향 때문에 major 변경으로 분류합니다.

  공개 fit 타입을 기존 런타임의 `auto | flex | fixed` 동작과 일치시키고, `ChartSegment.value`에 결측값 `null`을 허용합니다. Chart 접근성 설명과 차트 팔레트 가이드를 실제 구현에 맞춥니다. 새 시각화는 등록과 크기·텍스트 경계 검증을 함께 추가하도록 규칙화합니다.

### Minor Changes

- 필터 조건 편집(FilterBar), 저장된 보기(SavedViews), 계층 탐색(TreeView), 크기 조절 분할 영역(SplitPane), 상태 지속 시간 시각화(StateTimeline), 이미지 확대 뷰어(ImageViewer)를 추가합니다.

  DataTable은 선택적으로 열 표시·순서·폭·고정을 편집하고 외부 상태로 저장할 수 있습니다. Chart는 데이터 좌표를 공유하는 커서·구간 확대와 이벤트 표시를 지원합니다. LogViewer는 선택적인 검색·레벨 필터·결과 이동과 읽던 위치를 보존하는 따라가기 조작을 제공합니다. 데이터 조회와 영구 저장은 소비 앱이 맡습니다.

  좁은 컨테이너에서 도구 줄바꿈, 분할 영역의 세로 전환, 내부 스크롤과 키보드 경로를 제공합니다. 상태 타임라인은 겹치는 구간을 별도 행으로 분리하고, 이미지 뷰어는 기존 모달의 포커스·닫힘 세션을 공유합니다. 대시보드 탐색 화면과 컴포넌트 카드, 공개 타입, 반응형·상호작용 회귀 검증을 함께 추가합니다.

## 1.2.0

### Minor Changes

- 8e4491f: `TopNav`에 `skipTo` prop을 추가합니다. 본문 요소의 id를 넘기면 본문으로 건너뛰는 링크를 첫 탭 스톱으로 냅니다. 평소에는 보이지 않고 초점을 받으면 나타납니다. `TopNav`를 쓰는 화면은 본문에 `id`와 `tabIndex={-1}`을 주고 그 id를 넘깁니다.

## 1.1.0

### Minor Changes

- f889bdd: 사진 목록 컴포넌트 `JustifiedGallery`를 추가합니다. 사진마다 원본 비율을 지키면서 마지막 행을 뺀 모든 행을 컨테이너 폭에 맞춰 채웁니다. `onOpen`을 주면 타일이 사진을 여는 버튼이 되고, `footer` 슬롯에 더 불러오기 같은 동작을 둡니다. 원본 크기가 없는 사진은 1:1로 배치합니다. 한 장을 대표로 보이는 자리는 계속 `AspectRatio`(4:3)를 씁니다.

## 1.0.1

### Patch Changes

- 발행 인증을 Trusted Publishing(GitHub Actions OIDC)으로 옮깁니다. 이 버전부터 npmjs 패키지 페이지에 provenance 증명(어느 저장소·워크플로·커밋에서 빌드됐는지)이 붙습니다. 패키지 내용은 1.0.0과 같습니다.

## 1.0.0

### Major Changes

- 1a5e3b7: `tokens/base.css`의 요소 리셋이 `@layer bds-reset` 안으로 들어갑니다. 소비 앱이 `body`·`ul`·`a` 같은 요소를 직접 스타일하면 이제 앱의 규칙이 리셋보다 우선합니다. 리셋이 앱 규칙을 덮어쓰던 동작에 기대고 있었다면 그 규칙을 앱에서 지우거나 `@layer bds-reset` 뒤에 오는 자기 레이어로 옮깁니다.

  `DataTable` 열의 `hideOnMobile`을 삭제합니다. `hideBelow: "tablet"`으로 바꿉니다.

  배포 레지스트리가 GitHub Packages에서 npmjs 공개 패키지로 바뀝니다. `.npmrc`의 `@dbwk10317:registry=https://npm.pkg.github.com` 줄과 `read:packages` 토큰을 지우고 `npm install @dbwk10317/bonggu-design-system`으로 설치합니다.
- 084cfab: 기본 밀도를 한 단계 여유롭게 조정합니다. 패널·격자·페이지·인라인·key-value 간격이 커지고 `Stack`의 기본 gap이 12px에서 16px로 바뀝니다. 조밀한 화면은 `data-density="compact"`를 명시해 기존 compact 밀도를 사용합니다.

  가이드 카드의 React 마운트 루트에도 동일한 세로 섹션 간격을 적용합니다. StatusBar는 한글 라벨에 UI 서체를 사용하고, Select 선택값은 기본·compact·터치 높이에서 세로 중앙에 맞춥니다.

### Minor Changes

- 1a5e3b7: 입력 컴포넌트 21개(`Field`·`TextField`·`TextArea`·`Select`·`Switch`·`SearchField`·`PasswordField`·`NumberStepper`·`Slider`·`ColorInput`·`SegmentedControl`·`RadioGroup`·`Combobox`·`MultiSelect`·`DatePicker`·`DateRangePicker`·`TimePicker`·`OTPInput`·`CodeEditor`·`Dropzone`·`FileUpload`)가 `ref`를 조작 요소로 넘깁니다. 폼 라이브러리의 `register`와 프로그램 포커스에 그대로 쓸 수 있습니다. 공개 타입은 `ForwardRefExoticComponent<Props & RefAttributes<요소>>`입니다.
- 1a5e3b7: React peer 범위를 `18.3.1` 고정에서 `>=18.2.0 <20`으로 넓힙니다. 회귀 게이트가 18.3.1과 19.3.0 두 조합을 검증합니다. React 19에서 `Legend`의 `onToggle` prop 타입이 새 DOM 이벤트 타입과 충돌하던 것을 고쳤습니다.

## 1.0.0-beta.0

### Major Changes

- 084cfab: 기본 밀도를 한 단계 여유롭게 조정합니다. 패널·격자·페이지·인라인·key-value 간격이 커지고 `Stack`의 기본 gap이 12px에서 16px로 바뀝니다. 조밀한 화면은 `data-density="compact"`를 명시해 기존 compact 밀도를 사용합니다.

  가이드 카드의 React 마운트 루트에도 동일한 세로 섹션 간격을 적용합니다. StatusBar는 한글 라벨에 UI 서체를 사용하고, Select 선택값은 기본·compact·터치 높이에서 세로 중앙에 맞춥니다.
