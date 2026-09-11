import * as React from "react";
import { NotificationDrawer, NotificationTrigger, Stack, Inline, Panel, CardHead } from "@dbwk10317/bonggu-design-system";
import type { NotificationItem } from "@dbwk10317/bonggu-design-system";

const ITEMS: NotificationItem[] = [
  { id: "a1", title: "edge-seoul-03 응답 없음", description: "22분째 값을 받지 못했습니다. 현장 확인이 필요합니다.", tone: "crit", time: "13:40", read: false },
  { id: "a2", title: "노드 2대 수집 지연", description: "5초 주기를 놓치고 있습니다.", tone: "warn", time: "13:12", read: false },
  { id: "a3", title: "롤아웃 완료", description: "2.14.0 을 38대 모두에 적용했습니다.", tone: "ok", time: "11:05", read: true },
  { id: "a4", title: "예정된 점검", description: "9월 14일 02:00~03:00 게이트웨이 재시작.", tone: "info", time: "어제", read: true, resolved: true },
];

/* 상단바의 종 버튼과 짝이다. 트리거가 open 을 쥐고 드로어는 그것만 본다. */
export const WithTrigger = () => {
  const [open, setOpen] = React.useState(true);
  const [items, setItems] = React.useState(ITEMS);
  const unread = items.filter((i) => !i.read).length;
  return (
    <>
      <Panel padding="sm">
        <Inline gap={3} align="center">
          <b>봉구 엣지 콘솔</b>
          <NotificationTrigger unreadCount={unread} open={open} onToggle={() => setOpen((o) => !o)} />
        </Inline>
      </Panel>
      <NotificationDrawer
        open={open} onClose={() => setOpen(false)} items={items}
        onRead={(id) => setItems((v) => v.map((i) => (i.id === id ? { ...i, read: true } : i)))}
        onReadAll={() => setItems((v) => v.map((i) => ({ ...i, read: true })))}
      />
    </>
  );
};

/* 비어 있을 때도 자기 빈 상태를 가진다. 따로 EmptyState 를 얹지 않는다. */
export const Empty = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <Panel padding="sm">
        <CardHead title="알림 없음" meta="items=[]" />
      </Panel>
      <NotificationDrawer open={open} onClose={() => setOpen(false)} items={[]} />
    </>
  );
};

/* 읽은 것과 안 읽은 것이 섞여 있는 모습. resolved 는 이미 끝난 일이다. */
export const Mixed = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Stack gap={3}>
      <NotificationDrawer open={open} onClose={() => setOpen(false)} items={ITEMS} onReadAll={() => {}} />
    </Stack>
  );
};
