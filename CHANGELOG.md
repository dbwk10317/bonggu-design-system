# @dbwk10317/bonggu-design-system

## 1.0.0-beta.0

### Major Changes

- 084cfab: 기본 밀도를 한 단계 여유롭게 조정합니다. 패널·격자·페이지·인라인·key-value 간격이 커지고 `Stack`의 기본 gap이 12px에서 16px로 바뀝니다. 조밀한 화면은 `data-density="compact"`를 명시해 기존 compact 밀도를 사용합니다.
  
  가이드 카드의 React 마운트 루트에도 동일한 세로 섹션 간격을 적용합니다. StatusBar는 한글 라벨에 UI 서체를 사용하고, Select 선택값은 기본·compact·터치 높이에서 세로 중앙에 맞춥니다.
