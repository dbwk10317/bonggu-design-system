import { useEffect, useLayoutEffect, useRef } from "react";

// 서버에는 레이아웃이 없어 측정할 것이 없다. 브라우저에서만 그리기 전에 동기로 배치한다.
const useIsoLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

/** 비모달 메뉴의 배치 계약: DOM 소속은 유지하고 native popover로 clipping 밖 top layer에 표시한다.
 * fixed 좌표는 트리거·visual viewport에서 계산하고 스크롤/리사이즈 시 다시 맞춘다. */
/** @param {{ open: boolean, anchorRef: { current: HTMLElement | null }, panelRef: { current: HTMLElement | null }, align?: "start" | "end", onDismiss?: () => void }} options */
export function useAnchoredPopover({ open, anchorRef, panelRef, align = "end", onDismiss }) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  useIsoLayoutEffect(() => {
    const panel = panelRef.current, anchor = anchorRef.current;
    if (!open || !panel || !anchor) return;
    panel.showPopover();
    // A manual popover is a child interaction session, never longer-lived than its owning dialog.
    const owner = anchor.closest('dialog');
    const dismiss = () => { if (panel.matches(":popover-open")) panel.hidePopover(); dismissRef.current?.(); };
    const toggled = (/** @type {ToggleEvent} */ event) => { if (event.newState === "closed") dismissRef.current?.(); };
    owner?.addEventListener("close", dismiss);
    panel.addEventListener("toggle", toggled);
    const place = () => {
      const viewport = window.visualViewport;
      const vx = viewport?.offsetLeft ?? 0, vy = viewport?.offsetTop ?? 0;
      const vw = viewport?.width ?? document.documentElement.clientWidth;
      const vh = viewport?.height ?? document.documentElement.clientHeight;
      const margin = 8, gap = 4, a = anchor.getBoundingClientRect();
      panel.style.maxWidth = `${Math.max(0, vw - margin * 2)}px`;
      panel.style.maxHeight = `${Math.max(0, vh - margin * 2)}px`;
      const below = Math.max(0, vy + vh - margin - a.bottom - gap);
      const above = Math.max(0, a.top - gap - vy - margin);
      const upwards = panel.scrollHeight > below && above > below;
      panel.style.maxHeight = `${Math.min(Math.max(0, vh - margin * 2), upwards ? above : below)}px`;
      const w = panel.offsetWidth, h = panel.offsetHeight;
      const left = align === "start" ? a.left : a.right - w;
      panel.style.left = `${Math.max(vx + margin, Math.min(left, vx + vw - margin - w))}px`;
      panel.style.top = `${Math.max(vy + margin, Math.min(upwards ? a.top - gap - h : a.bottom + gap, vy + vh - margin - h))}px`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(anchor); ro.observe(panel);
    window.addEventListener("resize", place);
    document.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      ro.disconnect();
      owner?.removeEventListener("close", dismiss);
      panel.removeEventListener("toggle", toggled);
      window.removeEventListener("resize", place);
      document.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
      if (panel.matches(":popover-open")) panel.hidePopover();
    };
  }, [open, align, anchorRef, panelRef]);
}
