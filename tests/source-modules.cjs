// Loads the repo's JSX/JS sources directly; tests verify product source, not the bundle.
// Dependencies come from DS_TEST_NODE_MODULES when set, otherwise from local node_modules.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const dependencyRequire = process.env.DS_TEST_NODE_MODULES
  ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__deps.cjs'))
  : require;
// The debug module inside @babel/standalone reads bare localStorage at load, which makes Node emit an ExperimentalWarning; stub it first.
try { Object.defineProperty(globalThis, 'localStorage', { value: { getItem: () => null }, configurable: true, writable: true }); } catch {}
const Babel = dependencyRequire('@babel/standalone');
const root = path.resolve(__dirname, '..');
const cache = new Map();

function sourceModule(relative) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  let source = fs.readFileSync(filename, 'utf8');
  // Chart.jsx keeps Cartesian/Radar private; export them so tests can use them directly.
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

module.exports = { sourceModule, dependencyRequire, root };
