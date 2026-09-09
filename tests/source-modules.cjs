// 저장소의 JSX/JS 소스를 그대로 읽어 온다. 테스트는 번들이 아니라 제품 소스를 검증한다.
// DS_TEST_NODE_MODULES가 있으면 외부 node_modules에서, 없으면 로컬에서 의존성을 찾는다.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const dependencyRequire = process.env.DS_TEST_NODE_MODULES
  ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__deps.cjs'))
  : require;
const Babel = dependencyRequire('@babel/standalone');
const root = path.resolve(__dirname, '..');
const cache = new Map();

function sourceModule(relative) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  let source = fs.readFileSync(filename, 'utf8');
  // Chart.jsx는 Cartesian/Radar를 모듈 안에 감춰 두므로 테스트가 직접 쓰도록 내보낸다.
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
