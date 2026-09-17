const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const visualizationCases = [
  { name: 'Timeline', props: { items: [{ time: '09. 17. 12:24:22', title: '프로젝트 A 임베딩 모델', detail: '모델 활성화' }, { time: '2026-09-17T12:24:22+09:00', title: 'very-long-model-identifier-without-spaces', detail: '운영변경설명이길어도다음사건을침범하지않습니다' }] } },
  { name: 'StateTimeline', props: { rows: [{ id: 'api', label: '인증 서비스', intervals: [{ id: 'ok', start: 0, end: 60, label: '정상', status: 'ok' }, { id: 'warn', start: 50, end: 80, label: '응답 지연', status: 'warn' }, { id: 'off', start: 80, end: 100, label: '수집 지연', status: 'off' }] }, { id: 'db', label: '데이터베이스', intervals: [{ id: 'ok', start: 0, end: 100, label: '정상', status: 'ok' }] }] } },
  ...['line', 'area', 'bar'].map(kind => ({ name: 'Chart', kind, props: { kind, labels: ['2026-09-17 00:00', '2026-09-17 06:00', '2026-09-17 12:00', '2026-09-17 18:00'], series: [{ label: '수신 처리량', values: [20, 50, 30, 70] }, { label: '송신 처리량', values: [10, 30, 20, 50] }] } })),
  { name: 'Chart', kind: 'pie', props: { kind: 'pie', segments: [{ label: '사용 중인 저장 공간', value: 1234567 }, { label: '예약 공간', value: 345678 }, { label: '수집 지연', value: null }], caption: '전체 저장 공간' } },
  { name: 'Chart', kind: 'radial', props: { kind: 'radial', value: .625, label: '메모리 사용률' } },
  { name: 'Chart', kind: 'radar', props: { kind: 'radar', axes: ['CPU', '메모리', '디스크', '네트워크', '디스플레이'], series: [{ label: '현재', values: [38, 54, 41, 62, 71] }], max: 100 } },
  { name: 'Chart', kind: 'histogram', props: { kind: 'histogram', samples: Array.from({ length: 100 }, (_, i) => 100 + (i * 37) % 300), percentiles: [.5, .95, .99], unit: 'ms' } },
  { name: 'Gauge', props: { value: .625, label: '메모리 사용률', ticks: true } },
  { name: 'Heatmap', props: { rows: ['월', '화', '수', '목', '금', '토', '일'], cols: Array.from({ length: 24 }, (_, i) => String(i)), values: Array.from({ length: 7 }, (_, i) => Array.from({ length: 24 }, (_, j) => i + j)) } },
  { name: 'BarList', props: { items: [{ name: 'gpu-inference-primary', value: 1234567890 }, { name: '데이터 저장 볼륨', value: 98765432 }] } },
  { name: 'UptimeBar', props: { name: '가용성', segments: Array.from({ length: 90 }, (_, i) => ({ status: i % 15 ? 'ok' : 'warn' })), start: '90일 전', end: '현재' } },
  { name: 'Sparkline', props: { values: [1, 4, 3, 5, 2, 7, 4, 8, 6] } },
];

// This runs inside rule-regressions too, so a newly registered graphic/kind cannot silently skip the size gate.
function assertVisualizationCoverage() {
  const root = path.resolve(__dirname, '..');
  const files = fs.readdirSync(path.join(root, 'components/data')).filter(name => name.endsWith('.d.ts'));
  const names = files.filter(name => fs.readFileSync(path.join(root, 'components/data', name), 'utf8').includes('@visualization')).map(name => name.replace('.d.ts', '')).sort();
  assert.deepEqual([...new Set(visualizationCases.map(c => c.name))].sort(), names, '시각화 등록과 크기 검증 fixture가 일치해야 합니다');
  const chart = fs.readFileSync(path.join(root, 'components/data/Chart.d.ts'), 'utf8');
  const kinds = [...chart.matchAll(/kind:\s*([^;]+);/g)].flatMap(m => [...m[1].matchAll(/"(\w+)"/g)].map(v => v[1])).sort();
  assert.deepEqual(visualizationCases.filter(c => c.name === 'Chart').map(c => c.kind).sort(), kinds, '모든 차트 종류에 크기 검증이 필요합니다');
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    // ResizeObserver and React commits cross frame boundaries; wait for a stable layout, not a timed delay.
    let previous = '', stable = 0;
    for (let i = 0; i < 30 && stable < 3; i++) {
      await document.fonts.ready;
      await new Promise(requestAnimationFrame);
      const nodes = document.querySelectorAll('#app, #app svg, #app svg text, #app .bds-plot-value, #app .bds-chart__tip');
      const next = [...nodes].map(el => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height, el.getAttribute('viewBox'), el.getAttribute('style')].join(); }).join('|');
      stable = next === previous ? stable + 1 : 0; previous = next;
    }
    if (stable < 3) throw new Error('시각화 크기가 안정되지 않습니다');
  });
}

async function assertVisualizations(page, url) {
  assertVisualizationCoverage();
  await page.goto(url);
  await page.waitForFunction(() => window.mount && window.Ds_d3ea90.Chart);
  let count = 0;
  for (const sample of visualizationCases) {
    for (const dark of [false, true]) {
      // Reuse the mounted instance, including shrink after grow.
      for (const [width, height] of [[120, 80], [180, 120], [320, 120], [640, 240], [240, 80], [180, 240]]) {
        const label = `${sample.name}/${sample.kind ?? ''} ${width}×${height} ${dark ? 'dark' : 'light'}`;
        await page.evaluate(({ sample, dark, width, height }) => {
          document.documentElement.classList.toggle('dark', dark);
          const host = document.getElementById('app'); host.style.width = `${width}px`; host.style.height = sample.name === 'Sparkline' ? `${height}px` : '';
          const props = { ...sample.props, animate: false };
          if (sample.name === 'Chart' || sample.name === 'StateTimeline') props.height = height;
          if (sample.name === 'Gauge') Object.assign(props, { fit: 'fixed', width, height });
          ReactDOM.flushSync(() => mount(sample.name, props));
        }, { sample, dark, width, height });
        await settle(page).catch(error => { throw new Error(`${label}: ${error.message}`); });
        const issues = await page.evaluate(() => {
          const host = document.getElementById('app'), problems = [];
          if (host.scrollWidth > host.clientWidth + 1) problems.push(`외부 가로 넘침 ${host.scrollWidth}/${host.clientWidth}`);
          for (const svg of host.querySelectorAll('.bds-chart__svg,.bds-state-timeline__svg')) {
            const box = svg.getBoundingClientRect(), texts = [...svg.querySelectorAll('text')].filter(e => e.textContent);
            for (const text of texts) {
              const r = text.getBoundingClientRect();
              if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1) problems.push(`축 영역 밖: ${text.textContent} (${r.left-box.left},${r.top-box.top},${r.width},${r.height})/${box.width},${box.height}`);
            }
            for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
              const a = texts[i].getBoundingClientRect(), b = texts[j].getBoundingClientRect();
              if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) problems.push(`글자 겹침: ${texts[i].textContent}/${texts[j].textContent}`);
            }
            const m = svg.getScreenCTM();
            if (Math.abs(m.a - 1) > .02 || Math.abs(m.d - 1) > .02) problems.push('SVG 확대가 글자 크기를 바꿉니다');
          }
          for (const value of host.querySelectorAll('.bds-plot-value')) {
            const b = value.querySelector('b'), style = getComputedStyle(b), font = parseFloat(style.fontSize);
            // Resolve token bounds through the same browser CSS engine, independently of layout helpers.
            const probe = document.createElement('span'); probe.style.setProperty('transition', 'none', 'important'); host.append(probe);
            probe.style.fontSize = 'var(--fs-subheading)'; const min = parseFloat(getComputedStyle(probe).fontSize);
            probe.style.fontSize = 'var(--fs-title)'; const max = parseFloat(getComputedStyle(probe).fontSize); probe.remove();
            if (font < min - .1 || font > max + .1) problems.push(`대표값 글자 크기 ${font}`);
            if (value.classList.contains('bds-plot-value--inside')) {
              const box = value.getBoundingClientRect();
              for (const child of value.children) {
                const range = document.createRange(); range.selectNodeContents(child); const r = range.getBoundingClientRect();
                if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1) problems.push('중앙값이 도형 안전 영역을 벗어납니다');
              }
            }
          }
          for (const row of host.querySelectorAll('.bds-tl')) {
            const time = row.querySelector('.bds-tl__time'), dot = row.querySelector('.bds-tl__dot'), body = row.querySelector('.bds-tl__body');
            const ranges = [time, body].map(el => { const range = document.createRange(); range.selectNodeContents(el); return range.getBoundingClientRect(); });
            if (ranges[0].right > dot.getBoundingClientRect().left || ranges[1].left < dot.getBoundingClientRect().right) problems.push('시간·사건 표시·본문이 겹칩니다');
            if (ranges.some(r => r.bottom > row.getBoundingClientRect().bottom + 1)) problems.push('사건 글자가 다음 행을 침범합니다');
          }
          const gauge = host.querySelector('.bds-gauge');
          if (gauge && gauge.getBoundingClientRect().height > parseFloat(gauge.style.height) + 1) problems.push('Gauge가 지정 높이를 지키지 않습니다');
          return problems;
        });
        assert.deepEqual(issues, [], `${label}: ${issues.join(', ')}`);
        count++;
      }
    }
  }
  // Unbounded gauges in real cards must not acquire scrollbars, including at fractional widths and zoom.
  for (const zoom of [.875, 1, 1.25, 2]) for (const width of [116, 129.671875, 240]) for (const value of [null, .035, .625]) for (const label of ['정상', '수집 상태와 메모리 사용률']) {
    await page.evaluate(({ zoom, width, value, label }) => {
      const host = document.getElementById('app'); host.style.width = `${width}px`; host.style.zoom = zoom;
      ReactDOM.flushSync(() => mount('Gauge', { value, label, ticks: true }));
    }, { zoom, width, value, label });
    await settle(page);
    assert.deepEqual(await page.evaluate(() => {
      const g = document.querySelector('.bds-gauge'), box = g.getBoundingClientRect(), issues = [];
      if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(g).overflow)) issues.push('자연 높이 게이지가 내용을 스크롤하거나 가립니다');
      if (g.scrollWidth > g.clientWidth + 1 || g.scrollHeight > g.clientHeight + 1) issues.push('게이지 내용이 넘칩니다');
      for (const el of g.querySelectorAll('.bds-plot-value b,.bds-plot-value>span,.bds-gauge__ticks span')) {
        const range = document.createRange(); range.selectNodeContents(el); const r = range.getBoundingClientRect();
        if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1) issues.push('게이지 읽을거리가 경계를 벗어납니다');
      }
      return issues;
    }), [], `자연 높이 Gauge ${width}/${zoom}/${value}`);
  }
  await page.evaluate(() => document.getElementById('app').style.zoom = '');
  // Empty-to-collected data must start measurement without a forced remount.
  for (const kind of ['line', 'pie', 'histogram']) {
    await page.evaluate(kind => ReactDOM.flushSync(() => mount('Chart', { kind, labels: [], series: [], segments: [], samples: [], animate: false })), kind);
    await settle(page);
    await page.evaluate(sample => ReactDOM.flushSync(() => mount('Chart', { ...sample.props, animate: false })), visualizationCases.find(c => c.kind === kind));
    await settle(page);
    assert(await page.locator('.bds-chart__svg').count(), `${kind}: 빈 상태 뒤 그래픽이 렌더됩니다`);
  }
  // Keyboard-selected readout must fit after both data and font changes.
  for (const width of [120, 180, 320]) {
    await page.evaluate(width => {
      document.getElementById('app').style.width = `${width}px`; document.getElementById('app').style.height = '';
      ReactDOM.flushSync(() => mount('Chart', { kind: 'line', height: 120, animate: false, labels: ['00:00', '06:00', '12:00', '18:00'], series: [{ label: '긴이름의수신처리량', values: [20, 50, 30, 70] }, { label: '송신', values: [10, 30, 20, 50] }], valueFormatter: v => `${v} Mb/s` }));
    }, width);
    await settle(page); await page.locator('.bds-chart__stage').focus();
    for (const key of ['Home', 'ArrowRight', 'End']) {
      await page.keyboard.press(key); await settle(page);
      assert(await page.evaluate(() => { const tip = document.querySelector('.bds-chart__tip').getBoundingClientRect(), box = document.querySelector('.bds-chart__stage').getBoundingClientRect(); return tip.left >= box.left - 1 && tip.right <= box.right + 1 && tip.top >= box.top - 1 && tip.bottom <= box.bottom + 1; }), `툴팁 경계 ${width}/${key}`);
    }
    await page.evaluate(() => document.getElementById('app').style.setProperty('--fs-micro', '1rem'));
    await settle(page);
    assert(await page.evaluate(() => { const tip = document.querySelector('.bds-chart__tip').getBoundingClientRect(), box = document.querySelector('.bds-chart__stage').getBoundingClientRect(); return tip.left >= box.left - 1 && tip.right <= box.right + 1; }), '폰트 변경 뒤 툴팁 경계');
    await page.evaluate(() => document.getElementById('app').style.removeProperty('--fs-micro'));
  }
  await page.evaluate(() => { ReactDOM.flushSync(() => mount('Heatmap', { rows: ['월'], cols: Array.from({ length: 24 }, (_, i) => String(i)), values: [Array.from({ length: 24 }, (_, i) => i)] })); });
  await settle(page); await page.locator('.bds-heat__scroll').focus(); await page.keyboard.press('End'); await settle(page);
  assert(await page.evaluate(() => { const a = document.querySelector('.bds-heat__cell--on').getBoundingClientRect(), b = document.querySelector('.bds-heat__scroll').getBoundingClientRect(); return a.left >= b.left - 1 && a.right <= b.right + 1; }), '히트맵 선택 셀이 스크롤 안에 보입니다');
  const colors = await page.locator('.bds-heat__scale i').evaluateAll(nodes => nodes.map(el => getComputedStyle(el).backgroundColor));
  assert.equal(new Set(colors).size, 6, '히트맵 범례가 여섯 색 단계를 보여줍니다');
  assert(!colors.includes('rgba(0, 0, 0, 0)'), '히트맵 범례는 투명하지 않습니다');
  console.log(`PASS visualization regressions: ${count} 크기·테마 조합, 글자 경계·충돌·안전 영역, 리사이즈·폰트·툴팁·히트맵 탐색`);
}
module.exports = { assertVisualizationCoverage, assertVisualizations, settle };
