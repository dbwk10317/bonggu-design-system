const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const deps = process.env.DS_TEST_NODE_MODULES ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__browser-tests.cjs')) : require;
// @babel/standalone 안의 debug가 로드 시 bare localStorage를 읽어 Node가 ExperimentalWarning을 내므로 Babel을 읽기 전에 불활성 스텁으로 가린다.
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
// templates/dashboard/support.js는 dc-runtime 생성물이라 직접 고칠 수 없고, unpkg CDN URL과 SRI 해시를
// 코드에 박아 둔다. 게이트가 네트워크에 의존하면 안 되므로 응답 본문에서만 그 URL을 이 서버가 서브하는
// 로컬 경로로 바꾸고, 로컬 파일(개발 빌드/다른 babel 버전)이 SRI 불일치로 막히지 않게 integrity 값을 비운다.
const CDN_LOCAL = {
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js': '/test-react.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js': '/test-react-dom.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js': '/test-babel.js',
};
const rewriteSupport = (src) => Object.entries(CDN_LOCAL)
  .reduce((s, [from, to]) => s.split(from).join(to), src)
  .replace(/"sha384-[^"]*"/g, '""')
  // 로컬 @babel/standalone은 8.x라 preset-react 기본값이 automatic runtime이다. 그러면 x-import가
  // new Function으로 실행하는 코드에 import 문이 섞여 터진다. 템플릿이 고정한 7.29와 같게 classic으로 되돌린다.
  .replace('presets: ["react", "typescript"]', 'presets: [["react", { runtime: "classic" }], "typescript"]');
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost').pathname;
  // 브라우저가 자동으로 요청한다. 404로 두면 콘솔 오류가 남아 실제 오류와 섞인다.
  if (url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  const file = url === '/' ? path.join(__dirname, 'fixtures/regressions.html')
    : localScripts[url] ?? path.resolve(root, '.' + url);
  if (!file.startsWith(root + path.sep) && !Object.values(localScripts).includes(file)) { res.writeHead(403); res.end(); return; }
  try {
    const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
    const body = url === '/templates/dashboard/support.js' ? rewriteSupport(fs.readFileSync(file, 'utf8')) : fs.readFileSync(file);
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

    for (const touch of [false, true]) {
      const context = await browser.newContext({ hasTouch: touch, reducedMotion: 'reduce' });
      const visual = await context.newPage(); visual.on('pageerror', e => errors.push(e.message));
      for (const width of [1280, 834, 390]) for (const dark of [false, true]) {
        await visual.setViewportSize({ width, height: 1000 }); await visual.goto(`http://127.0.0.1:${server.address().port}`);
        await visual.evaluate(dark => { document.documentElement.classList.toggle('dark', dark); document.documentElement.dataset.density = 'compact'; demo('visuals'); }, dark);
        await visual.waitForSelector('[role=combobox]');
        assert.equal(await visual.locator('[role=combobox]').getAttribute('aria-required'), 'true');
        assert.equal(await visual.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-ctl').trim()), touch ? '44px' : '28px');
        assert.equal(await visual.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert((await visual.locator('.bds-uptime__pct').innerText()).startsWith('100'));
        if (process.env.DS_TEST_SCREENSHOTS) { fs.mkdirSync(process.env.DS_TEST_SCREENSHOTS, { recursive: true }); await visual.screenshot({ path: path.join(process.env.DS_TEST_SCREENSHOTS, `${width}-${dark ? 'dark' : 'light'}-${touch ? 'touch' : 'pointer'}.png`) }); }
      }
      await context.close();
    }
    // 실제 대시보드 템플릿(templates/dashboard/Dashboard.dc.html) 게이트.
    // 커버리지: 라우트 7개 × 1280·390 전수 + 834에서는 대표 3개(overview·devices·settings)만.
    // 834는 1024 미만 드로어 경로를 390과 공유하므로 전수로 돌릴 이득이 적고 실행 시간만 늘어난다.
    // 폭당 문서 로드는 1회고 라우트 전환은 hash로 한다(App이 hashchange를 구독한다).
    // status는 공개 상태 페이지라 셸 없이 TopNav로 선다. 셸 제목 대신 data-screen 표식으로 확인한다.
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
        // 셸 상단바 제목 + 화면의 PageHeader가 함께 보이면 App과 해당 x-import 화면이 실제로 마운트된 것이다.
        await dash.waitForFunction(mounted, [route, TITLES[route] ?? null]);
        assert.deepEqual(dashErrors, [], `${route} @${width}`);
        assert.equal(await dash.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, `가로 넘침 ${route} @${width}`);
      }
      // 1024 이상은 고정 레일, 미만은 햄버거 → 드로어. 셸이 있는 화면에서만 잰다.
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

    // 터치 하한 실측. readme의 최소 조작 영역은 높이와 너비 양쪽이고, 정적 CSS 검사로는
    // flex가 실제로 줄여 놓은 결과를 볼 수 없다. coarse pointer로 실제 bounding box를 잰다.
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
        // .bds-ctl은 입력의 껍데기이자 실제 조작 대상이므로 함께 잰다. 그 안의 native input,
        // 그리고 label로 감싼 시각적으로 숨긴 input은 껍데기·라벨이 대상이라 세지 않는다.
        for (const el of document.querySelectorAll('button,a[href],input,select,textarea,[role="button"],summary,.bds-ctl')) {
          const box = el.getBoundingClientRect();
          if (!box.width || !box.height) continue;                    // 숨겨진 것은 조작 대상이 아니다
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
          if (el.closest('[hidden],[aria-hidden="true"]')) continue;
          const native = ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
          if (native && (el.closest('.bds-ctl') || el.closest('label'))) continue;
          exposed.push([el, box, cs]);
        }
        for (const [el, box, cs] of exposed) {
          // 선언한 하한이 배치에 의해 깎이지 않았는가. 크기를 고정 상자로 주면 여기서 걸린다.
          const minW = parseFloat(cs.minWidth) || 0, minH = parseFloat(cs.minHeight) || 0;
          if (box.width + 0.5 < minW || box.height + 0.5 < minH) out.push(`${name(el)} ${Math.round(box.width)}x${Math.round(box.height)} < min ${minW}x${minH}`);
          // 어떤 조작 대상도 24px 미만으로 그리지 않는다.
          if (box.width < 23.5 || box.height < 23.5) out.push(`${name(el)} ${Math.round(box.width)}x${Math.round(box.height)} < 24`);
        }
        // 정사각 아이콘 버튼은 터치에서 정본 하한을 양쪽으로 채운다.
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
    console.log('PASS: overlay lifecycle, menu clipping/top layer/keyboard, input editing, 12 responsive/theme/pointer combinations, dashboard 17 route/width combinations, coarse pointer 조작 영역');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
