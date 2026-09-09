const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');
const deps = process.env.DS_TEST_NODE_MODULES ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__run.cjs')) : require;
const root = path.resolve(__dirname, '..');
const env = { ...process.env, BABEL_STANDALONE: deps.resolve('@babel/standalone') };
for (const file of ['build-bundle.mjs', 'tests/data-regressions.cjs', 'tests/input-regressions.cjs', 'tests/overlay-regressions.cjs', 'tests/browser-regressions.cjs']) {
  const result = spawnSync(process.execPath, [path.join(root, file)], { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
