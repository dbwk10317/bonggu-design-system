SidebarShell · 대시보드 화면의 바깥 틀. 부모가 100dvh를 준다. 사이드바는 1024 미만에서 드로어.

```jsx
<div style={{height:"100dvh"}}>
<SidebarShell brand={{name:"봉구 대시보드",sub:"ops console"}}
  nav={<><SidebarNavItem icon="pulse" label="모니터링" href="#monitoring" active /><SidebarNavItem icon="shield-check" label="인증" href="#auth" />
    <SidebarNavGroup label="제어" /><SidebarNavItem icon="lightbulb" label="조명" href="#argb" /></>}
  topbar={<><h1>모니터링</h1><StatusPill tone="ok" pulse>모든 서비스 정상</StatusPill><span className="bds-shell__spacer" /><NotificationTrigger unreadCount={2} open={false} onToggle={..} /></>}
  statusbar={<StatusBar live={{label:"실시간"}} items={["연결됨", <>업타임 <span className="bds-mono">12d 04:31</span></>]} right={[<>수집 주기 <span className="bds-mono">1s</span></>, <span className="bds-mono">18:42:07</span>]} />}
  footer={<span className="bds-mono">v0.8.0</span>}>
  <PageStack>…</PageStack>
</SidebarShell></div>
```
- 1024 미만 드로어가 열리면 포커스가 닫기 버튼으로 옮겨지고, 닫히면 햄버거로 돌아간다.
