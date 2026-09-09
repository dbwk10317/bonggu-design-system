const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const deps = process.env.DS_TEST_NODE_MODULES ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__browser-tests.cjs')) : require;
const { chromium } = deps('playwright');
const root = path.resolve(__dirname, '..');
const reactDir = path.dirname(deps.resolve('react/package.json'));
const reactDomDir = path.dirname(deps.resolve('react-dom/package.json'));
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost').pathname;
  const file = url === '/' ? path.join(__dirname, 'fixtures/regressions.html')
    : url === '/test-react.js' ? path.join(reactDir, 'umd/react.development.js')
    : url === '/test-react-dom.js' ? path.join(reactDomDir, 'umd/react-dom.development.js') : path.resolve(root, '.' + url);
  if (!file.startsWith(root + path.sep) && ![path.join(reactDir, 'umd/react.development.js'), path.join(reactDomDir, 'umd/react-dom.development.js')].includes(file)) { res.writeHead(403); res.end(); return; }
  try {
    const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
    res.setHeader('Content-Type', type); res.end(fs.readFileSync(file));
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
    assert.deepEqual(errors, []);
    console.log('PASS: overlay lifecycle, menu clipping/top layer/keyboard, input editing, 12 responsive/theme/pointer combinations');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
