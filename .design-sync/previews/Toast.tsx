import * as React from "react";
import { Toast, ToastProvider, useToast, Button, Stack, Inline } from "@dbwk10317/bonggu-design-system";

/* 보통은 직접 그리지 않는다. 앱 루트의 ToastProvider 가 그리고, 화면에서는 useToast().toast() 를 부른다.
   여기서는 모양을 보기 위해 각 톤을 그대로 세워 둔다. */
export const Tones = () => (
  <Stack gap={3}>
    <Toast tone="ok" message="두 장치에 적용했습니다." />
    <Toast tone="info" message="edge-seoul-03 을 격리했습니다." action="되돌리기" />
    <Toast tone="warn" message="노드 2대는 에이전트가 낮아 건너뛰었습니다." />
    <Toast tone="crit" message="게이트웨이에 닿지 못했습니다." action="다시 시도" />
  </Stack>
);

/* 되돌릴 수 있는 일은 확인 창 대신 토스트에 되돌리기를 붙인다. */
export const WithAction = () => (
  <Toast tone="info" message="노드 3대를 격리했습니다." action="되돌리기" onAction={() => {}} onDismiss={() => {}} />
);

/* 실제 사용법. duration 0 은 사람이 닫을 때까지 남는다 — 실패에만 쓴다. */
function Trigger() {
  const { toast } = useToast();
  return (
    <Inline gap={2}>
      <Button variant="secondary" size="sm" onClick={() => toast({ message: "저장했습니다.", tone: "ok" })}>기본 4초</Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ message: "게이트웨이에 닿지 못했습니다.", tone: "crit", duration: 0 })}>닫을 때까지</Button>
    </Inline>
  );
}

export const FromHook = () => (
  <ToastProvider>
    <Trigger />
  </ToastProvider>
);
