const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const nodeModules = process.env.DS_TEST_NODE_MODULES ? path.resolve(process.env.DS_TEST_NODE_MODULES) : path.join(root, "node_modules");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const pkg = JSON.parse(read("package.json"));
const changesets = JSON.parse(read(".changeset/config.json"));
const ci = read(".github/workflows/ci.yml");
const release = read(".github/workflows/release.yml");

assert.equal(pkg.private, true, "레지스트리·공개 범위 결정 전 package publish 차단이 풀림");
assert.equal(pkg.version, "0.0.0-development", "레지스트리·공개 범위 결정 전 개발 버전이 바뀜");
assert.equal(pkg.scripts.changeset, "changeset");
assert.equal(pkg.scripts["version:packages"], "changeset version");
assert.equal(changesets.baseBranch, "main");
assert.equal(changesets.access, "restricted");
assert.deepEqual(changesets.privatePackages, { version: true, tag: false });

for (const [name, workflow] of [["CI", ci], ["Release PR", release]]) {
  assert.match(workflow, /actions\/checkout@v6/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /node-version:\s*26/);
  assert.match(workflow, /run:\s*npm ci/);
  assert.match(workflow, /run:\s*npm test/);
  assert(!/npm publish|changeset publish|publish-script:/.test(workflow), `${name} workflow가 실제 publish를 활성화함`);
}
assert.match(release, /changesets\/action@v2/);
assert.match(release, /version-script:\s*npm run version:packages/);

// 배포 대상은 저장소 루트의 패키지다. 루트에 workspaces를 선언하면 루트가 workspace 루트가 되고
// changesets는 루트를 versionable 목록에서 빼, 릴리스 계획을 전혀 세우지 못한다.
assert.equal(pkg.workspaces, undefined, "루트에 workspaces가 생겨 배포 대상이 changesets의 versionable 목록에서 빠짐");

// 설정 문자열만 보면 릴리스 자동화가 실제로 도는지 알 수 없다. 위 검사만 있던 동안 버전 PR 워크플로는
// changeset version에서 죽고 있었는데도 이 파일은 통과했다. CLI를 실제로 돌려 확인한다.
const status = spawnSync(process.execPath, [path.join(nodeModules, "@changesets", "cli", "bin.js"), "status"], { cwd: root, encoding: "utf8" });
const statusOutput = `${status.stdout}${status.stderr}`;
// 대기 중 changeset이 없으면 status는 exit 1이다(릴리스 직후 커밋이 그렇다). 그것만 통과시키고
// "not in the workspace" 같은 나머지 실패는 잡는다.
if (!/no changesets were found/i.test(statusOutput)) {
  assert.equal(status.status, 0, `changeset status가 실패함: ${statusOutput}`);
  assert.match(statusOutput, new RegExp(pkg.name.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&")), `changeset status가 배포 대상 ${pkg.name}을 릴리스 계획에 잡지 못함: ${statusOutput}`);
}

console.log("PASS release regressions: Changesets version PR and CI enabled, publish disabled, 배포 대상이 릴리스 계획에 잡힘");
