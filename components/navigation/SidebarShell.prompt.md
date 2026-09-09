SidebarShell — 대시보드 화면의 바깥 틀. 부모가 100dvh를 준다. 사이드바는 1024 미만에서 드로어.

```jsx
<div style={{height:"100dvh"}}>
<SidebarShell brand={{name:"봉구 대시보드",sub:"ops console"}}
  nav={<><SidebarNavItem icon="pulse" label="모니터링" href="#monitoring" active /><SidebarNavItem icon="shield-check" label="인증" href="#auth" />
    <SidebarNavGroup label="제어" /><SidebarNavItem icon="lightbulb" label="조명" href="#argb" /></>}
  topbar={<><h1>모니터링</h1><StatusPill tone="ok" pulse>모든 서비스 정상</StatusPill><span className="bds-shell__spacer" /><NotificationTrigger unreadCount={2} open={false} onToggle={..} /></>}
  statusbar={<StatusBar live={{label:"실시간"}} items={["bonggu 연결됨","업타임 12d 04:31"]} right={["수집 주기 1s","18:42:07"]} />}
  footer={<span className="bds-mono">v0.8.0</span>}>
  <PageStack>…</PageStack>
</SidebarShell></div>
```
