// Missing-value ("수집 안 됨") contract. See RULE.md "동작 계약" (데이터와 결측) and "CONTENT FUNDAMENTALS (카피)".
// Regressions guarded: DataTable hiding null as an empty cell; marker string and class diverging per component.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { sourceModule, dependencyRequire, root } = require('./source-modules.cjs');
const React = dependencyRequire('react');
const { renderToStaticMarkup } = dependencyRequire('react-dom/server');
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));

const { MISSING_TEXT, MISSING_CLASS, isMissing } = sourceModule('components/core/missing.js');

// 1. Boundary of the predicate: values vs missing.
for (const missing of [null, undefined, NaN, MISSING_TEXT]) assert(isMissing(missing), `${String(missing)}은 결측`);
for (const value of ['', 0, false, '0', -1, 'ok', {}, []]) assert(!isMissing(value), `${JSON.stringify(value)}은 값`);

// 2. DataTable: null in a column without render is missing, not blank (the old `?? ""` hid it).
const { DataTable } = sourceModule('components/data/DataTable.jsx');
const columns = [{ key: 'name', header: '이름' }, { key: 'cpu', header: 'CPU', align: 'num' }, { key: 'note', header: '비고' }];
const table = render(DataTable, { columns, rows: [{ name: 'monitoring-api', cpu: null, note: '' }] });
const cells = [...table.matchAll(/<td([^>]*)>([^<]*)</g)].map(([, attrs, text]) => ({ attrs, text }));
assert.equal(cells[1].text, MISSING_TEXT, 'null 셀은 빈 칸이 아니라 결측 문구');
assert(cells[1].attrs.includes(MISSING_CLASS), '결측 셀에 공통 클래스');
assert.equal(cells[2].text, '', '빈 문자열은 수집된 빈 값이므로 그대로 빈 칸');
assert(!cells[2].attrs.includes(MISSING_CLASS), '빈 문자열에는 결측 클래스를 붙이지 않는다');
assert(!cells[0].attrs.includes(MISSING_CLASS) && cells[0].text === 'monitoring-api', '정상 값은 그대로');
assert(!/class="(?:[^"]*\s)?na(?:\s[^"]*)?"/.test(table), '네임스페이스 밖 .na 클래스는 남지 않는다');

// 3. DataTable: a render column returns a ReactNode; null means "render nothing" per React, not missing
//    (revoked token rows in templates/dashboard/SettingsScreen.jsx have no button).
const rendered = render(DataTable, {
  columns: [{ key: 'act', header: '', render: (r) => (r.revoked ? null : 'X') }, { key: 'v', header: '값', render: (r) => r.v }],
  rows: [{ revoked: true, v: MISSING_TEXT }],
});
const renderedCells = [...rendered.matchAll(/<td([^>]*)>([^<]*)</g)].map(([, attrs, text]) => ({ attrs, text }));
assert.equal(renderedCells[0].text, '', 'render()가 돌려준 null은 빈 칸으로 남는다');
assert(!renderedCells[0].attrs.includes(MISSING_CLASS), 'render()의 null에는 결측 표기를 붙이지 않는다');
assert(renderedCells[1].attrs.includes(MISSING_CLASS), '문구로 포맷해 넘기는 기존 사용처는 계속 결측으로 인식한다');

// 4. Same marker string in every component, styled by the shared class rather than inline style.
const { BarList } = sourceModule('components/data/BarList.jsx');
const { KeyValues } = sourceModule('components/data/KeyValues.jsx');
const { Heatmap } = sourceModule('components/data/Heatmap.jsx');
const { Gauge } = sourceModule('components/data/Gauge.jsx');
const { TrendDelta } = sourceModule('components/data/TrendDelta.jsx');
const { UptimeBar } = sourceModule('components/data/UptimeBar.jsx');
const { StatTile } = sourceModule('components/data/StatTile.jsx');
const { Cartesian } = sourceModule('components/data/Chart.jsx');
const marks = [
  ['BarList', render(BarList, { items: [{ name: 'nvme0n1', value: null }] }), true],
  ['KeyValues', render(KeyValues, { rows: [['실행 중', null]] }), true],
  ['Heatmap', render(Heatmap, { rows: ['월'], cols: ['00'], values: [[null]] }), false], // marker text only in the hidden table
  ['Gauge', render(Gauge, { value: null }), false], // SVG text: the .bds-gauge--off rule handles the marker
  ['TrendDelta', render(TrendDelta, { value: null }), true],
  ['UptimeBar', render(UptimeBar, { name: 'svc', segments: [{ status: 'off' }] }), true],
  ['StatTile', render(StatTile, { label: '요청', value: null, unit: '건' }), true],
  ['DataTable', table, true],
  ['Chart', render(Cartesian, { kind: 'line', w: 300, h: 260, fmt: String, uid: 't', hover: 1, setHover() {}, labels: ['x', 'y', 'z'], series: [{ label: 'a', values: [80, null, 60] }] }), true],
];
for (const [name, html, classed] of marks) {
  assert(html.includes(MISSING_TEXT), `${name}이 공통 표기 문자열을 쓴다`);
  assert.equal(html.includes(MISSING_CLASS), classed, `${name}의 공통 클래스 사용 여부`);
  // Fails if the removed inline copy-paste (font-family:var(--font-ui) / color:var(--ink-3)) comes back. Chart geometry styles like stop-color are out of scope.
  assert(!/style="[^"]*(?:font-family:|(?:^|[;"])\s*color:)/.test(html), `${name}은 결측 표기를 인라인 style로 그리지 않는다`);
}
assert(!render(StatTile, { label: '요청', value: null, unit: '건' }).includes('건'), '결측에는 단위를 붙이지 않는다');
assert(render(StatTile, { label: '요청', value: 0 }).includes('>0<'), '0은 값이므로 그대로 표시');
assert(render(BarList, { items: [{ name: 'nvme0n1', value: 0 }] }).includes('>0<'), 'BarList의 0도 값');

// 5. The marker string and class are declared only in core/missing.js and one CSS block.
const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.jsx?$/.test(entry.name)) files.push(p);
  }
})(path.join(root, 'components'));
const declaring = files.filter((p) => !p.endsWith(`${path.sep}missing.js`) && new RegExp(`=\\s*"${MISSING_TEXT}"`).test(fs.readFileSync(p, 'utf8')));
assert.deepEqual(declaring, [], '표기 문자열을 다시 선언하는 컴포넌트가 없다');
const stylesheets = fs.readdirSync(path.join(root, 'styles')).filter((f) => f.endsWith('.css'));
const css = fs.readFileSync(path.join(root, 'styles', 'c-data.css'), 'utf8');
const blocks = stylesheets.flatMap((f) => (fs.readFileSync(path.join(root, 'styles', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').match(/[^{}]+\{[^}]*\}/g) || []))
  .filter((b) => new RegExp(`\\.${MISSING_CLASS}\\b`).test(b.split('{')[0]));
assert.equal(blocks.length, 1, `표기 클래스 선언 블록은 하나 (실제: ${blocks.length})`);
assert(/\.bds-na[^{]*\{[^}]*var\(--font-ui\)[^}]*var\(--ink-3\)/.test(css), '결측 표기는 mono를 벗고 --ink-3');
for (const dead of ['bds-barlist__v--na', 'bds-kv__v--na', 'td.na{']) {
  assert(!files.some((p) => fs.readFileSync(p, 'utf8').includes(dead)) && !css.includes(dead), `죽은 클래스 ${dead} 제거`);
}

// 6. The predicate also applies to math. Regression: one NaN turned every chart coordinate into NaN via the axis range.
//    fit="fixed" gives a width, so geometry is drawn in server render and SVG attributes can be inspected directly.
const { Chart } = sourceModule('components/data/Chart.jsx');
const { Sparkline } = sourceModule('components/data/Sparkline.jsx');
const fixed = { fit: 'fixed', width: 400, height: 240, 'aria-label': '검사' };
const labels7 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const dirty = [1, NaN, 2, undefined, 3, Infinity, 4];
const dirtyCharts = {
  line: { kind: 'line', labels: labels7, series: [{ label: '정상', values: [10, 20, 30, 40, 50, 60, 70] }, { label: '오염', values: dirty }] },
  area: { kind: 'area', labels: labels7, series: [{ label: '오염', values: dirty }] },
  bar: { kind: 'bar', labels: labels7, series: [{ label: '오염', values: dirty }] },
  barStacked: { kind: 'bar', stacked: true, labels: labels7, series: [{ label: 'a', values: dirty }, { label: 'b', values: dirty }] },
  pie: { kind: 'pie', segments: [{ label: '수집실패', value: NaN }, { label: '정상', value: 5 }] },
  radial: { kind: 'radial', value: NaN, label: 'CPU' },
  radar: { kind: 'radar', axes: ['a', 'b', 'c', 'd'], series: [{ label: '오염', values: [1, NaN, 2, Infinity] }] },
  histogram: { kind: 'histogram', samples: dirty },
  threshold: { kind: 'line', labels: ['a', 'b'], series: [{ label: 's', values: [1, 2] }], thresholds: [{ value: NaN, label: '임계' }] },
};
for (const [name, props] of Object.entries(dirtyCharts)) {
  const html = render(Chart, { ...fixed, ...props });
  assert(!/NaN|Infinity/.test(html), `${name}: 결측이 SVG 좌표로 새지 않는다`);
}
assert(!/NaN|Infinity/.test(render(Sparkline, { values: dirty })), 'Sparkline: 결측이 좌표로 새지 않는다');
// A dirty series must not erase axis ticks or the clean series' coordinates.
const mixed = render(Chart, { ...fixed, ...dirtyCharts.line });
assert([...mixed.matchAll(/class="bds-chart__tick"/g)].length > 3, '결측 하나가 축 눈금을 지우지 않는다');
assert(/class="bds-chart__line" d="M[\d.]+ [\d.]+/.test(mixed), '결측이 섞인 차트에서도 정상 계열은 그려진다');
// Missing is never dressed up as 0.
assert(render(Chart, { ...fixed, kind: 'pie', segments: [{ label: 'x', value: NaN }, { label: 'y', value: 5 }] }).includes(MISSING_TEXT), 'pie 결측 세그먼트는 0이 아니라 결측');
// 0 is still a value.
assert(render(Chart, { ...fixed, kind: 'bar', labels: ['a', 'b'], series: [{ label: 's', values: [0, 5] }] }).includes('bds-chart__bar'), '0은 값이므로 막대를 그린다');

console.log('PASS: missing-value contract, DataTable null cells, single marker string and class, chart geometry boundary');
