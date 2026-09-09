NotificationDrawer + NotificationTrigger — 상단바 종 버튼과 오른쪽 알림 드로어. 알림은 래치되고 읽음 처리 전까지 남는다.

```jsx
<NotificationTrigger unreadCount={2} open={open} onToggle={()=>setOpen(o=>!o)} />
<NotificationDrawer open={open} onClose={()=>setOpen(false)} items={alarms} onRead={read} onReadAll={readAll} />
```
