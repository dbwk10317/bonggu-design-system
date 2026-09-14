import * as React from "react";
import { ToastProvider, useToast, Button, Inline, Stack, Panel, CardHead } from "@dbwk10317/bonggu-design-system";

/* Mount once at the app root; wrapping it per screen stacks toasts in layers. */
function Actions() {
  const { toast } = useToast();
  return (
    <Inline gap={2}>
      <Button variant="secondary" size="sm" onClick={() => toast({ message: "두 장치에 적용했습니다.", tone: "ok" })}>성공</Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ message: "노드 2대는 건너뛰었습니다.", tone: "warn" })}>경고</Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ message: "게이트웨이에 닿지 못했습니다.", tone: "crit", duration: 0 })}>실패(유지)</Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ message: "edge-seoul-03 을 격리했습니다.", tone: "info", action: "되돌리기", onAction: () => toast({ message: "격리를 되돌렸습니다.", tone: "ok" }) })}>되돌리기 붙여서</Button>
    </Inline>
  );
}

export const Basic = () => (
  <ToastProvider>
    <Panel>
      <CardHead title="행동 결과" meta="ToastProvider 안" />
      <Stack gap={3}>
        <p>버튼을 누르면 오른쪽 아래에 토스트가 뜹니다.</p>
        <Actions />
      </Stack>
    </Panel>
  </ToastProvider>
);

/* Beyond max, the oldest disappears first, so toasts don't cover the screen. */
function Burst() {
  const { toast } = useToast();
  return (
    <Button
      variant="primary"
      onClick={() => ["첫째", "둘째", "셋째", "넷째", "다섯째"].forEach((n, i) => setTimeout(() => toast({ message: `${n} 노드에 적용했습니다.`, tone: "ok" }), i * 220))}
    >다섯 개 연속으로 띄우기</Button>
  );
}

export const MaxTwo = () => (
  <ToastProvider max={2}>
    <Panel>
      <CardHead title="max=2" meta="두 개만 남는다" />
      <Burst />
    </Panel>
  </ToastProvider>
);
