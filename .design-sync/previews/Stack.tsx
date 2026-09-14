import * as React from "react";
import { Stack, Panel, Button, Inline } from "@dbwk10317/bonggu-design-system";

const Box = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--fill-2)", borderRadius: "var(--r-sm)", padding: "8px 12px" }}>{children}</div>
);

/* gap is a --sp step number; skip raw pixels and density switches come along automatically. */
export const Gaps = () => (
  <Inline gap={5} align="start">
    {[2, 4, 6].map((g) => (
      <Stack key={g} gap={g}>
        <span className="bds-mono">gap {g}</span>
        <Box>첫째</Box><Box>둘째</Box><Box>셋째</Box>
      </Stack>
    ))}
  </Inline>
);

export const Align = () => (
  <Inline gap={5} align="start">
    {(["start", "center", "end", "stretch"] as const).map((a) => (
      <Stack key={a} gap={2} align={a} style={{ width: 130, background: "var(--fill-1)", padding: 8, borderRadius: "var(--r-sm)" }}>
        <span className="bds-mono">{a}</span>
        <Box>짧음</Box><Box>조금 더 긴 항목</Box>
      </Stack>
    ))}
  </Inline>
);

/* Default layout for forms and card bodies; sets vertical rhythm inside a Panel on its own. */
export const InPanel = () => (
  <Panel>
    <Stack gap={4}>
      <b>노드를 격리합니다</b>
      <p>격리하면 이 노드는 트래픽을 받지 않고 상태만 보고합니다.</p>
      <Inline gap={2}><Button variant="secondary">취소</Button><Button variant="danger">격리</Button></Inline>
    </Stack>
  </Panel>
);

export const AsList = () => (
  <Stack as="ul" gap={2} style={{ listStyle: "none", padding: 0, margin: 0 }}>
    <li><Box>edge-seoul-01</Box></li>
    <li><Box>edge-seoul-02</Box></li>
    <li><Box>edge-busan-01</Box></li>
  </Stack>
);
