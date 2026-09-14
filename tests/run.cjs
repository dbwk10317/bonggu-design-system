const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');
const deps = process.env.DS_TEST_NODE_MODULES ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__run.cjs')) : require;
const root = path.resolve(__dirname, '..');
// tsc/eslint do not expose their bin paths via exports, so resolve() fails; build the path like package-regressions.cjs does.
const nodeModules = process.env.DS_TEST_NODE_MODULES ? path.resolve(process.env.DS_TEST_NODE_MODULES) : path.join(root, "node_modules");
const env = { ...process.env, BABEL_STANDALONE: deps.resolve('@babel/standalone') };
// Fast static checks first; every listed file must exist.
// An entry is a file or [file, ...args]; only the tools take args.
const order = [
  'build-bundle.mjs',
  // Types and lint first: if the source does not hold, the remaining results are not worth reading.
  [path.join(nodeModules, 'typescript', 'bin', 'tsc'), '--project', path.join(root, 'tsconfig.json')],
  // Templates use the public API too; a renamed prop breaks silently and the render check only sees mounting.
  [path.join(nodeModules, 'typescript', 'bin', 'tsc'), '--project', path.join(root, 'tsconfig.templates.json')],
  [path.join(nodeModules, 'eslint', 'bin', 'eslint.js'), root],
  'tests/manifest-token-regressions.cjs',
  'tests/consistency-regressions.cjs',
  'tests/rule-regressions.cjs',
  'tests/release-regressions.cjs',
  'tests/package-regressions.cjs',
  'tests/smoke-regressions.cjs',
  'tests/data-regressions.cjs',
  'tests/missing-value-regressions.cjs',
  'tests/input-regressions.cjs',
  'tests/overlay-regressions.cjs',
  'tests/browser-regressions.cjs',
];
for (const entry of order) {
  const [file, ...args] = Array.isArray(entry) ? entry : [entry];
  const target = path.isAbsolute(file) ? file : path.join(root, file);
  if (!require('node:fs').existsSync(target)) throw new Error(`검증 파일이 없습니다: ${file}`);
  const result = spawnSync(process.execPath, [target, ...args], { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  if (Array.isArray(entry)) console.log(`PASS ${path.basename(file, path.extname(file))}: 위반 없음`);
}
