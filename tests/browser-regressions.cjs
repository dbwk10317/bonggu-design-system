const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const deps = process.env.DS_TEST_NODE_MODULES ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__browser-tests.cjs')) : require;
// The debug module inside @babel/standalone reads bare localStorage at load, which makes Node emit an ExperimentalWarning; stub it first.
try { Object.defineProperty(globalThis, 'localStorage', { value: { getItem: () => null }, configurable: true, writable: true }); } catch {}
const { chromium } = deps('playwright');
const root = path.resolve(__dirname, '..');
const reactDir = path.dirname(deps.resolve('react/package.json'));
const reactDomDir = path.dirname(deps.resolve('react-dom/package.json'));
const babelDir = path.dirname(deps.resolve('@babel/standalone/package.json'));
const localScripts = {
  '/test-react.js': path.join(reactDir, 'umd/react.development.js'),
  '/test-react-dom.js': path.join(reactDomDir, 'umd/react-dom.development.js'),
  '/test-babel.js': path.join(babelDir, 'babel.min.js'),
};
// templates/dashboard/support.js is dc-runtime output with unpkg URLs and SRI hashes baked in. The gate must not
// touch the network, so the response body is rewritten to local paths and integrity values are blanked
// (local dev builds / other babel versions would otherwise fail the SRI check).
const CDN_LOCAL = {
  'https://unpkg.com/react@18.3.1/umd/react.development.js': '/test-react.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js': '/test-react-dom.js',
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js': '/test-react.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js': '/test-react-dom.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js': '/test-babel.js',
};
const rewriteSupport = (src) => Object.entries(CDN_LOCAL)
  .reduce((s, [from, to]) => s.split(from).join(to), src)
  .replace(/"sha384-[^"]*"/g, '""')
  // Local @babel/standalone is 8.x, whose preset-react defaults to the automatic runtime; that injects import
  // statements into code x-import runs via new Function. Force classic to match the template's pinned 7.29.
  .replace('presets: ["react", "typescript"]', 'presets: [["react", { runtime: "classic" }], "typescript"]');
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost').pathname;
  // Browsers request this automatically; a 404 would leave a console error that mixes with real ones.
  if (url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  const file = url === '/' ? path.join(__dirname, 'fixtures/regressions.html')
    : localScripts[url] ?? path.resolve(root, '.' + url);
  if (!file.startsWith(root + path.sep) && !Object.values(localScripts).includes(file)) { res.writeHead(403); res.end(); return; }
  try {
    const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
    const body = url === '/templates/dashboard/support.js' || file.endsWith('.html') ? rewriteSupport(fs.readFileSync(file, 'utf8')) : fs.readFileSync(file);
    res.setHeader('Content-Type', type); res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
async function run() {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ headless: true, ...(process.env.DS_TEST_BROWSER_EXECUTABLE ? { executablePath: process.env.DS_TEST_BROWSER_EXECUTABLE } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(10000);
    const errors = []; page.on('pageerror', e => { errors.push(e.message); console.error('Browser error:', e.message); });
    const fresh = async (name) => { await page.goto(`http://127.0.0.1:${server.address().port}`); await page.waitForFunction(() => window.demo && window.Ds_d3ea90.Modal); if (name) await page.evaluate(n => demo(n), name); };
    const poll = async (fn, expected) => { await page.waitForFunction(({ code, expected }) => JSON.stringify((0, eval)(code)()) === JSON.stringify(expected), { code: fn.toString(), expected }); };

    await fresh();
    assert.deepEqual(await page.evaluate(() => window.Ds_d3ea90.__errors), []);
    const componentNames = JSON.parse(fs.readFileSync(path.join(root, '_ds_manifest.json'), 'utf8')).components.map(c => c.name);
    assert.deepEqual(await page.evaluate(names => names.filter(name => !window.Ds_d3ea90[name]), componentNames), []);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [size, target] of Object.entries({ sm: 360, md: 440, lg: 560, xl: 760 })) {
        await page.evaluate(size => mount('Modal', { open: true, title: '크기 확인', size }), size);
        await page.waitForSelector('dialog[open]');
        await page.waitForFunction(expected => Math.abs(document.querySelector('dialog').getBoundingClientRect().width - expected) < 1, width < 640 ? width : target);
      }
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    await fresh('forms'); await page.locator('dialog').nth(1).getByRole('button', { name: '저장', exact: true }).click();
    await poll(() => window.submissions, ['second']);
    await fresh(); await page.evaluate(() => mount('FormModal', { open: true, title: '제출 없음', submitLabel: null }));
    await page.waitForSelector('dialog[open]'); assert.equal(await page.locator('button[type=submit]').count(), 0);

    await fresh('confirm'); await page.locator('dialog input').fill('DELETE');
    await page.getByRole('button', { name: '취소', exact: true }).click(); await page.getByRole('button', { name: '다시 열기' }).click();
    assert.equal(await page.locator('dialog input').inputValue(), ''); assert(await page.getByRole('button', { name: '삭제', exact: true }).isDisabled());
    await page.locator('dialog input').fill('DELETE'); await page.evaluate(() => setTarget('OTHER'));
    await poll(() => document.querySelector('dialog input').value, '');
    await page.evaluate(() => setBusy(true)); await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog[open]').count(), 1);
    await page.mouse.click(2, 2); assert.equal(await page.locator('dialog[open]').count(), 1);

    await fresh('notification'); await page.getByRole('button', { name: '알림 열기' }).click();
    await page.waitForFunction(() => document.querySelector('dialog')?.matches(':modal'));
    await page.locator('dialog').getByRole('button', { name: '닫기', exact: true }).focus(); await page.keyboard.press('Tab');
    // A native dialog may let Tab reach browser chrome; background page controls must stay inert.
    assert.notEqual(await page.evaluate(() => document.activeElement.textContent), '배경 동작');
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => !!document.activeElement.closest('dialog')));
    await page.keyboard.press('Escape'); await poll(() => document.activeElement.textContent, '알림 열기');

    for (const underlyingFirst of [false, true]) {
      await fresh('nested'); await page.getByRole('button', { name: '상세 열기' }).click();
      await page.waitForFunction(() => document.querySelectorAll('dialog[open]').length === 2);
      if (underlyingFirst) { await page.evaluate(() => closeUnderlying()); await page.waitForFunction(() => document.querySelectorAll('dialog[open]').length === 1); }
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      await page.keyboard.press('Escape');
      if (!underlyingFirst) { await page.waitForFunction(() => document.querySelectorAll('dialog[open]').length === 1); assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden'); await page.keyboard.press('Escape'); }
      await poll(() => document.body.style.overflow, '');
    }

    await fresh('menu'); await page.getByRole('button', { name: '더 보기' }).click();
    await page.waitForFunction(() => document.querySelector('[role=menu]')?.matches(':popover-open'));
    assert(await page.locator('[role=menu]').evaluate(e => { const r = e.getBoundingClientRect(); return e.contains(document.elementFromPoint(r.left + 20, r.bottom - 12)); }));
    assert(await page.locator('.bds-table__scroll').evaluate(e => e.scrollHeight <= e.clientHeight + 1));
    await page.getByRole('menuitem', { name: '복사', exact: true }).click(); await poll(() => window.picked, ['copy']);
    await page.getByRole('button', { name: '더 보기' }).press('ArrowDown'); await page.keyboard.press('Tab');
    await poll(() => document.activeElement.id, 'after-menu');
    /* CommandPalette, see RULE.md "동작 계약". Nothing else opens it, so the open-path hooks run only here. */
    await fresh('palette');
    await page.locator('#open-palette').click();
    await page.waitForFunction(() => document.querySelector('dialog.bds-cmdk__panel')?.matches(':modal'));
    assert.equal(await page.locator('[role=option]').count(), 3, '팔레트 항목 수');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('role')), 'combobox', '열면 검색 입력에 포커스');
    await page.keyboard.type('재시작');
    await poll(() => document.querySelectorAll('[role=option]').length, 1);
    await page.keyboard.press('Enter'); await poll(() => window.ran, ['restart']);
    await page.waitForFunction(() => !document.querySelector('dialog.bds-cmdk__panel'));
    await poll(() => document.activeElement.id, 'open-palette');
    /* A command that moves focus must not be overridden by close-time focus restore. */
    await page.locator('#open-palette').click();
    await page.waitForFunction(() => document.querySelector('dialog.bds-cmdk__panel')?.matches(':modal'));
    await page.keyboard.type('이동');
    await poll(() => document.querySelectorAll('[role=option]').length, 1);
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('dialog.bds-cmdk__panel'));
    await poll(() => document.activeElement.id, 'jump-target');
    await page.locator('#open-palette').click();
    await page.waitForFunction(() => document.querySelector('dialog.bds-cmdk__panel')?.matches(':modal'));
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('dialog.bds-cmdk__panel'));
    console.log('PASS command palette: modal session, focus, filter, run, focus restore');
    await fresh('menuModal'); await page.getByRole('button', { name: '더 보기' }).click(); await page.getByRole('menuitem', { name: '복사' }).focus();
    await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('[role=menu]'));
    assert.equal(await page.locator('dialog[open]').count(), 1); await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('dialog[open]'));
    await fresh('menuDrawer'); await page.getByRole('button', { name: '더 보기' }).click(); await page.getByRole('menuitem', { name: '복사' }).focus();
    await page.evaluate(() => setDrawerOpen(false)); await page.waitForFunction(() => !document.querySelector('dialog[open]'));
    await page.waitForFunction(() => !document.querySelector(':popover-open'));
    await page.evaluate(() => setDrawerOpen(true)); await page.waitForSelector('dialog[open]');
    await page.waitForFunction(() => document.querySelector('[aria-haspopup="menu"]')?.getAttribute('aria-expanded') === 'false');
    await fresh('menuEdge'); await page.setViewportSize({ width: 390, height: 500 }); await page.getByRole('button', { name: '더 보기' }).click();
    const fits = () => page.locator('[role=menu]').evaluate(e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; });
    assert(await fits()); await page.setViewportSize({ width: 320, height: 400 }); await page.waitForTimeout(50); assert(await fits());
    await fresh('menuScroll'); await page.getByRole('button', { name: '더 보기' }).click();
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(50); assert(await fits());

    await fresh('inputs'); await page.setViewportSize({ width: 834, height: 900 });
    const num = page.getByRole('spinbutton'); await num.fill(''); assert.equal(await num.inputValue(), '');
    await num.pressSequentially('25'); assert.equal(await num.inputValue(), '25'); await num.press('Tab'); await poll(() => inputValues.number, 25);
    await num.fill('2'); assert.equal(await num.inputValue(), '2'); await num.press('Tab'); await poll(() => inputValues.number, 10);
    const combo = page.getByRole('combobox'); await combo.focus(); await combo.press('ArrowDown'); await combo.press('ArrowDown'); await combo.press('Enter');
    await poll(() => inputValues.multi, ['C']); await combo.press('Enter'); await poll(() => inputValues.multi, ['C', 'A']);
    await page.getByRole('button', { name: '입력 완료' }).click(); await page.evaluate(() => setDate('2026-09-15'));
    await page.getByRole('button', { name: '날짜', exact: true }).click(); await page.waitForFunction(() => document.querySelector('.bds-cal__hd b')?.textContent === '2026.09');
    await page.keyboard.press('Escape'); const third = page.getByRole('textbox', { name: '3번째 자리', exact: true });
    await third.focus(); await third.press('Backspace'); await poll(() => inputValues.otp, '12 456');
    await third.fill('9'); await poll(() => inputValues.otp, '129456');

    // Exercise the real feedback card after replacing its obsolete always-open inline drawer demo.
    await fresh();
    const card = fs.readFileSync(path.join(root, 'components/feedback/feedback.card.html'), 'utf8');
    const script = card.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)[1];
    await page.evaluate(() => { document.body.innerHTML = '<div id="root"></div>'; });
    await page.addScriptTag({ content: deps('@babel/standalone').transform(script, { presets: [['react', { runtime: 'classic' }]] }).code });
    await page.getByRole('button', { name: '알림 열기', exact: true }).waitFor();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    await page.getByRole('button', { name: '알림 열기', exact: true }).click(); await page.waitForSelector('dialog[open]');
    await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('dialog[open]'));

    const guideGroups = ['action', 'brand', 'layout', 'navigation', 'input', 'data', 'display', 'overlay', 'feedback'];
    const guideValues = ['colors-surface', 'colors-text', 'colors-accent', 'colors-status', 'colors-chart', 'colors-dark', 'type-ui', 'type-mono', 'type-korean', 'spacing-scale', 'spacing-radius', 'layout-breakpoints', 'motion'];
    const guide = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    guide.setDefaultTimeout(20000);
    const guideErrors = [];
    guide.on('pageerror', e => guideErrors.push(`pageerror: ${e.message}`));
    guide.on('console', m => { if (m.type() === 'error') guideErrors.push(`console: ${m.text()}`); });
    // A hash-only goto does not reload the document; while show() swaps the iframe src the previous card is still
    // there, so an immediate assertion reads the prior hash's DOM. Wait until the frame actually shows the target card.
    const openGuide = async (hash) => {
      await guide.goto(`http://127.0.0.1:${server.address().port}/guidelines/index.html#${hash}`);
      await guide.waitForFunction((h) => {
        const link = document.querySelector(`#gd-nav a[href="#${h}"]`), frame = document.getElementById('gd-frame');
        return !!link && frame.contentWindow.location.href === new URL(link.dataset.src, location.href).href;
      }, hash);
      return guide.frameLocator('#gd-frame');
    };
    for (const width of [1280, 390]) {
      await guide.setViewportSize({ width, height: 900 });
      for (const group of guideGroups) {
        const frame = await openGuide(group);
        await frame.locator('#root > *').first().waitFor();
        assert.equal(await guide.locator('bds-theme-toggle').count(), 1, `가이드 상단 테마 토글 ${group} @${width}`);
        assert.equal(await frame.locator('bds-theme-toggle').count(), 0, `삽입 카드 중복 테마 토글 ${group} @${width}`);
        assert.equal(await frame.locator('.bds-demo-label').count() > 0, true, `컴포넌트 라벨 ${group} @${width}`);
        const sectionSpacing = await frame.locator('#root').evaluate((root) => {
          const style = getComputedStyle(root);
          const children = [...root.children].filter((element) => element.matches('.bds-demo-section,.bds-demo-grid-2,.bds-demo-grid-3,.bds-demo-row'));
          return {
            display: style.display,
            expected: parseFloat(style.rowGap),
            actual: children.slice(1).map((element, index) => element.getBoundingClientRect().top - children[index].getBoundingClientRect().bottom),
          };
        });
        assert.equal(sectionSpacing.display, 'grid', `가이드 React 루트 배치 ${group} @${width}`);
        assert.equal(sectionSpacing.actual.every((gap) => gap + .5 >= sectionSpacing.expected), true, `가이드 카드 위아래 간격 ${group} @${width}: ${JSON.stringify(sectionSpacing)}`);
        if (group === 'navigation') {
          const fontRoles = await frame.locator('.bds-statusbar').evaluate((bar) => {
            const root = getComputedStyle(document.documentElement);
            const clean = (value) => value.replace(/["']/g, '').split(',').map((family) => family.trim()).join(',');
            return {
              bar: clean(getComputedStyle(bar).fontFamily),
              ui: clean(root.getPropertyValue('--font-ui')),
              data: clean(root.getPropertyValue('--font-data')),
              mono: [...bar.querySelectorAll('.bds-mono')].map((element) => clean(getComputedStyle(element).fontFamily)),
            };
          });
          assert.equal(fontRoles.bar, fontRoles.ui, `StatusBar 한글 UI 서체 @${width}`);
          assert.equal(fontRoles.mono.length > 0 && fontRoles.mono.every((family) => family === fontRoles.data), true, `StatusBar 수치 mono 서체 @${width}: ${JSON.stringify(fontRoles)}`);
        }
        const overflow = await frame.locator('body').evaluate(() => [...document.querySelectorAll('body *')]
          .filter((element) => !element.closest('.bds-sr'))
          .filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
          .filter((element) => {
            for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
              if (getComputedStyle(parent).overflowX !== 'visible') return false;
            }
            return true;
          })
          .slice(0, 8)
          .map((element) => `${element.tagName.toLowerCase()}.${element.className || ''}[${element.getAttribute('aria-label') || element.getAttribute('placeholder') || ''}] in .${element.parentElement?.className || ''}:${Math.round(element.getBoundingClientRect().right)}/${document.documentElement.clientWidth}`));
        assert.deepEqual(overflow, [], `가이드 카드 가로 넘침 ${group} @${width}`);
        const guideWidth = await frame.locator('body').evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, offenders: [...document.querySelectorAll('body *')]
          .filter((element) => !element.closest('.bds-sr') && element.getBoundingClientRect().right > document.documentElement.clientWidth + .1)
          .slice(0, 8).map((element) => `${element.tagName.toLowerCase()}.${element.className || ''}:${element.getBoundingClientRect().right.toFixed(2)}`) }));
        assert.equal(guideWidth.scroll <= guideWidth.client, true, `가이드 카드 문서 가로 스크롤 ${group} @${width}: ${JSON.stringify(guideWidth)}`);
        if (process.env.DS_TEST_SCREENSHOTS && width === 1280 && ['layout', 'navigation', 'input', 'data'].includes(group)) {
          fs.mkdirSync(process.env.DS_TEST_SCREENSHOTS, { recursive: true });
          await frame.locator('body').screenshot({ path: path.join(process.env.DS_TEST_SCREENSHOTS, `guide-${group}-${width}.png`) });
        }
      }
      for (const value of guideValues) {
        const frame = await openGuide(value);
        await frame.locator('body.bds-demo-page > *').first().waitFor();
        assert.equal(await guide.locator('bds-theme-toggle').count(), 1, `가이드 상단 테마 토글 ${value} @${width}`);
        assert.equal(await frame.locator('bds-theme-toggle').count(), 0, `삽입 값 카드 중복 테마 토글 ${value} @${width}`);
        const valueWidth = await frame.locator('body').evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
        assert.equal(valueWidth.scroll <= valueWidth.client, true, `값 카드 문서 가로 스크롤 ${value} @${width}: ${JSON.stringify(valueWidth)}`);
      }
      const template = await openGuide('template');
      await template.locator('[data-screen="overview"]').waitFor();
      assert.equal(await template.getByRole('button', { name: /(?:라이트|다크) 테마로/ }).count(), 0, `삽입 템플릿 중복 테마 토글 @${width}`);
      const outerDark = await guide.locator('bds-theme-toggle button').getAttribute('aria-pressed') === 'true';
      assert.equal(await template.locator('html').evaluate((html) => html.classList.contains('dark')), outerDark, `삽입 템플릿 테마 동기화 @${width}`);
      if (process.env.DS_TEST_SCREENSHOTS && width === 1280) {
        fs.mkdirSync(process.env.DS_TEST_SCREENSHOTS, { recursive: true });
        await template.locator('body').screenshot({ path: path.join(process.env.DS_TEST_SCREENSHOTS, `guide-template-${width}.png`) });
      }
    }
    assert.deepEqual(guideErrors, []);
    await guide.close();

    for (const touch of [false, true]) {
      const context = await browser.newContext({ hasTouch: touch, reducedMotion: 'reduce' });
      const visual = await context.newPage(); visual.on('pageerror', e => errors.push(e.message));
      for (const width of [1280, 834, 390]) for (const dark of [false, true]) for (const density of ['default', 'compact']) {
        await visual.setViewportSize({ width, height: 1000 }); await visual.goto(`http://127.0.0.1:${server.address().port}`);
        await visual.evaluate(({ dark, density }) => { document.documentElement.classList.toggle('dark', dark); if (density === 'compact') document.documentElement.dataset.density = density; else delete document.documentElement.dataset.density; demo('visuals'); }, { dark, density });
        await visual.waitForSelector('[role=combobox]');
        assert.equal(await visual.locator('[role=combobox]').getAttribute('aria-required'), 'true');
        assert.equal(await visual.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-ctl').trim()), touch ? '44px' : density === 'compact' ? '28px' : '32px');
        const selectAlignment = await visual.locator('select').evaluate((select) => ({ clientHeight: select.clientHeight, lineHeight: parseFloat(getComputedStyle(select).lineHeight) }));
        assert.equal(Math.abs(selectAlignment.clientHeight - selectAlignment.lineHeight) < 1, true, `Select 선택값 세로 중앙 ${density} ${touch ? 'touch' : 'pointer'} @${width}: ${JSON.stringify(selectAlignment)}`);
        assert.equal(await visual.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert((await visual.locator('.bds-uptime__pct').innerText()).startsWith('100'));
        if (process.env.DS_TEST_SCREENSHOTS && density === 'default') { fs.mkdirSync(process.env.DS_TEST_SCREENSHOTS, { recursive: true }); await visual.screenshot({ path: path.join(process.env.DS_TEST_SCREENSHOTS, `${width}-${dark ? 'dark' : 'light'}-${touch ? 'touch' : 'pointer'}.png`) }); }
      }
      await context.close();
    }
    // Dashboard template gate (templates/dashboard/Dashboard.dc.html).
    // Coverage: all 7 routes at 1280 and 390, only 3 representative routes at 834 (it shares the <1024 drawer path
    // with 390, so the full set only adds run time). One document load per width; routes switch via hash (App
    // subscribes to hashchange). `status` is a public page without the shell, so it is matched by data-screen instead of the shell title.
    const TITLES = { overview: '개요', nodes: '노드', devices: '장치', deploys: '배포', access: '접근', settings: '설정' };
    const ROUTES = [...Object.keys(TITLES), 'status'];
    const mounted = ([route, title]) => {
      const screen = document.querySelector(`[data-screen="${route}"]`);
      if (!screen || !screen.querySelector('.bds-pagehead h2')) return false;
      return title ? document.querySelector('.bds-shell__top h1')?.textContent === title : !!document.querySelector('.bds-topnav');
    };
    const dashContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    const dash = await dashContext.newPage();
    dash.setDefaultTimeout(20000);
    const dashErrors = [];
    dash.on('pageerror', e => dashErrors.push(`pageerror: ${e.message}`));
    dash.on('console', m => { if (m.type() === 'error') dashErrors.push(`console: ${m.text()}`); });
    const url = `http://127.0.0.1:${server.address().port}/templates/dashboard/Dashboard.dc.html`;
    for (const [width, routes] of [[1280, ROUTES], [834, ['overview', 'devices', 'settings']], [390, ROUTES]]) {
      await dash.setViewportSize({ width, height: 900 });
      await dash.goto(`${url}#${routes[0]}`);
      for (const route of routes) {
        await dash.evaluate(r => { window.location.hash = '#' + r; }, route);
        // Shell title plus the screen's PageHeader together prove App and the x-import screen really mounted.
        await dash.waitForFunction(mounted, [route, TITLES[route] ?? null]);
        assert.deepEqual(dashErrors, [], `${route} @${width}`);
        const dashOverflow = await dash.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth ? [] : [...document.querySelectorAll('body *')]
          .filter((element) => !element.closest('.bds-sr'))
          .filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
          .slice(0, 8)
          .map((element) => `${element.tagName.toLowerCase()}.${element.className || ''}:${Math.round(element.getBoundingClientRect().right)}/${document.documentElement.clientWidth}`));
        assert.deepEqual(dashOverflow, [], `가로 넘침 ${route} @${width}`);
        assert.equal(await dash.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, `문서 가로 스크롤 ${route} @${width}`);
      }
      // Screen modules get hooks through the window.DS proxy; a mount-only check passes even if that delegation
      // breaks, so trigger a real toast once. Width-independent, hence 1280 only.
      if (width === 1280) {
        await dash.evaluate(() => { window.location.hash = '#devices'; });
        await dash.waitForFunction(mounted, ['devices', TITLES.devices]);
        await dash.getByRole('button', { name: '적용', exact: true }).click();
        await dash.getByRole('status').filter({ hasText: '두 장치에 적용했습니다.' }).waitFor();
      }
      // >=1024 fixed rail, below that hamburger -> drawer. Measured on a shell screen only.
      await dash.evaluate(() => { window.location.hash = '#overview'; });
      await dash.waitForFunction(mounted, ['overview', TITLES.overview]);
      const rail = dash.locator('.bds-shell__side'), burger = dash.locator('.bds-shell__burger');
      assert.equal(await rail.isVisible(), width >= 1024, `레일 표시 @${width}`);
      assert.equal(await burger.isVisible(), width < 1024, `햄버거 표시 @${width}`);
      if (width < 1024) {
        await burger.click(); await rail.waitFor({ state: 'visible' });
        assert.equal(await dash.locator('.bds-shell__dim').isVisible(), true, `드로어 딤 @${width}`);
        await dash.keyboard.press('Escape'); await rail.waitFor({ state: 'hidden' });
      }
    }
    await dashContext.close();
    assert.deepEqual(dashErrors, []);

    // Touch floor, measured. See RULE.md "VISUAL FOUNDATIONS" (간격·밀도): static CSS checks cannot see what flex
    // actually shrank, so real bounding boxes are measured under a coarse pointer.
    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
    const touchPage = await touchContext.newPage();
    touchPage.setDefaultTimeout(20000);
    for (const route of ROUTES) {
      await touchPage.goto(`${url}#${route}`);
      await touchPage.waitForFunction(mounted, [route, TITLES[route] ?? null]);
      const small = await touchPage.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        const floor = parseFloat(root.getPropertyValue('--h-touch'));
        const out = [], name = (el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`;
        const exposed = [];
        // .bds-ctl is the input's shell and the real target, so it is measured; native inputs inside it,
        // and visually hidden inputs wrapped in a label, are not (the shell/label is the target).
        for (const el of document.querySelectorAll('button,a[href],input,select,textarea,[role="button"],summary,.bds-ctl')) {
          const box = el.getBoundingClientRect();
          if (!box.width || !box.height) continue;                    // hidden elements are not targets
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
          if (el.closest('[hidden],[aria-hidden="true"]')) continue;
          const native = ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
          if (native && (el.closest('.bds-ctl') || el.closest('label'))) continue;
          exposed.push([el, box, cs]);
        }
        for (const [el, box, cs] of exposed) {
          // Declared floor must survive layout; a fixed-size box fails here.
          const minW = parseFloat(cs.minWidth) || 0, minH = parseFloat(cs.minHeight) || 0;
          if (box.width + 0.5 < minW || box.height + 0.5 < minH) out.push(`${name(el)} ${Math.round(box.width)}x${Math.round(box.height)} < min ${minW}x${minH}`);
          // No target is drawn below 24px.
          if (box.width < 23.5 || box.height < 23.5) out.push(`${name(el)} ${Math.round(box.width)}x${Math.round(box.height)} < 24`);
        }
        // Square icon buttons fill the touch floor on both axes.
        for (const [el, box] of exposed) {
          if (!el.classList.contains('bds-iconbtn') || el.classList.contains('bds-iconbtn--sm')) continue;
          if (box.width + 0.5 < floor || box.height + 0.5 < floor) out.push(`${name(el)} ${Math.round(box.width)}x${Math.round(box.height)} < h-touch ${floor}`);
        }
        return out;
      });
      assert.deepEqual(small, [], `coarse pointer 최소 조작 영역 미달 @${route}`);
    }
    await touchContext.close();

    assert.deepEqual(errors, []);
    console.log('PASS: overlay lifecycle, menu clipping/top layer/keyboard, input editing, 46 guide page/width combinations, 24 responsive/theme/density/pointer combinations, dashboard 17 route/width combinations, coarse pointer 조작 영역');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
