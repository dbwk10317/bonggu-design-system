(() => {
/* 화면 모듈은 window에 등록된다(x-import 로더는 ESM import를 지원하지 않는다). 렌더 시점에 읽어 로드 순서에 의존하지 않는다. */
const Screen = ({ name, ...p }) => { const C = window[name]; return C ? <C {...p} /> : null; };
const { SidebarShell, SidebarNavItem, SidebarNavGroup, StatusBar, StatusPill, MascotMark, NotificationTrigger, NotificationDrawer, ToastProvider, IconButton, Button, Badge, Tooltip, Kbd, CommandPalette, PageStack, PageHeader, EmptyState } = window.DS;

const TITLES = { overview: "개요", nodes: "노드", devices: "장치", deploys: "배포", access: "접근", settings: "설정", status: "상태 페이지" };
const SOURCES = { nodes: "edge-gateway", devices: "device-api", deploys: "artifact-cdn", access: "config-api", settings: "config-api" };
const SCREEN = { overview: "OverviewScreen", nodes: "NodesScreen", devices: "DevicesScreen", deploys: "DeploysScreen", access: "AccessScreen", settings: "SettingsScreen", status: "StatusScreen" };
const go = (id) => { window.location.hash = "#" + id; };
const EMBEDDED = (() => { try { return window.self !== window.top; } catch { return true; } })();

function App() {
  const [view, setView] = React.useState(() => window.location.hash.slice(1) || "overview");
  const [alarms, setAlarms] = React.useState(window.KIT.alarms);
  const [notif, setNotif] = React.useState(false);
  const [palette, setPalette] = React.useState(false);
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains("dark"));
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  React.useEffect(() => { const on = () => setView(window.location.hash.slice(1) || "overview"); window.addEventListener("hashchange", on); return () => window.removeEventListener("hashchange", on); }, []);
  React.useEffect(() => { document.documentElement.classList.toggle("dark", dark); document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  React.useEffect(() => {
    const on = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((o) => !o); } };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, []);

  const unread = alarms.filter((a) => !a.read).length;
  const clock = now.toLocaleTimeString("ko-KR", { hour12: false });
  const live = view === "overview" || view === "nodes";
  const screen = SCREEN[view]
    ? <Screen name={SCREEN[view]} />
    : <PageStack><PageHeader title="없는 화면" description="주소의 해시가 이 콘솔이 아는 화면과 맞지 않습니다." /><EmptyState face="curious" title="화면을 찾지 못했습니다" description="왼쪽 메뉴에서 화면을 고르거나 명령 팔레트를 엽니다." actions={<Button onClick={() => go("overview")}>개요로</Button>} /></PageStack>;

  const commands = [
    ...Object.entries(TITLES).map(([id, label]) => ({ id, label, group: "이동", icon: id === "status" ? "broadcast" : "arrow-right", hint: <span className="bds-mono">#{id}</span>, onSelect: () => { go(id); setPalette(false); } })),
    ...(!EMBEDDED ? [{ id: "theme", label: dark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기", group: "표시", icon: dark ? "sun" : "moon", onSelect: () => { setDark((v) => !v); setPalette(false); } }] : []),
    { id: "readall", label: "알림 모두 읽음으로", group: "표시", icon: "bell", onSelect: () => { setAlarms((a) => a.map((x) => ({ ...x, read: true }))); setPalette(false); } },
  ];

  const nav = (id, icon, badge) => <SidebarNavItem key={id} icon={icon} label={TITLES[id]} href={`#${id}`} active={view === id} badge={badge} />;
  const shell = (
    <SidebarShell brand={{ name: "봉구 엣지 콘솔", sub: "edge.bonggu.me" }}
      nav={<>{nav("overview", "pulse")}{nav("nodes", "hard-drives", <Badge count={2} tone="warn" />)}<SidebarNavGroup label="운영" />{nav("devices", "devices")}{nav("deploys", "rocket-launch")}<SidebarNavGroup label="계정" />{nav("access", "users-three")}{nav("settings", "gear-six")}<SidebarNavGroup label="링크" />{nav("status", "broadcast")}<SidebarNavItem icon="chart-line-up" label="Grafana" href="https://grafana.example" target="_blank" /></>}
      footer={<><span className="bds-mono">agent 2.14.0</span> · 봉구 인프라팀</>}
      topbar={<><h1>{TITLES[view] ?? "없는 화면"}</h1><MascotMark face={live ? "worried" : "neutral"} size={26} animated={false} /><StatusPill tone={live ? "warn" : "info"} pulse={live}>{live ? "노드 2대 수집 지연" : SOURCES[view] ?? "알 수 없는 화면"}</StatusPill><span className="bds-shell__spacer" />
        <Tooltip content={<>명령 팔레트 <Kbd>Ctrl</Kbd> <Kbd>K</Kbd></>}><IconButton icon="magnifying-glass" variant="ghost" aria-label="명령 팔레트 열기" className="kit-mobile-hide" onClick={() => setPalette(true)} /></Tooltip>
        {!EMBEDDED && <Tooltip content={dark ? "라이트 테마로" : "다크 테마로"}><IconButton icon={dark ? "sun" : "moon"} variant="ghost" aria-label={dark ? "라이트 테마로" : "다크 테마로"} onClick={() => setDark((v) => !v)} /></Tooltip>}
        <NotificationTrigger unreadCount={unread} open={notif} onToggle={() => setNotif((o) => !o)} /><Button variant="ghost" size="sm" icon="sign-out" className="kit-mobile-hide">로그아웃</Button></>}
      statusbar={<StatusBar live={live ? { label: "실시간" } : undefined}
        items={live
          ? ["게이트웨이 연결됨", <>노드 <span className="bds-mono">35 / 38</span> 온라인</>]
          : ["API 경유", <><span className="bds-mono">{SOURCES[view] ?? "gateway"}</span> 경유 화면</>]}
        right={live
          ? [<>수집 주기 <span className="bds-mono">5s</span></>, <span className="bds-mono">{clock}</span>]
          : [<span className="bds-mono">{clock}</span>]} />}>
      {screen}
    </SidebarShell>
  );

  return (
    <ToastProvider>
      {/* 상태 페이지는 고객이 보는 공개 화면이라 콘솔 셸을 두르지 않는다. 같은 토큰·컴포넌트로 그린다. */}
      <div className="kit-app" data-screen={view}>{view === "status" ? <Screen name="StatusScreen" onBack={() => go("overview")} /> : shell}</div>
      <NotificationDrawer open={notif} onClose={() => setNotif(false)} items={alarms} onRead={(id) => setAlarms((a) => a.map((x) => (x.id === id ? { ...x, read: true } : x)))} onReadAll={() => setAlarms((a) => a.map((x) => ({ ...x, read: true })))} />
      <CommandPalette open={palette} onClose={() => setPalette(false)} items={commands} placeholder="화면 이동, 표시 바꾸기" />
    </ToastProvider>
  );
}
/* DC 템플릿은 <x-import component="DashboardApp" from="./App.jsx">, 정적 HTML은 window.DashboardApp 으로 마운트한다. */
window.DashboardApp = App;
})();
