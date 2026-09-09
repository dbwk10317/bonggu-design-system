(() => {
/* 화면 모듈은 window에 등록된다(x-import 로더는 ESM import를 지원하지 않는다). 렌더 시점에 읽어 로드 순서에 의존하지 않는다. */
const Screen = ({ name, ...p }) => { const C = window[name]; return C ? <C {...p} /> : null; };
const { SidebarShell, SidebarNavItem, SidebarNavGroup, StatusBar, StatusPill, MascotMark, NotificationTrigger, NotificationDrawer, ToastProvider, IconButton, Button, PageStack, PageHeader, Panel, Tabs, Dropzone, Grid, Tag, EmptyState, LogViewer, StatTile, Chart, KeyValues } = window.DS;

const TITLES = { monitoring: "모니터링", auth: "인증", argb: "조명", cooler: "쿨러", models: "모델", training: "학습", settings: "설정" };
const SOURCES = { auth: "ZITADEL", argb: "bonggu-argb", cooler: "cooler-lcd", models: "ai-hub", training: "ai-hub", settings: "ai-hub" };

function CoolerScreen() {
  const [tab, setTab] = React.useState("presets");
  const presets = [["시스템 요약", "CPU·GPU 온도와 사용률, 전력"], ["온도 큰 글자", "CPU 온도 하나만 크게"], ["시계", "시각과 날짜"]];
  return (
    <PageStack aria-label="쿨러 LCD">
      <PageHeader title="쿨러" description="쿨러 LCD에 올릴 프리셋과 사진을 관리합니다. 사진은 업로드 뒤 4:3으로 크롭해 320×240으로 변환됩니다." actions={<><MascotMark face="neutral" animated={false} /><StatusPill tone="ok">LCD 연결됨</StatusPill></>} />
      <Panel padding="sm"><Tabs aria-label="쿨러 콘텐츠" value={tab} onChange={setTab} items={[{ value: "presets", label: "프리셋", count: 3 }, { value: "photos", label: "사진", count: 0 }]} />
        {tab === "presets" ? (
          <Grid min={200}>{presets.map(([n, d], i) => <Panel key={n} padding="sm" selected={i === 0}><div className="kit-lcd" aria-hidden="true"><span>BONGGU</span><b>51°</b><small>CPU 12% · GPU 8%</small></div><div><b className="kit-preset-name">{n}</b><p className="kit-dim">{d}</p></div><div className="kit-actions"><Button size="sm" variant={i === 0 ? "secondary" : "primary"} fit="flex" disabled={i === 0}>{i === 0 ? "적용 중" : "적용"}</Button></div>{i === 0 && <Tag accent className="kit-corner">적용 중</Tag>}</Panel>)}</Grid>
        ) : (
          <><Dropzone accept="image/*" onFiles={() => {}} hint="JPG·PNG · 최대 10 MB · 업로드 뒤 4:3으로 크롭" /><EmptyState plain title="아직 올린 사진이 없습니다" description="사진을 올리면 여기 갤러리에 쌓이고 LCD에 바로 적용할 수 있습니다." /></>
        )}
      </Panel>
    </PageStack>
  );
}

function App() {
  const [view, setView] = React.useState(() => window.location.hash.slice(1) || "monitoring");
  const [alarms, setAlarms] = React.useState(window.KIT.alarms);
  const [notif, setNotif] = React.useState(false);
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains("dark"));
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  React.useEffect(() => { const on = () => setView(window.location.hash.slice(1) || "monitoring"); window.addEventListener("hashchange", on); return () => window.removeEventListener("hashchange", on); }, []);
  React.useEffect(() => { document.documentElement.classList.toggle("dark", dark); document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  const unread = alarms.filter((a) => !a.read).length;
  const clock = now.toLocaleTimeString("ko-KR", { hour12: false });
  const mon = view === "monitoring";
  const nav = (id, icon, label) => <SidebarNavItem key={id} icon={icon} label={label} href={`#${id}`} active={view === id} />;
  const screen = { monitoring: <Screen name="MonitoringScreen" />, auth: <Screen name="AuthScreen" />, argb: <Screen name="ArgbScreen" />, cooler: <CoolerScreen />, training: <Screen name="TrainingScreen" />, models: <Screen name="ModelsScreen" />, settings: <Screen name="SettingsScreen" /> }[view]
    ?? <PageStack><PageHeader title={TITLES[view]} description="이 화면은 UI 키트 범위 밖입니다. 제품 코드의 조립이 기준이 됩니다." /><EmptyState title="시안 없음" description="모델·설정 화면은 ai-hub 운영 UI에서 흡수한 조립을 그대로 따릅니다." /></PageStack>;
  return (
    <ToastProvider>
      <div style={{ height: "100%", minHeight: 600 }}>
        <SidebarShell brand={{ name: "봉구 대시보드", sub: "dashboard.bonggu.me" }}
          nav={<>{nav("monitoring", "pulse", "모니터링")}{nav("auth", "shield-check", "인증")}<SidebarNavGroup label="제어" />{nav("argb", "lightbulb", "조명")}{nav("cooler", "drop", "쿨러")}<SidebarNavGroup label="AI" />{nav("models", "cube", "모델")}{nav("training", "graduation-cap", "학습")}{nav("settings", "gear-six", "설정")}<SidebarNavGroup label="링크" /><SidebarNavItem icon="chart-line-up" label="Grafana" href="https://grafana.bonggu.me" target="_blank" /></>}
          footer={<span className="bds-mono">v0.8.0 · lemonmint</span>}
          topbar={<><h1>{TITLES[view]}</h1><MascotMark face={mon ? "smiling" : "neutral"} size={26} animated={false} /><StatusPill tone={mon ? "warn" : "info"} pulse={mon}>{mon ? "일부 수집 지연" : SOURCES[view]}</StatusPill><span className="bds-shell__spacer" />
            <IconButton icon={dark ? "sun" : "moon"} variant="ghost" aria-label={dark ? "라이트 테마로" : "다크 테마로"} onClick={() => setDark((v) => !v)} />
            <NotificationTrigger unreadCount={unread} open={notif} onToggle={() => setNotif((o) => !o)} /><Button variant="ghost" size="sm" icon="sign-out" className="kit-logout">로그아웃</Button></>}
          statusbar={<StatusBar live={mon ? { label: "실시간" } : undefined} items={mon ? ["bonggu 연결됨", `업타임 ${window.KIT.fmt.up(window.KIT.overview.host.uptime_seconds)}`] : ["API 경유", `${SOURCES[view]} 경유 화면`]} right={mon ? ["수집 주기 1s", clock] : [clock]} />}>
          {screen}
        </SidebarShell>
      </div>
      <NotificationDrawer open={notif} onClose={() => setNotif(false)} items={alarms} onRead={(id) => setAlarms((a) => a.map((x) => (x.id === id ? { ...x, read: true } : x)))} onReadAll={() => setAlarms((a) => a.map((x) => ({ ...x, read: true })))} />
    </ToastProvider>
  );
}
/* DC 템플릿은 <x-import component="DashboardApp" from="./App.jsx">, 정적 HTML은 window.DashboardApp 으로 마운트한다. */
window.DashboardApp = App;
})();
