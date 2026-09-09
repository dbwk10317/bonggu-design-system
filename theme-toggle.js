/* 문서 카드용 라이트/다크 토글. localStorage("bds-theme")로 모든 카드가 함께 바뀐다(storage 이벤트). 제품 코드에서는 :root.dark 클래스만 토글하면 된다. */
(() => {
  const KEY = "bds-theme";
  const apply = (t) => { document.documentElement.classList.toggle("dark", t === "dark"); document.querySelectorAll("bds-theme-toggle").forEach((el) => el.render && el.render()); };
  const get = () => { try { return localStorage.getItem(KEY) || "light"; } catch { return "light"; } };
  apply(get());
  window.addEventListener("storage", (e) => { if (e.key === KEY) apply(get()); });
  class Toggle extends HTMLElement {
    connectedCallback() { this.render(); }
    render() {
      const dark = get() === "dark";
      this.innerHTML = '<button type="button" aria-pressed="' + dark + '" aria-label="' + (dark ? "라이트 테마로" : "다크 테마로") + '" style="white-space:nowrap;display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--text-2);font:500 11.5px var(--font-ui);cursor:pointer;white-space:nowrap"><i class="ph-bold ' + (dark ? "ph-sun" : "ph-moon") + '" style="font-size:13px"></i>' + (dark ? "Light" : "Dark") + '</button>';
      this.firstChild.onclick = () => { const t = dark ? "light" : "dark"; try { localStorage.setItem(KEY, t); } catch {} apply(t); };
    }
  }
  if (!customElements.get("bds-theme-toggle")) customElements.define("bds-theme-toggle", Toggle);
  if (!document.querySelector("bds-theme-toggle")) {
    const mount = () => { const el = document.createElement("bds-theme-toggle"); el.style.cssText = "position:fixed;top:8px;right:14px;z-index:99;display:inline-block;width:auto"; document.body.appendChild(el); };
    document.body ? mount() : document.addEventListener("DOMContentLoaded", mount);
  }
})();
