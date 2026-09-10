const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const esbuild = require("esbuild");
const { chromium } = require("playwright");

const contentType = (file) => {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js") || file.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
  if (file.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
};

function createServer({ work, consumer }) {
  const roots = [fs.realpathSync(work), fs.realpathSync(consumer)];
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    if (pathname === "/favicon.ico") {
      response.writeHead(204);
      response.end();
      return;
    }
    const file = pathname === "/browser.html"
      ? path.join(work, "browser.html")
      : pathname.startsWith("/bundle/")
        ? path.join(work, pathname.slice(1))
        : pathname.startsWith("/node_modules/")
          ? path.join(consumer, pathname.slice(1))
          : null;
    if (!file) {
      response.writeHead(404);
      response.end();
      return;
    }
    let resolved;
    try {
      resolved = fs.realpathSync(file);
    } catch {
      response.writeHead(404);
      response.end();
      return;
    }
    if (!roots.some((root) => resolved === root || resolved.startsWith(`${root}${path.sep}`))) {
      response.writeHead(403);
      response.end();
      return;
    }
    response.setHeader("Content-Type", contentType(resolved));
    response.end(fs.readFileSync(resolved));
  });
}

async function assertPackageBrowser({ run, work, consumer }) {
  const bundleDir = path.join(work, "bundle");
  await esbuild.build({
    entryPoints: [path.join(consumer, "browser-entry.mjs")],
    outdir: bundleDir,
    entryNames: "browser-entry",
    bundle: true,
    format: "esm",
    platform: "browser",
    minify: true,
    sourcemap: false,
    assetNames: "assets/[name]-[hash]",
    loader: { ".woff2": "file", ".svg": "file" },
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "silent",
  });

  const ssr = run(process.execPath, ["browser-ssr.mjs"]);
  assert.match(ssr.stdout, /설치 패키지 hydration/);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style id="host-css">body{margin:37px;background:#ff00ff;font-family:serif}ul{margin:19px;list-style:square}.fixture-shell{width:min(100%,720px);margin-inline:auto;padding:24px}</style><link rel="stylesheet" href="/bundle/browser-entry.css"></head><body><div id="root">${ssr.stdout}</div><script type="module" src="/bundle/browser-entry.js"></script></body></html>`;
  fs.writeFileSync(path.join(work, "browser.html"), html);

  const server = createServer({ work, consumer });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.DS_TEST_BROWSER_EXECUTABLE ? { executablePath: process.env.DS_TEST_BROWSER_EXECUTABLE } : {}),
  });
  const failures = [];
  const requestedKinds = new Set();
  const themeCanvas = new Map();
  const densityHeight = new Map();
  let combinations = 0;
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(10000);
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) failures.push(`console ${message.type()}: ${message.text()}`);
    });
    page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (response.status() >= 400) failures.push(`HTTP ${response.status()}: ${url.pathname}`);
      if (url.pathname.endsWith(".css")) requestedKinds.add("css");
      if (url.pathname.endsWith(".woff2")) requestedKinds.add(url.pathname.toLowerCase().includes("phosphor") ? "icon-font" : "font");
      if (url.pathname.endsWith(".svg")) requestedKinds.add("asset");
    });

    for (const width of [1280, 834, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ["light", "dark"]) {
        for (const density of ["default", "compact"]) {
          const query = new URLSearchParams({ width: String(width), theme, density });
          await page.goto(`http://127.0.0.1:${server.address().port}/browser.html?${query}`);
          await page.evaluate(({ theme: nextTheme, density: nextDensity }) => {
            document.documentElement.classList.toggle("dark", nextTheme === "dark");
            if (nextDensity === "compact") document.documentElement.dataset.density = "compact";
            else document.documentElement.removeAttribute("data-density");
          }, { theme, density });
          await page.waitForFunction(() => window.__fixtureHydrated === true);
          await page.evaluate(() => document.fonts.ready);
          const metrics = await page.evaluate(() => {
            const rootStyle = getComputedStyle(document.documentElement);
            const panel = document.getElementById("fixture-panel");
            const button = document.getElementById("fixture-save");
            const list = document.getElementById("fixture-list");
            return {
              canvas: rootStyle.getPropertyValue("--canvas").trim(),
              controlHeight: Number.parseFloat(rootStyle.getPropertyValue("--h-ctl")),
              panelPad: Number.parseFloat(rootStyle.getPropertyValue("--panel-pad")),
              bodyMargin: getComputedStyle(document.body).margin,
              bodyFont: getComputedStyle(document.body).fontFamily,
              listMargin: getComputedStyle(list).margin,
              listStyle: getComputedStyle(list).listStyleType,
              panelBorder: getComputedStyle(panel).borderTopStyle,
              buttonHeight: button.getBoundingClientRect().height,
              overflow: document.documentElement.scrollWidth - innerWidth,
              mascotReady: document.getElementById("fixture-mascot").complete && document.getElementById("fixture-mascot").naturalWidth > 0,
            };
          });
          assert(metrics.canvas, "테마 canvas 토큰이 비어 있음");
          assert.equal(metrics.bodyMargin, "0px", "full-app base가 host body margin을 reset하지 않음");
          assert.notEqual(metrics.bodyFont.toLowerCase(), "serif", "full-app 글꼴이 host 전역 글꼴에 밀림");
          assert.equal(metrics.listMargin, "0px", "full-app 목록 reset이 적용되지 않음");
          assert.equal(metrics.listStyle, "none", "full-app 목록 marker reset이 적용되지 않음");
          assert.equal(metrics.panelBorder, "solid", "설치 패키지 Panel CSS가 적용되지 않음");
          assert(metrics.buttonHeight + 0.5 >= metrics.controlHeight, "Button이 현재 밀도 control 하한보다 작음");
          assert(metrics.overflow <= 1, `${width}px에서 가로 overflow ${metrics.overflow}px`);
          assert(metrics.mascotReady, "exported mascot asset 로드 실패");
          themeCanvas.set(`${width}:${density}:${theme}`, metrics.canvas);
          densityHeight.set(`${width}:${theme}:${density}`, { control: metrics.controlHeight, panel: metrics.panelPad });
          combinations += 1;
        }
      }
    }

    for (const width of [1280, 834, 390]) {
      for (const density of ["default", "compact"]) {
        assert.notEqual(themeCanvas.get(`${width}:${density}:light`), themeCanvas.get(`${width}:${density}:dark`), `${width}px ${density}에서 light/dark canvas가 같음`);
      }
      for (const theme of ["light", "dark"]) {
        const normal = densityHeight.get(`${width}:${theme}:default`);
        const compact = densityHeight.get(`${width}:${theme}:compact`);
        assert(compact.control < normal.control, `${width}px ${theme}에서 compact control 토큰이 줄지 않음`);
        assert(compact.panel < normal.panel, `${width}px ${theme}에서 compact panel 토큰이 줄지 않음`);
      }
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`http://127.0.0.1:${server.address().port}/browser.html?interaction`);
    await page.waitForFunction(() => window.__fixtureHydrated === true);
    await page.getByRole("button", { name: "저장", exact: true }).click();
    await page.getByText("저장 완료", { exact: true }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(failures.length, 0, failures.join("\n"));
    for (const kind of ["css", "font", "icon-font", "asset"]) assert(requestedKinds.has(kind), `${kind} 네트워크 요청을 확인하지 못함`);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  console.log(`PASS package browser: hydration, interaction, ${combinations} theme/density/width combinations, host CSS and assets`);
}

module.exports = { assertPackageBrowser };
