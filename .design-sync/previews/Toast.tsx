import * as React from "react";
import { Toast, ToastProvider, useToast, Button, Stack, Inline } from "@dbwk10317/bonggu-design-system";

/* Normally not rendered directly — the app-root ToastProvider draws it and screens call
   useToast().toast(). Shown standing still here just to see each tone. */
export const Tones = () => (
  <Stack gap={3}>
    <Toast tone="ok" message="두 장치에 적용했습니다." />
    <Toast tone="info" message="edge-seoul-03 을 격리했습니다." action="되돌리기" />
    <Toast tone="warn" message="노드 2대는 에이전트가 낮아 건너뛰었습니다." />
    <Toast tone="crit" message="게이트웨이에 닿지 못했습니다." action="다시 시도" />
  </Stack>
);

/* For a reversible action, attach an undo action to the toast instead of a confirm dialog. */
export const WithAction = () => (
  <Toast tone="info" message="노드 3대를 격리했습니다." action="되돌리기" onAction={() => {}} onDismiss={() => {}} />
);

/* Real usage: duration 0 stays until a person dismisses it — use only for failures. */
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
