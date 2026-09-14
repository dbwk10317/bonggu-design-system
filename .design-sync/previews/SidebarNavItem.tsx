import * as React from "react";
import { SidebarNavItem, SidebarNavGroup, Badge, Stack } from "@dbwk10317/bonggu-design-system";

/* An item placed in SidebarShell's nav; here it's just mocked up as a 240px rail. */
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

/* Only the current screen is active; the badge signals a count needing attention. */
export const WithBadge = () => (
  <Rail>
    <SidebarNavItem icon="pulse" label="개요" href="#overview" />
    <SidebarNavItem icon="hard-drives" label="노드" href="#nodes" active badge={<Badge count={2} tone="warn" />} />
    <SidebarNavItem icon="bell" label="알림" href="#alarms" badge={<Badge count={12} />} />
  </Rail>
);

/* Split with group labels once there are more than 6 items. */
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

/* Use onClick, not href, for an item that changes state rather than navigating. */
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
