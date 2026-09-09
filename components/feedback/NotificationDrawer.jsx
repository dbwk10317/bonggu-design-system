import React from "react";
import { Drawer } from "../overlay/Drawer.jsx";
import { cx } from "../core/frame.js";
import { IconButton } from "../action/IconButton.jsx";
import { Button } from "../action/Button.jsx";
import { EmptyState } from "../feedback/EmptyState.jsx";

export const NOTIFICATION_DRAWER_ID = "bds-notification-drawer";
const TONE_LABEL = { info: "정보", warn: "주의", crit: "위험", ok: "정상" };

/** 상단바 종 버튼. 읽지 않은 수가 배지로. */
export function NotificationTrigger({ unreadCount = 0, open, onToggle, controls = NOTIFICATION_DRAWER_ID, ...rest }) {
  // 읽지 않은 수를 이름에 넣는 것은 badge를 그리는 IconButton의 몫이다. 여기서 숫자를 적으면 두 번 읽힌다.
  return <IconButton icon="bell" badge={unreadCount} aria-label="알림" aria-expanded={open} aria-controls={controls} onClick={onToggle} {...rest} />;
}

/** 오른쪽 알림 드로어(380px, 모바일 전폭). 항목을 누르면 onRead(id). */
export function NotificationDrawer({ open, onClose, items = [], onRead, onReadAll, id = NOTIFICATION_DRAWER_ID, className }) {
  const unread = items.filter((i) => !i.read).length;
  return (
    <Drawer open={open} onClose={onClose} id={id} size="sm" title="알림" aria-label="알림 센터"
      description={items.length === 0 ? "새 알림이 없습니다." : <>알림 <span className="bds-mono">{items.length}</span>건</>}
      className={cx("bds-notification-drawer", className)}>
        {items.length === 0 ? <EmptyState plain face="smiling" title="모든 상태가 정상입니다" description="주의가 필요한 상태가 생기면 여기에 표시됩니다." /> : (
          <>
            <div className="bds-drawer__tools"><span>읽지 않음 <span className="bds-mono">{unread}</span>건</span><Button size="sm" variant="ghost" disabled={unread === 0} onClick={onReadAll}>모두 읽음</Button></div>
            <ul className="bds-drawer__list">
              {items.map((it) => (
                <li key={it.id}>
                  <button type="button" className={cx("bds-notif", `bds-tone--${it.tone}`, it.read && "bds-notif--read")} onClick={() => onRead?.(it.id)}
                    aria-label={`${TONE_LABEL[it.tone]}, ${it.title}, ${it.read ? "읽음" : "읽지 않음"}${it.resolved ? ", 해제됨" : ""}`}>
                    <i className="bds-notif__dot" aria-hidden="true" />
                    <span className="bds-notif__t">{it.title}</span>
                    <span className="bds-notif__d">{it.description && <>{it.description} · </>}<span className="bds-mono">{it.time}</span>{it.resolved && " · 해제됨"}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
    </Drawer>
  );
}
