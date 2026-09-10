import * as React from "react";
import { SidebarNavGroup, SidebarNavItem, Stack } from "@dbwk10317/bonggu-design-system";

const Rail = ({ children }: { children: React.ReactNode }) => (
  <nav aria-label="예시" style={{ width: 240, padding: 8, background: "var(--surface-2)", borderRadius: "var(--r-md)" }}>{children}</nav>
);

/* 라벨만 있는 구분자다. 클릭할 수 없고 접히지도 않는다. 접어야 하면 Accordion 을 쓴다. */
export const Basic = () => (
  <Rail>
    <SidebarNavItem icon="pulse" label="개요" href="#overview" active />
    <SidebarNavGroup label="운영" />
    <SidebarNavItem icon="hard-drives" label="노드" href="#nodes" />
    <SidebarNavItem icon="devices" label="장치" href="#devices" />
    <SidebarNavGroup label="계정" />
    <SidebarNavItem icon="users-three" label="접근" href="#access" />
    <SidebarNavItem icon="gear-six" label="설정" href="#settings" />
  </Rail>
);

/* 첫 그룹 앞의 항목은 라벨 없이 둔다. "일반" 같은 빈 이름을 만들지 않는다. */
export const NoLeadingLabel = () => (
  <Stack gap={4}>
    <Rail>
      <SidebarNavItem icon="pulse" label="개요" href="#overview" active />
      <SidebarNavGroup label="운영" />
      <SidebarNavItem icon="rocket-launch" label="배포" href="#deploys" />
    </Rail>
  </Stack>
);
