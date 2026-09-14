import * as React from "react";
import { ConfirmDialog, Button, Inline, Code } from "@dbwk10317/bonggu-design-system";

/* Not for reversible actions. confirmLabel should be a single verb naming the action. */
export const Restart = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>에이전트 재시작</Button>
      <ConfirmDialog
        open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)}
        title="에이전트를 재시작합니다"
        message={<>재시작하는 동안 <Code>edge-seoul-03</Code> 의 값이 30초쯤 비어 보입니다.</>}
        confirmLabel="재시작"
      />
    </>
  );
};

/* Use danger when irreversible; spell out what stays and what's gone. */
export const Danger = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>계정 삭제</Button>
      <ConfirmDialog
        open={open} danger onClose={() => setOpen(false)} onConfirm={() => setOpen(false)}
        title="계정을 삭제합니다"
        message="삭제하면 이 사람의 세션과 토큰이 바로 끊깁니다. 감사 로그에 남은 기록은 지워지지 않습니다."
        confirmLabel="삭제"
      />
    </>
  );
};

/* For broad or high-value actions, require typing the exact name. */
export const TypeToConfirm = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Inline><Button variant="danger" onClick={() => setOpen(true)}>조직 초기화</Button></Inline>
      <ConfirmDialog
        open={open} danger typeToConfirm="edge.bonggu.me"
        onClose={() => setOpen(false)} onConfirm={() => setOpen(false)}
        title="이 조직의 노드를 모두 등록 해제합니다"
        message="38대가 모두 게이트웨이에서 떨어지고, 다시 붙이려면 매장마다 설치 명령을 실행해야 합니다."
        confirmLabel="등록 해제"
      />
    </>
  );
};

/* busy locks confirm, cancel, Esc, and dim-click so the dialog can't vanish mid-operation. */
export const Busy = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Inline><Button variant="secondary" onClick={() => setOpen(true)}>처리 중 보기</Button></Inline>
      <ConfirmDialog open={open} busy danger title="노드 3대를 격리하는 중" message="잠시만 기다립니다." confirmLabel="격리" onClose={() => setOpen(false)} />
    </>
  );
};
