/* 문서 테마 동기화 구현. 동작 기준은 readme.md의 문서 테마 규칙을 따른다. */
(() => {
  const KEY = "bds-theme";
  const standalone = /theme-toggle\.js(\?|$)/.test(document.currentScript?.src || "");
  const autoMount = document.currentScript?.dataset.mount !== "false";
  const topLevel = (() => { try { return window.self === window.top; } catch { return false; } })();
  /* 테마 전환 처방은 readme.md의 색 절을 따른다. 트랜지션을 끄지 않으면 스냅이 아니라 번짐이 된다. */
  const apply = (t) => {
    const root = document.documentElement;
    const stop = document.createElement("style");
    stop.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(stop);
    root.classList.toggle("dark", t === "dark");
    void root.offsetWidth;
    requestAnimationFrame(() => stop.remove());
    document.querySelectorAll("bds-theme-toggle").forEach((el) => el.render && el.render());
  };
  const get = () => { try { return localStorage.getItem(KEY) || "light"; } catch { return "light"; } };
  apply(get());
  window.addEventListener("storage", (e) => { if (e.key === KEY) apply(get()); });
  class Toggle extends HTMLElement {
    connectedCallback() { this.render(); }
    render() {
      const dark = get() === "dark";
      this.innerHTML = '<button type="button" aria-pressed="' + dark + '" aria-label="' + (dark ? "라이트 테마로" : "다크 테마로") + '" style="white-space:nowrap;display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--ink-2);font:500 11.5px var(--font-ui);cursor:pointer;white-space:nowrap"><i class="ph-bold ' + (dark ? "ph-sun" : "ph-moon") + '" style="font-size:13px"></i>' + (dark ? "Light" : "Dark") + '</button>';
      this.firstChild.onclick = () => { const t = dark ? "light" : "dark"; try { localStorage.setItem(KEY, t); } catch {} apply(t); };
    }
  }
  if (!customElements.get("bds-theme-toggle")) customElements.define("bds-theme-toggle", Toggle);
  if (standalone && autoMount && topLevel && !document.querySelector("bds-theme-toggle")) {
    const mount = () => { const el = document.createElement("bds-theme-toggle"); el.style.cssText = "position:fixed;top:8px;right:14px;z-index:99;display:inline-block;width:auto"; document.body.appendChild(el); };
    document.body ? mount() : document.addEventListener("DOMContentLoaded", mount);
  }
})();
