const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const dependencyRequire = process.env.DS_TEST_NODE_MODULES
  ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__data-tests.cjs'))
  : require;
const Babel = dependencyRequire('@babel/standalone');
const React = dependencyRequire('react');
const { renderToStaticMarkup } = dependencyRequire('react-dom/server');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function sourceModule(relative) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  let source = fs.readFileSync(filename, 'utf8');
  if (filename.endsWith(`${path.sep}Chart.jsx`)) source += '\nexport { Cartesian, Radar };';
  const module = { exports: {} };
  cache.set(filename, module);
  const code = Babel.transform(source, { presets: ['react'], plugins: ['transform-modules-commonjs'] }).code;
  new Function('require', 'module', 'exports', code)(
    (id) => id.startsWith('.') ? sourceModule(path.resolve(path.dirname(filename), id)) : dependencyRequire(id),
    module, module.exports,
  );
  return module.exports;
}
const { niceTicks, stackBars } = sourceModule('components/data/chart-math.js');
for (const [lo, hi] of [[0, 0.04], [0, 0.000004], [-0.04, 0.04], [0.11, 0.19], [-5, -5]]) {
  const axis = niceTicks(lo, hi);
  assert(axis.ticks.length > 1);
  assert.equal(new Set(axis.ticks).size, axis.ticks.length, 'ticks retain decimal precision');
  assert(axis.ticks.every((v, i, values) => Number.isFinite(v) && (!i || v > values[i - 1])));
  assert(axis.lo <= lo && axis.hi >= hi);
}
assert.deepEqual(niceTicks(0, 0.04).ticks, [0, 0.02, 0.04]);
const series = [{ label: 'a', values: [100, -10, null] }, { label: 'b', values: [-90, -20, 5] }, { label: 'c', values: [20, 5, 0] }];
assert.deepEqual(stackBars(series, 3), {
  bands: [
    [{ start: 0, end: 100 }, { start: 0, end: -10 }, null],
    [{ start: 0, end: -90 }, { start: -10, end: -30 }, { start: 0, end: 5 }],
    [{ start: 100, end: 120 }, { start: 0, end: 5 }, { start: 5, end: 5 }],
  ], lo: -90, hi: 120,
});
const { Cartesian, Radar, Chart } = sourceModule('components/data/Chart.jsx');
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
const common = { w: 300, h: 260, fmt: String, uid: 'test', hover: 1, setHover() {} };
const stacked = render(Cartesian, { ...common, kind: 'bar', stacked: true, labels: ['x', 'y', 'z'], series });
const bars = [...stacked.matchAll(/<rect class="bds-chart__bar"[^>]* y="([^"]+)"[^>]* height="([^"]+)"/g)];
assert.equal(bars.length, 8, 'null omits a bar, zero remains a collected value');
assert(bars.every(([, y, height]) => Number(y) >= 0 && Number(y) + Number(height) <= 260), 'both stack signs fit within the chart');
const mixed = [{ label: 'a', values: [80, null, 60] }, { label: 'b', values: [50, 40, 30] }];
for (const kind of ['line', 'area', 'bar']) {
  assert(render(Cartesian, { ...common, kind, labels: ['x', 'y', 'z'], series: mixed }).includes('수집 안 됨'));
}
const radar = render(Radar, { ...common, axes: ['x', 'y', 'z'], series: mixed, max: 100 });
assert.equal((radar.match(/fill-opacity=".2"/g) || []).length, 1, 'only complete radar series fills its polygon');
assert(radar.includes('수집 안 됨'));
assert(render(Chart, { kind: 'radar', axes: ['x', 'y', 'z'], series: [{ label: 'a', values: [null, null, null] }], animate: false }).includes('bds-chart__empty'));
const { UptimeBar } = sourceModule('components/data/UptimeBar.jsx');
const uptime = (statuses, extra = {}) => render(UptimeBar, { name: 'service', segments: statuses.map(status => ({ status })), ...extra });
assert(uptime(['ok', 'warn']).includes('100.000%'));
assert(uptime(['ok', 'warn', 'crit', 'off']).includes('66.67%'));
assert(uptime(['crit']).includes('0.00%'));
assert(uptime(['off']).includes('수집 안 됨'));
assert(uptime([], { uptime: 98.2 }).includes('98.20%'));
console.log('PASS: decimal ticks, signed stacking, missing chart values, uptime contract');
