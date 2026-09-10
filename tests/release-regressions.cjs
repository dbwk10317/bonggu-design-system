const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
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

console.log("PASS release regressions: Changesets version PR and CI enabled, publish disabled");
