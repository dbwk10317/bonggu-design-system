import * as React from "react";
import { NotificationDrawer, NotificationTrigger, Stack, Inline, Panel, CardHead } from "@dbwk10317/bonggu-design-system";
import type { NotificationItem } from "@dbwk10317/bonggu-design-system";

const ITEMS: NotificationItem[] = [
  { id: "a1", title: "edge-seoul-03 응답 없음", description: "22분째 값을 받지 못했습니다. 현장 확인이 필요합니다.", tone: "crit", time: "13:40", read: false },
  { id: "a2", title: "노드 2대 수집 지연", description: "5초 주기를 놓치고 있습니다.", tone: "warn", time: "13:12", read: false },
  { id: "a3", title: "롤아웃 완료", description: "2.14.0 을 38대 모두에 적용했습니다.", tone: "ok", time: "11:05", read: true },
  { id: "a4", title: "예정된 점검", description: "9월 14일 02:00~03:00 게이트웨이 재시작.", tone: "info", time: "어제", read: true, resolved: true },
];

/* Pairs with the bell button in the top bar; the trigger owns open, the drawer just reads it. */
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

/* Has its own empty state even when empty; don't add a separate EmptyState. */
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

/* Shows a mix of read and unread; resolved means it's already over. */
export const Mixed = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <Stack gap={3}>
      <NotificationDrawer open={open} onClose={() => setOpen(false)} items={ITEMS} onReadAll={() => {}} />
    </Stack>
  );
};
