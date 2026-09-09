---
name: bonggu-dashboard-design
description: Use this skill to generate well-branded interfaces and assets for 봉구 대시보드 (Bonggu Dashboard DS, an ops/monitoring dashboard design system), either for production React code or throwaway prototypes/mocks. Contains the 봉구서버 style guide as tokens (light-first, signal blue + 4 status colors, Spoqa Han Sans Neo + JetBrains Mono), the 봉구 mascot, a fit="flex|fixed" sizing contract, a unified Chart component and a dashboard template.
user-invocable: true
---

Read the readme.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Hard rules to carry into any output:
- 한국어 평문, 버튼은 동사, em-dash 금지, 결측은 "수집 안 됨"(mono 아님). 상태는 색+텍스트.
- 시그널(파랑) 하나: 선택·포커스·주 버튼·송신에만. 상태색 4종(원색·tint·ink)은 텍스트와 함께. 차트는 `Chart` 하나(histogram 포함), 밀도 격자는 `Heatmap`(ramp), 진행은 `ProgressBar`/`Stepper`, 시간축은 `Timeline`. 색은 series 8색 + rx/tx/used/reserved/free + ramp.
- 행 액션 3개 이상 → `DropdownMenu`, 목록 옆 상세 → `Drawer`, 복사 전용 값 → `CopyField`, JSON 입력 → `CodeEditor`, 긴 선택 목록 → `Combobox`.
- 컴포넌트에 고정 픽셀을 박지 않는다: `fit="flex"`가 기본, 필요할 때만 `fit="fixed" width height`. 격자는 auto-fit, 열 숨김은 컨테이너 쿼리.
- 라이트 기본, 다크(`:root.dark`)도 항상 확인. 1280 · 834 · 390 세 폭에서 본다. 패널에 그림자 없음, press에 크기 축소 없음.
