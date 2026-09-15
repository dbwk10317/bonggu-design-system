# @dbwk10317/bonggu-design-system

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
