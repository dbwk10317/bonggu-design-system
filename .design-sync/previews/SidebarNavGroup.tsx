import * as React from "react";
import { SidebarNavGroup, SidebarNavItem, Stack } from "@dbwk10317/bonggu-design-system";

const Rail = ({ children }: { children: React.ReactNode }) => (
  <nav aria-label="예시" style={{ width: 240, padding: 8, background: "var(--surface-2)", borderRadius: "var(--r-md)" }}>{children}</nav>
);

/* A label-only separator: not clickable, doesn't collapse. Use Accordion if it needs to collapse. */
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

/* Leave items before the first group unlabeled; don't invent an empty name like "일반". */
export const NoLeadingLabel = () => (
  <Stack gap={4}>
    <Rail>
      <SidebarNavItem icon="pulse" label="개요" href="#overview" active />
      <SidebarNavGroup label="운영" />
      <SidebarNavItem icon="rocket-launch" label="배포" href="#deploys" />
    </Rail>
  </Stack>
);
