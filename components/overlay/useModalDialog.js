import { useEffect, useRef } from "react";

// Share the body lock across nested dialogs, including dialogs closed out of order.
/** @typedef {{ dialog: HTMLDialogElement, opener: HTMLElement | null }} DialogEntry */
/** A session keeps the body it locked; the document is not re-read at close time.
 * @type {WeakMap<Document, { entries: DialogEntry[], body: HTMLElement, overflow: string }>} */
const sessions = new WeakMap();

/** Open session of a native dialog: owns scroll lock, focus restore, nesting cleanup and backdrop dismissal. See RULE.md "동작 계약".
 * Backdrop dismissal lives here because ::backdrop has no element of its own, so it needs an outside-the-panel
 * hit test, and Modal and Drawer would otherwise duplicate that handler in JSX.
 * @param {{ current: HTMLDialogElement | null }} panel
 * @param {boolean} open
 * @param {(() => void) | undefined} [onClose] Called on backdrop press. Omit to disable backdrop dismissal.
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
    /* Hit-test on mousedown: click would also fire for a drag that starts inside the panel and ends outside. */
    const onDown = (/** @type {MouseEvent} */ e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeRef.current?.();
    };
    dialog.addEventListener("mousedown", onDown);
    return () => {
      dialog.removeEventListener("mousedown", onDown);
      /* If focus already escaped to a real element outside the dialog, that is the intended target and
         restoring the opener would clobber it. body means "nowhere", so restore in that case. */
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
      /* dialog.close() moves focus back to the opener on its own. If a command already sent focus
         elsewhere, hand it back there after closing. */
      if (escaped) /** @type {HTMLElement} */ (moved).focus?.();
      else if (top && entry.opener?.isConnected && (!remaining || remaining.contains(entry.opener))) entry.opener.focus?.();
      if (remaining && !remaining.contains(doc.activeElement)) remaining.focus();
    };
  }, [open, panel]);
}
