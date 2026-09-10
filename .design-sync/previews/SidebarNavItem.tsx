import * as React from "react";
import { SidebarNavItem, SidebarNavGroup, Badge, Stack } from "@dbwk10317/bonggu-design-system";

/* SidebarShell 의 nav 로 넣는 항목이다. 여기서는 240px 레일만 흉내 내 보여준다. */
const Rail = ({ children }: { children: React.ReactNode }) => (
  <nav aria-label="예시" style={{ width: 240, padding: 8, background: "var(--surface-2)", borderRadius: "var(--r-md)" }}>{children}</nav>
);

export const Basic = () => (
  <Rail>
    <SidebarNavItem icon="pulse" label="개요" href="#overview" active />
    <SidebarNavItem icon="hard-drives" label="노드" href="#nodes" />
    <SidebarNavItem icon="devices" label="장치" href="#devices" />
    <SidebarNavItem icon="rocket-launch" label="배포" href="#deploys" />
  </Rail>
);

/* 지금 보고 있는 화면 하나만 active 다. 배지는 손이 가야 하는 수를 알린다. */
export const WithBadge = () => (
  <Rail>
    <SidebarNavItem icon="pulse" label="개요" href="#overview" />
    <SidebarNavItem icon="hard-drives" label="노드" href="#nodes" active badge={<Badge count={2} tone="warn" />} />
    <SidebarNavItem icon="bell" label="알림" href="#alarms" badge={<Badge count={12} />} />
  </Rail>
);

/* 항목이 6개를 넘어가면 그룹 라벨로 나눈다. */
export const Grouped = () => (
  <Rail>
    <SidebarNavItem icon="pulse" label="개요" href="#overview" active />
    <SidebarNavGroup label="운영" />
    <SidebarNavItem icon="devices" label="장치" href="#devices" />
    <SidebarNavItem icon="rocket-launch" label="배포" href="#deploys" />
    <SidebarNavGroup label="계정" />
    <SidebarNavItem icon="users-three" label="접근" href="#access" />
    <SidebarNavItem icon="gear-six" label="설정" href="#settings" />
    <SidebarNavGroup label="링크" />
    <SidebarNavItem icon="chart-line-up" label="Grafana" href="https://grafana.example" target="_blank" />
  </Rail>
);

/* 주소가 아니라 상태를 바꾸는 항목은 onClick 으로 둔다. */
export const OnClick = () => {
  const [view, setView] = React.useState("overview");
  return (
    <Stack gap={3}>
      <Rail>
        {[["overview", "개요", "pulse"], ["nodes", "노드", "hard-drives"]].map(([id, label, icon]) => (
          <SidebarNavItem key={id} icon={icon} label={label} active={view === id} onClick={() => setView(id)} />
        ))}
      </Rail>
      <span className="bds-mono">view: {view}</span>
    </Stack>
  );
};
