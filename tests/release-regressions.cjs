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

assert.notEqual(pkg.private, true, "private: true면 태그를 밀어도 발행이 되지 않는다");
assert.equal(pkg.publishConfig?.registry, "https://npm.pkg.github.com", "배포 레지스트리가 GitHub Packages가 아님");
// GitHub Packages는 scope가 저장소 소유자와 같아야 받는다.
assert.match(pkg.name, /^@dbwk10317\//, "scope가 저장소 소유자와 다르면 GitHub Packages가 거부한다");
assert.equal(pkg.scripts.changeset, "changeset");
assert.equal(pkg.scripts["version:packages"], "changeset version");
assert.equal(changesets.baseBranch, "main");
assert.deepEqual(changesets.privatePackages, { version: true, tag: false });

for (const [name, workflow] of [["CI", ci], ["Release", release]]) {
  assert.match(workflow, /actions\/checkout@v6/, `${name} workflow`);
  assert.match(workflow, /actions\/setup-node@v7/, `${name} workflow`);
  assert.match(workflow, /node-version:\s*26/, `${name} workflow`);
  assert.match(workflow, /run:\s*npm ci/, `${name} workflow`);
  assert.match(workflow, /npm test/, `${name} workflow`);
}

// 발행 경로는 하나여야 한다. 태그 말고 다른 것으로도 발행되면 되돌릴 수 없는 실수가 난다.
assert(!/npm publish/.test(ci), "CI workflow가 발행을 한다");
assert.match(release, /on:\s*\n\s*push:\s*\n\s*tags:/, "Release workflow가 태그가 아닌 이벤트로 돈다");
assert(!/branches:/.test(release), "Release workflow에 branch 트리거가 남아 있다");
assert.match(release, /packages:\s*write/, "GitHub Packages에 올리려면 packages: write가 필요하다");
assert.match(release, /NODE_AUTH_TOKEN/, "publish에 인증 토큰이 연결되지 않음");
assert.match(release, /registry-url:\s*https:\/\/npm\.pkg\.github\.com/, "setup-node가 GitHub Packages를 보지 않음");

// 검증하지 않은 산출물이 올라가지 않도록, 게이트가 publish보다 먼저 와야 한다.
assert(release.indexOf("npm test") < release.indexOf("npm publish"), "게이트보다 publish가 먼저 온다");
// 태그와 package.json이 어긋나면 태그가 가리키는 커밋과 레지스트리의 버전이 달라진다.
assert.match(release, /GITHUB_REF_NAME/, "태그와 package.json 버전을 대조하지 않는다");
// prerelease를 기본 dist-tag로 올리면 beta가 latest를 가져간다.
assert.match(release, /npm publish --tag next/, "prerelease를 next 채널로 올리지 않는다");
assert.match(release, /npm publish --tag latest/, "정식을 latest 채널로 올리지 않는다");

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

console.log("PASS release regressions: 태그 발행 경로 하나, 게이트 뒤 publish, 채널 분리, 배포 대상이 릴리스 계획에 잡힘");
