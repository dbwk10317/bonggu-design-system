import { useEffect, useRef } from "react";

// Share the body lock across nested dialogs, including dialogs closed out of order.
/** @typedef {{ dialog: HTMLDialogElement, opener: HTMLElement | null }} DialogEntry */
/** 세션은 자기가 잠근 body 를 들고 있는다. 여는 시점과 닫는 시점의 document 를 따로 읽지 않는다.
 * @type {WeakMap<Document, { entries: DialogEntry[], body: HTMLElement, overflow: string }>} */
const sessions = new WeakMap();

/** 네이티브 dialog 의 개방 세션. 스크롤 잠금·포커스 복원·중첩 정리와 배경 클릭 해제를 함께 소유한다.
 * 배경 해제를 여기 두는 이유: dialog 의 배경은 ::backdrop 이라 별도 요소가 없고, 패널 바깥 좌표
 * 판정이 Modal·Drawer 에 똑같이 필요했다. JSX 에 핸들러를 두면 두 곳에 같은 코드가 생긴다.
 * @param {{ current: HTMLDialogElement | null }} panel
 * @param {boolean} open
 * @param {(() => void) | undefined} [onClose] 배경을 눌렀을 때. 생략하면 배경 클릭으로 닫지 않는다.
 */
export function useModalDialog(panel, open, onClose) {
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });
  useEffect(() => {
    const dialog = panel.current;
    if (!open || !dialog) return;
    const doc = dialog.ownerDocument;
    let state = sessions.get(doc);
    if (!state) {
      state = { entries: [], body: doc.body, overflow: doc.body.style.overflow };
      sessions.set(doc, state);
    }
    const entry = { dialog, opener: /** @type {HTMLElement | null} */ (doc.activeElement) };
    state.entries.push(entry);
    state.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    // showModal performs native autofocus; retain it and use the panel only as fallback.
    if (!dialog.contains(doc.activeElement)) dialog.focus();
    /* 배경 판정은 mousedown 으로 한다. click 은 패널 안에서 시작해 밖에서 끝난 드래그도 잡는다. */
    const onDown = (/** @type {MouseEvent} */ e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeRef.current?.();
    };
    dialog.addEventListener("mousedown", onDown);
    return () => {
      dialog.removeEventListener("mousedown", onDown);
      /* 닫는 동안 이미 다이얼로그 밖의 실제 요소로 포커스가 옮겨졌다면 그쪽이 의도한 자리다.
         opener 로 되돌리면 명령이 보낸 포커스를 덮는다. body 는 "아무 데도 없음"이라 되돌린다. */
      const moved = doc.activeElement;
      const escaped = moved != null && moved !== doc.body && !dialog.contains(moved);
      const top = state.entries.at(-1) === entry;
      state.entries = state.entries.filter((item) => item !== entry);
      for (const item of state.entries) {
        if (dialog.contains(item.opener)) item.opener = entry.opener;
      }
      // Native manual popovers are separate top-layer entries; end their child sessions first.
      /** @type {NodeListOf<HTMLElement>} */ (dialog.querySelectorAll("[popover]:popover-open")).forEach((popover) => popover.hidePopover());
      if (dialog.open) dialog.close();
      const remaining = state.entries.at(-1)?.dialog;
      if (!remaining) {
        state.body.style.overflow = state.overflow;
        sessions.delete(doc);
      }
      /* dialog.close() 는 브라우저가 스스로 opener 로 포커스를 되돌린다. 명령이 이미 다른 곳으로
         보냈다면 그 자리가 의도한 곳이므로 닫은 뒤 다시 돌려준다. */
      if (escaped) /** @type {HTMLElement} */ (moved).focus?.();
      else if (top && entry.opener?.isConnected && (!remaining || remaining.contains(entry.opener))) entry.opener.focus?.();
      if (remaining && !remaining.contains(doc.activeElement)) remaining.focus();
    };
  }, [open, panel]);
}
