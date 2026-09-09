NotificationDrawer + NotificationTrigger · 상단바 종 버튼과 오른쪽 알림 드로어. 알림은 래치되고 읽음 처리 전까지 남는다.

```jsx
<NotificationTrigger unreadCount={2} open={open} onToggle={()=>setOpen(o=>!o)} />
<NotificationDrawer open={open} onClose={()=>setOpen(false)} items={alarms} onRead={read} onReadAll={readAll} />
```

- 공통 Drawer의 네이티브 dialog를 사용한다. Tab 포커스는 패널 안에 머물고 Esc·딤·닫기 버튼으로 닫으면 열었던 요소로 복귀한다. 여러 알림 패널은 각각 고유 id와 대응하는 Trigger controls를 지정한다.
