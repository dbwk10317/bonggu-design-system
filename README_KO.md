# 봉구 대시보드 디자인 시스템

[English README](README.md)

[![npm](https://img.shields.io/npm/v/@dbwk10317/bonggu-design-system)](https://www.npmjs.com/package/@dbwk10317/bonggu-design-system)
[![CI](https://github.com/dbwk10317/bonggu-design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/dbwk10317/bonggu-design-system/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@dbwk10317/bonggu-design-system)](LICENSE)

운영·모니터링 대시보드를 위한 React 디자인 시스템입니다. 실시간 수치, 장치 제어, 몇 초마다 바뀌는 상태처럼 숫자가 많고 자주 변하는 화면을 위해 만들었습니다. 같은 token과 component로 light와 dark, PC·태블릿·모바일에서 같은 모습으로 그립니다.

- component 103개(9개 그룹), chart 7종을 그리는 `Chart` component 하나
- 같은 token 이름으로 light·dark 테마를 제공하고, compact 밀도도 있습니다
- 수집되지 않은 값은 0으로 그리지 않고 "수집 안 됨"으로 표시합니다
- overlay는 native `<dialog>`와 Popover API를 쓰고, 키보드 이동과 live region이 기본으로 들어 있습니다
- container query 기반 반응형과 `fit` 크기 규칙 하나
- 한국어 문구와 타이포그래피 기준(Spoqa Han Sans Neo + JetBrains Mono, self-hosted)
- React 18.2~19, ESM, TypeScript 선언 파일, MIT

## 화면 예시

아래 화면은 [`templates/dashboard`](templates/dashboard)의 샘플 앱입니다. 이 시스템의 component만으로 만들었습니다.

| 개요 · light | 개요 · dark |
|---|---|
| ![개요 화면 light](docs/screenshots/overview-light.png) | ![개요 화면 dark](docs/screenshots/overview-dark.png) |

| 필터와 data table이 있는 노드 목록 | 모바일에서 본 장치 제어 |
|---|---|
| ![노드 목록](docs/screenshots/nodes-light.png) | ![390px 폭의 장치 제어 화면](docs/screenshots/devices-mobile.png) |

## 설치

```bash
npm install @dbwk10317/bonggu-design-system
```

`react`는 peer dependency입니다(`>=18.2.0 <20`). 검증은 React 18.3.1과 19.3.0에서 합니다.

## 빠른 시작

```tsx
import { ToastProvider, Panel, StatTile, Button, useToast } from "@dbwk10317/bonggu-design-system";
import "@dbwk10317/bonggu-design-system/styles.css";

function SaveButton() {
  const { toast } = useToast();
  return <Button variant="primary" onClick={() => toast({ message: "저장 완료", tone: "ok" })}>저장</Button>;
}

export function App() {
  return (
    <ToastProvider>
      <Panel caption="온라인 노드">
        <StatTile label="온라인" value={35} unit="대" detail="전체 38대 · 지점 14곳" />
        <SaveButton />
      </Panel>
    </ToastProvider>
  );
}
```

- **테마**: 기본은 light입니다. `<html>`에 `dark` class를 붙이거나 `data-theme="dark"`를 주면 dark가 됩니다.
- **밀도**: 표나 운영 콘솔처럼 조밀한 화면은 `<html data-density="compact">`를 씁니다. 글자 크기는 그대로 두고 간격과 control 높이만 줄입니다. 터치 기기에서는 어느 밀도든 44px control을 유지합니다.
- **스타일**: `styles.css` 하나가 token, 폰트, 아이콘, component 스타일을 모두 불러옵니다. 요소 reset은 `@layer bds-reset` 안에 있어서, 앱에서 `body`·`a`·`ul` 같은 요소에 직접 쓴 규칙이 항상 우선합니다.
- **asset**: `@dbwk10317/bonggu-design-system/assets/mascot-neutral.svg`와 `assets/favicon.svg`를 export합니다. 폰트와 아이콘은 CSS 기준 상대 경로라 CDN이 필요 없습니다.

## 구성

| 그룹 | component |
|---|---|
| action | Button, IconButton, Icon |
| brand | MascotMark |
| layout | PageStack, PageHeader, Panel, CardHead, Toolbar, Grid, StatusBar, Container, Stack, Inline, Spacer, Divider, AspectRatio, JustifiedGallery, Visible, SplitPane |
| navigation | SidebarShell, TopNav, Tabs, Breadcrumb, Pagination, Link, CommandPalette, SavedViews, TreeView |
| input | Field, TextField, TextArea, Select, Checkbox, RadioGroup, Switch, SearchField, SegmentedControl, Slider, NumberStepper, ColorInput, Combobox, MultiSelect, DatePicker, DateRangePicker, TimePicker, PasswordField, OTPInput, CodeEditor, Dropzone, FileUpload, FilterBar |
| data | Chart(line, area, bar, pie, radial, radar, histogram), Sparkline, Gauge, Heatmap, StatTile, TrendDelta, BarList, KeyValues, DescriptionList, DataTable, LogViewer, Timeline, DiffView, Legend, UptimeBar, StateTimeline |
| display | StatusPill, Tag, Badge, Avatar, Accordion, Code, CodeBlock, Kbd, CopyField |
| overlay | Modal, FormModal, Drawer, Popover, Tooltip, DropdownMenu, ImageViewer |
| feedback | AlertBanner, Toast, NotificationDrawer, InlineMessage, ProgressBar, Stepper, Skeleton, Spinner, LoadingOverlay, EmptyState, ErrorState, ConfirmDialog |

입력 component는 모두 `ref`를 실제 control 요소로 넘깁니다. form 라이브러리의 `register`나 코드에서 focus를 옮기는 일이 그대로 됩니다. component마다 `.d.ts`와 짧은 사용법(`components/<group>/<Name>.prompt.md`)이 같이 있습니다.

## 정적 HTML과 프로토타입

같은 소스로 브라우저용 bundle(`_ds_bundle.js`, `window.Ds_d3ea90`)도 만듭니다. 빠르게 시안을 만들거나 가이드 페이지를 그릴 때 씁니다. React UMD, bundle, `styles.css` 세 개를 불러오면 되고, `components/*/*.card.html`이 그대로 예시입니다.

## 문서

- [RULE.md](RULE.md): 디자인 규칙 전체. token, 문구, 접근성과 동작 규칙, 공개 API와 버전 규칙, 릴리스 절차가 있습니다. 규칙은 이 문서 한 곳에만 두고, 기계로 확인할 수 있는 항목은 `tests/rule-regressions.cjs`가 검사합니다.
- [가이드](guidelines/index.html): 모든 component와 token 카드를 검수 폭 세 가지로 볼 수 있습니다. 저장소 루트에서 아무 정적 서버나 띄우고(예: `python3 -m http.server 8080`) `http://localhost:8080/guidelines/index.html`을 엽니다.
- [샘플 앱](templates/dashboard/README.md): 화면 6개와 공개 상태 페이지가 있는 엣지 노드 운영 콘솔입니다. 클릭해서 둘러볼 수 있습니다.
- [AGENTS.md](AGENTS.md): 이 저장소에서 코드를 고치는 원칙. [tests/README.md](tests/README.md): 검증이 무엇을 확인하는지.
- [CHANGELOG.md](CHANGELOG.md)

## 지원 브라우저

Chromium에서 검증했습니다. Popover API, native `<dialog>`, container query, `oklch()`, `:has()`를 쓰므로 Chrome/Edge 114 이상, Safari 17 이상, Firefox 125 이상이 필요합니다. Safari와 Firefox는 아직 자동 검증에 들어 있지 않습니다.

## 버전과 릴리스

SemVer를 따릅니다. 변경 내용은 Changesets로 기록하고, `v*` 태그를 push하면 GitHub Actions가 Trusted Publishing으로 npm에 올립니다. 이때 provenance 서명이 함께 붙습니다. patch는 공개 API를 유지하는 수정, minor는 추가, major는 이름 변경이나 삭제입니다. 이름을 바꿀 때는 alias를 만들지 않고 이관표를 제공합니다.

## 라이선스

MIT입니다. Spoqa Han Sans Neo, JetBrains Mono, Phosphor Icons는 각자의 라이선스로 포함됩니다. [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)를 보세요.
