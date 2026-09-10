# 봉구 엣지 콘솔 (템플릿)

가상 제품 하나를 이 디자인 시스템의 컴포넌트만으로 조립한, 클릭 가능한 대시보드 예시입니다. 전국 매장에 설치한 엣지 노드(소형 서버 + 안내 단말 + 결제 리더기)를 원격으로 운영하는 콘솔을 가정했습니다. 실제 서비스가 아니고 데이터는 전부 `data.js`의 고정 시드 목업입니다.

컴포넌트 96개를 한 번 이상 씁니다. 규칙은 `readme.md`에 있고 이 문서는 파일이 어떤 화면인지만 적습니다.

## 파일

- `Dashboard.dc.html` · 템플릿 진입. `data.js`(목 데이터)와 화면 파일은 `<x-import from>`으로 로드되고 각 화면은 `window.<Name>`에 등록됩니다(로더가 ESM import를 지원하지 않아 IIFE + 전역 등록 방식). 정적 HTML에서는 `window.DashboardApp`을 직접 마운트합니다.
- `ds-base.js` · 디자인 시스템 로드. 소비 프로젝트는 `base` 한 줄만 고쳐 씁니다.
- `data.js` · 목 데이터, 포맷 함수, 번들을 지연 참조하는 `window.DS` 프록시.
- `kit.css` · 화면 배치용 CSS만. 색·간격·글자 크기는 토큰을 참조합니다.
- `support.js` · dc 런타임 생성물. 손으로 고치지 않습니다.

## 여는 법

`x-import`가 `fetch`로 화면 파일을 읽으므로 `file://`로는 열리지 않습니다. 저장소 루트에서 정적 서버를 띄우고 `http://localhost:8080/templates/dashboard/Dashboard.dc.html`을 엽니다.

```bash
python -m http.server 8080
```

## 화면

해시로 전환합니다(`#overview #nodes #devices #deploys #access #settings #status`). 독립 실행에서는 상단바에서 다크·라이트를 바꾸고, 가이드 안에서는 가이드 상단 토글을 따릅니다. `Ctrl`+`K`로 명령 팔레트를 엽니다.

- `App.jsx` · 셸(SidebarShell) + 라우팅 + 명령 팔레트 + 알림 드로어 + 테마 전환
- `OverviewScreen.jsx` · 함대 요약. StatTile, 12열 격자, Chart 7종 중 6종, Heatmap, UptimeBar, Timeline, 로딩·오류·빈 상태 카드
- `NodesScreen.jsx` · 노드 목록. 검색·필터 툴바, 선택 가능한 표와 행 펼침·행 메뉴, 페이지 나눔, 상세 Drawer(탭·로그·복사 필드), 격리 확인
- `DevicesScreen.jsx` · 장치 제어. 장치 카드 선택, 운영 모드·색·밝기·일정 입력, 설치 사진 업로드, 실패 모달
- `DeploysScreen.jsx` · 롤아웃. 단계 표시와 진행 바, 로그, 릴리스 선택과 설정 diff, JSON 편집기, 청크 업로드, 배포 예약과 되돌리기
- `AccessScreen.jsx` · 운영자와 권한. 탭, 계정 표, 초대 폼 모달, 2단계 인증 코드 입력, 감사 로그
- `SettingsScreen.jsx` · 콘솔 설정. 좁은 폼 폭, 밀도 전환, 수집 값, 자동화 토큰 발급과 폐기, 고급 아코디언, 위험 구역
- `StatusScreen.jsx` · 고객이 보는 공개 상태 페이지. 셸 대신 TopNav를 쓰는 유일한 화면

검수 폭과 테마 조건은 `readme.md`의 규칙을 따릅니다.
