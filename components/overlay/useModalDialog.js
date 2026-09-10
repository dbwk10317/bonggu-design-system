import { useEffect } from "react";

// Share the body lock across nested dialogs, including dialogs closed out of order.
/** @typedef {{ dialog: HTMLDialogElement, opener: HTMLElement | null }} DialogEntry */
/** @type {WeakMap<Document, { entries: DialogEntry[], overflow: string }>} */
const sessions = new WeakMap();
/** @param {{ current: HTMLDialogElement | null }} panel @param {boolean} open */
export function useModalDialog(panel, open) {
  useEffect(() => {
    const dialog = panel.current;
    if (!open || !dialog) return;
    const doc = dialog.ownerDocument;
    let state = sessions.get(doc);
    if (!state) {
      state = { entries: [], overflow: doc.body.style.overflow };
      sessions.set(doc, state);
    }
    const entry = { dialog, opener: /** @type {HTMLElement | null} */ (doc.activeElement) };
    state.entries.push(entry);
    doc.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    // showModal performs native autofocus; retain it and use the panel only as fallback.
    if (!dialog.contains(doc.activeElement)) dialog.focus();
    return () => {
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
        doc.body.style.overflow = state.overflow;
        sessions.delete(doc);
      }
      if (top && entry.opener?.isConnected && (!remaining || remaining.contains(entry.opener))) entry.opener.focus?.();
      if (remaining && !remaining.contains(doc.activeElement)) remaining.focus();
    };
  }, [open, panel]);
}
