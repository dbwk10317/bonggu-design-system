/* Document theme sync. See RULE.md "컴포넌트 사용 규칙" (document theme controls). */
(() => {
  const KEY = "bds-theme";
  const standalone = /theme-toggle\.js(\?|$)/.test(document.currentScript?.src || "");
  const autoMount = document.currentScript?.dataset.mount !== "false";
  const topLevel = (() => { try { return window.self === window.top; } catch { return false; } })();
  /* Kill transitions while flipping the theme or the swap smears instead of snapping. See RULE.md "VISUAL FOUNDATIONS" */
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
