const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');
const deps = process.env.DS_TEST_NODE_MODULES ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__run.cjs')) : require;
const root = path.resolve(__dirname, '..');
// tsc·eslint 는 bin 경로를 exports 로 내보내지 않아 resolve 가 통하지 않는다. package-regressions.cjs 와 같은 방식으로 조합한다.
const nodeModules = process.env.DS_TEST_NODE_MODULES ? path.resolve(process.env.DS_TEST_NODE_MODULES) : path.join(root, "node_modules");
const env = { ...process.env, BABEL_STANDALONE: deps.resolve('@babel/standalone') };
// 빠른 정적 검사부터. 목록에 적힌 파일은 모두 있어야 한다.
// 항목은 파일 하나이거나 [파일, ...인자]다. 인자가 필요한 것은 도구뿐이다.
const order = [
  'build-bundle.mjs',
  // 타입과 린트가 먼저다. 소스가 성립하지 않으면 나머지 검사 결과는 읽을 필요가 없다.
  [path.join(nodeModules, 'typescript', 'bin', 'tsc'), '--project', path.join(root, 'tsconfig.json')],
  // 템플릿도 공개 API를 쓴다. prop 이름이 바뀌면 조용히 깨지고 렌더 검사는 마운트만 보므로 여기서 잡는다.
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
