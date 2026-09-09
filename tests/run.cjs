const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');
const deps = process.env.DS_TEST_NODE_MODULES ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__run.cjs')) : require;
const root = path.resolve(__dirname, '..');
const env = { ...process.env, BABEL_STANDALONE: deps.resolve('@babel/standalone') };
// 빠른 정적 검사부터. 목록에 적힌 파일은 모두 있어야 한다.
const order = [
  'build-bundle.mjs',
  'tests/manifest-token-regressions.cjs',
  'tests/consistency-regressions.cjs',
  'tests/rule-regressions.cjs',
  'tests/smoke-regressions.cjs',
  'tests/data-regressions.cjs',
  'tests/missing-value-regressions.cjs',
  'tests/input-regressions.cjs',
  'tests/overlay-regressions.cjs',
  'tests/browser-regressions.cjs',
];
for (const file of order) {
  if (!require('node:fs').existsSync(path.join(root, file))) throw new Error(`검증 파일이 없습니다: ${file}`);
  const result = spawnSync(process.execPath, [path.join(root, file)], { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
