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
// Registry is the npmjs default. Scoped packages default to restricted; without explicit access the first publish dies with 402.
assert.equal(pkg.publishConfig?.registry, undefined, "레지스트리를 따로 지정하지 않는다(npmjs 기본값)");
assert.equal(pkg.publishConfig?.access, "public", "scope 패키지는 publishConfig.access=public이어야 npmjs에 공개로 올라간다");
assert.match(pkg.name, /^@dbwk10317\//, "패키지 scope가 readme 계약과 다름");
// See RULE.md "공개 API·버전·배포 계약" (검증된 환경): the peer range must match the React matrix the gate verifies.
assert.equal(pkg.peerDependencies?.react, ">=18.2.0 <20", "React peer 범위가 검증 범위(18.2~19)와 다름");
assert.equal(pkg.scripts.changeset, "changeset");
assert.equal(pkg.scripts["version:packages"], "changeset version");
assert.equal(changesets.baseBranch, "main");
// access/privatePackages are read by `changeset publish`, but publishing is done by the workflow's npm publish.
// Do not pin config that has no consumer.
assert.equal(changesets.access, undefined, "changeset publish를 쓰지 않으므로 access는 소비처가 없다");

for (const [name, workflow] of [["CI", ci], ["Release", release]]) {
  assert.match(workflow, /actions\/checkout@v6/, `${name} workflow`);
  assert.match(workflow, /actions\/setup-node@v7/, `${name} workflow`);
  assert.match(workflow, /node-version:\s*26/, `${name} workflow`);
  assert.match(workflow, /run:\s*npm ci/, `${name} workflow`);
  assert.match(workflow, /npm test/, `${name} workflow`);
}

// See RULE.md "릴리스": tags are the only publish path.
assert(!/npm publish/.test(ci), "CI workflow가 발행을 한다");
assert.match(release, /on:\s*\n\s*push:\s*\n\s*tags:/, "Release workflow가 태그가 아닌 이벤트로 돈다");
assert(!/branches:/.test(release), "Release workflow에 branch 트리거가 남아 있다");
// Auth is Trusted Publishing (OIDC). A secret token or registry-url (which writes a NODE_AUTH_TOKEN line to .npmrc) breaks the OIDC path.
assert.match(release, /id-token:\s*write/, "OIDC 발행에는 id-token: write 가 필요하다");
assert(!/NODE_AUTH_TOKEN|NPM_TOKEN|registry-url/.test(release.replace(/^\s*#.*$/gm, "")), "Trusted Publishing 워크플로에 토큰 인증 설정이 남아 있다");
assert.match(release, /npm --version/, "러너 npm 이 11.5.1 이상인지 확인하지 않는다");
assert(!/npm\.pkg\.github\.com/.test(release) && !/packages:\s*write/.test(release), "GitHub Packages 설정이 남아 있다");

// Gate before publish, so unverified output never ships.
assert(release.indexOf("npm test") < release.indexOf("npm publish"), "게이트보다 publish가 먼저 온다");
// Tag and package.json version must agree, or the tagged commit and the registry version diverge.
assert.match(release, /GITHUB_REF_NAME/, "태그와 package.json 버전을 대조하지 않는다");
// A prerelease published under the default dist-tag would take over `latest`.
assert.match(release, /npm publish --tag next/, "prerelease를 next 채널로 올리지 않는다");
assert.match(release, /npm publish --tag latest/, "정식을 latest 채널로 올리지 않는다");

// The published package is the repo root. Declaring workspaces there makes the root a workspace root, and
// changesets drops it from the versionable list, so no release plan is ever built.
assert.equal(pkg.workspaces, undefined, "루트에 workspaces가 생겨 배포 대상이 changesets의 versionable 목록에서 빠짐");

// Config strings alone do not prove the release automation runs: with only the checks above, the version-PR
// workflow was dying in `changeset version` while this file passed. So run the CLI for real.
// `changeset status` diffs against baseBranch. The release job checks the tag out detached and shallow, where
// main does not exist, so status cannot run there; run it only where possible and say so when skipping.
const hasBase = spawnSync("git", ["rev-parse", "--verify", "--quiet", `refs/heads/${changesets.baseBranch}`], { cwd: root, encoding: "utf8" }).status === 0;
if (!hasBase) {
  console.log(`PASS release regressions: 태그 발행 경로 하나, 게이트 뒤 publish, 채널 분리 (changeset status는 ${changesets.baseBranch} 브랜치가 없는 체크아웃이라 건너뜀)`);
  process.exit(0);
}
const status = spawnSync(process.execPath, [path.join(nodeModules, "@changesets", "cli", "bin.js"), "status"], { cwd: root, encoding: "utf8" });
const statusOutput = `${status.stdout}${status.stderr}`;
// This phrase is the name of that regression; it must never appear.
assert(!/not in the workspace/i.test(statusOutput), `changesets가 배포 대상을 versionable 목록에서 빼고 있다: ${statusOutput}`);
// The status result depends on whether changesets are pending. All three are healthy:
//   pending            -> exit 0, the package appears in the release plan
//   none + clean tree  -> exit 0, "Packages to be bumped:" is empty (a release commit looks like this)
//   none + changes     -> exit 1, "no changesets were found"
// Only the first case can be required to name the package.
const pending = fs.readdirSync(path.join(root, ".changeset")).filter((name) => name.endsWith(".md") && name !== "README.md");
if (pending.length) {
  assert.equal(status.status, 0, `changeset status가 실패함: ${statusOutput}`);
  assert.match(statusOutput, new RegExp(pkg.name.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&")), `changeset status가 배포 대상 ${pkg.name}을 릴리스 계획에 잡지 못함: ${statusOutput}`);
} else {
  assert(status.status === 0 || /no changesets were found/i.test(statusOutput), `changeset status가 예상 밖으로 실패함: ${statusOutput}`);
}

console.log("PASS release regressions: 태그 발행 경로 하나, 게이트 뒤 publish, 채널 분리, 배포 대상이 릴리스 계획에 잡힘");
