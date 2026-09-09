# 봉구 대시보드 UI 키트

`dashboard.bonggu.me`의 화면을 새 디자인 시스템 컴포넌트만으로 재조립한 클릭 가능한 목업.

- `Dashboard.dc.html` · 템플릿 진입(디자인 컴포넌트). `data.js`(목 데이터)와 화면 파일은 `<x-import from>`로 로드되고 각 화면은 `window.<Name>`에 등록된다(로더가 ESM import를 지원하지 않아 IIFE + 전역 등록 방식). 정적 HTML에서는 `window.DashboardApp`을 직접 마운트한다. 해시(`#monitoring #auth #argb #cooler #models #training #settings`)로 화면 전환, 상단바에서 다크/라이트 토글·알림 드로어.
- `App.jsx` · 셸(SidebarShell) + 쿨러·학습 화면 + 라우팅
- `MonitoringScreen.jsx` · 6개 메트릭 카드(방사 게이지·면적 차트·막대 목록) + 서비스 표 + AI 허브 섹션
- `ArgbScreen.jsx` · 조명 제어(미리보기 카드 선택, 같이 설정, 색 칩·프리셋, 적용 → 토스트/오류 모달)
- `AuthScreen.jsx` · 인증 콘솔(탭, 검색 툴바, 선택 가능한 표, 폼 모달, 삭제 확인)
- `data.js` · 목 데이터(제품 `types.ts` Overview 모양)

원본 조립: dashboard 저장소 `frontend/src/components/{Dashboard,HubStatus,Argb,AuthConsole,Cooler,Training}.tsx`. 모델·설정 화면은 범위 밖(빈 상태로 표시).
1280 · 834 · 390 폭과 다크·라이트에서 확인한다.

- `ModelsScreen.jsx` · 모델 관리(제품 Models.tsx: StatTile 4 · 등록 작업 · 모델별 VRAM pie · GPU 게이지 · 요청/오류 area · 통합 모델 목록 + 등록/관리 모달, 비활성화 확인)
- `SettingsScreen.jsx` · 허브 설정(제품 Settings.tsx 패널 순서 그대로: 화면 갱신 · Lease 기본값 · 개인 화면 설정 · 시스템 정보 · 운영 한도 · 학습 정책 · 자동화 토큰 + 발급/폐기 모달)
- `TrainingScreen.jsx` · 학습 프로젝트(제품 Training.tsx: 계약 안내 배너 · 등록 작업 · StatTile 5 · 등록된 프로젝트 · 품질 추세 | Revision diff · 학습 실행 + 실행 생성/Dataset 등록/프로젝트 등록/실행 상세/확인 모달)

확장 컴포넌트 적용 위치: 모델 표 행 액션 `DropdownMenu`, 그래프 모델 `Combobox`, 등록 작업 `Stepper`, 행 펼침 `CopyField`(식별자·curl) · 설정 토큰 발급 `CopyField secret` · 학습 실행 상세 `Drawer`(Stage `Stepper`), config `CodeEditor`, 프로젝트 등록 `FileUpload`, Revision diff `DiffView` · 모니터링 최근 운영 변화 `Timeline`.
