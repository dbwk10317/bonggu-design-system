const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createRequire } = require("node:module");
const { createHash } = require("node:crypto");
const { gunzipSync } = require("node:zlib");
const esbuild = require("esbuild");
const { assertPackageBrowser } = require("./package-browser-regressions.cjs");

const root = path.resolve(__dirname, "..");
const template = path.join(__dirname, "fixtures", "package-consumer");
const tempRoot = fs.realpathSync(os.tmpdir());
const work = fs.mkdtempSync(path.join(tempRoot, "bonggu-package-fixture-"));
const consumer = path.join(work, "consumer");
const artifacts = path.join(work, "artifacts");
const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || consumer,
    env: { ...process.env, ...options.env },
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error([
      `${command} ${args.join(" ")} 실패 (${result.status})`,
      result.stdout,
      result.stderr,
    ].filter(Boolean).join("\n"));
  }
  return result;
}

function tarEntries(tarball) {
  const archive = gunzipSync(fs.readFileSync(tarball));
  const entries = [];
  for (let offset = 0; offset + 512 <= archive.length;) {
    const header = archive.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const field = (start, length) => header.subarray(start, start + length).toString("utf8").replace(/\0.*$/, "");
    const name = field(0, 100);
    const prefix = field(345, 155);
    const size = Number.parseInt(field(124, 12).trim() || "0", 8);
    entries.push({ name: prefix ? `${prefix}/${name}` : name, size, offset: offset + 512 });
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return entries;
}

function normalizedTarContents(tarball) {
  const archive = gunzipSync(fs.readFileSync(tarball));
  return tarEntries(tarball).map(({ name, size, offset }) => ({
    name,
    size,
    hash: createHash("sha256").update(archive.subarray(offset, offset + size)).digest("hex"),
  })).sort((a, b) => a.name.localeCompare(b.name));
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function assertPackageContents(tarball) {
  const names = tarEntries(tarball).map(({ name }) => name.replaceAll("\\", "/"));
  const lowerNames = new Set(names.map((name) => name.toLowerCase()));
  const required = [
    "package/package.json",
    "package/readme.md",
    "package/license",
    "package/third_party_notices.md",
    "package/licenses/jetbrains-mono-ofl-1.1.txt",
    "package/licenses/phosphor-icons-mit.txt",
    "package/licenses/spoqa-han-sans-ofl-1.1.txt",
    "package/dist/index.js",
    "package/dist/index.d.ts",
    "package/dist/styles.css",
    "package/dist/fonts/phosphor/phosphor-bold.woff2",
    "package/dist/assets/favicon.svg",
    "package/dist/assets/mascot-neutral.svg",
  ];
  for (const name of required) assert(lowerNames.has(name), `tarball 필수 파일 누락: ${name}`);
  for (const name of names) {
    assert(
      name === "package/package.json" || ["package/readme.md", "package/license", "package/third_party_notices.md"].includes(name.toLowerCase()) || name.startsWith("package/dist/") || name.startsWith("package/licenses/"),
      `tarball 불필요 파일 포함: ${name}`,
    );
    assert(!/\.(?:jsx|prompt\.md|card\.html)$/i.test(name), `tarball 소스·문서 fixture 포함: ${name}`);
    assert(!/(?:^|\/)(?:tests?|theme-toggle\.js|public-entry\.[^/]+|build-package\.mjs|\.npmrc|package-lock\.json)(?:\/|$)/i.test(name), `tarball 로컬 파일 포함: ${name}`);
  }
  assert(names.some((name) => name.startsWith("package/dist/tokens/")), "tarball tokens 누락");
  assert(names.some((name) => name.startsWith("package/dist/styles/")), "tarball component styles 누락");
  console.log(`PASS package contents: ${names.length} essential files only`);
}

function assertCssAndAssets(packageRoot) {
  const dist = path.join(packageRoot, "dist");
  const cssFiles = walk(dist).filter((file) => file.endsWith(".css"));
  let references = 0;
  for (const file of cssFiles) {
    const css = fs.readFileSync(file, "utf8");
    const targets = [
      ...[...css.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/g)].map((match) => match[1]),
      ...[...css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((match) => match[1]),
    ];
    for (const rawTarget of targets) {
      if (/^(?:data:|https?:|#|var\()/i.test(rawTarget)) continue;
      const cleanTarget = decodeURIComponent(rawTarget.split(/[?#]/, 1)[0]);
      const resolved = path.resolve(path.dirname(file), cleanTarget);
      assert(resolved.startsWith(`${packageRoot}${path.sep}`), `CSS 경로가 패키지 밖을 가리킴: ${rawTarget}`);
      assert(fs.existsSync(resolved), `CSS 자산 경로 누락: ${path.relative(packageRoot, file)} -> ${rawTarget}`);
      references += 1;
    }
  }

  const fixtureRequire = createRequire(path.join(consumer, "package.json"));
  for (const asset of ["favicon.svg", "mascot-neutral.svg"]) {
    const resolved = fixtureRequire.resolve(`@dbwk10317/bonggu-design-system/assets/${asset}`);
    assert(fs.existsSync(resolved), `exported asset 누락: ${asset}`);
    assert(resolved.startsWith(`${packageRoot}${path.sep}`), `exported asset가 설치 패키지 밖으로 해석됨: ${asset}`);
  }
  assert(fs.existsSync(fixtureRequire.resolve("@dbwk10317/bonggu-design-system/styles.css")), "exported styles.css 누락");
  console.log(`PASS package assets: ${cssFiles.length} CSS files, ${references} relative references`);
}

function assertBuiltModules(packageRoot) {
  const jsFiles = walk(path.join(packageRoot, "dist")).filter((file) => file.endsWith(".js"));
  for (const file of jsFiles) {
    const code = fs.readFileSync(file, "utf8");
    const withoutComments = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    assert(!/from\s+["'][^"']+\.jsx["']/.test(code), `배포 JS에 .jsx 경로 포함: ${file}`);
    assert(!/<[A-Z][A-Za-z0-9]*(?:\s|\/?>)/.test(withoutComments), `배포 JS에 미변환 JSX 포함: ${file}`);
  }
}

async function assertProductionBundle(packageRoot) {
  const outdir = path.join(work, "bundle");
  const result = await esbuild.build({
    entryPoints: [path.join(consumer, "src", "consumer.tsx")],
    outdir,
    bundle: true,
    format: "esm",
    platform: "browser",
    minify: true,
    metafile: true,
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    loader: { ".woff2": "file", ".svg": "file" },
    assetNames: "assets/[name]-[hash]",
    logLevel: "silent",
  });
  assert(fs.existsSync(path.join(outdir, "consumer.js")), "프로덕션 JS 번들 누락");
  assert(fs.existsSync(path.join(outdir, "consumer.css")), "프로덕션 CSS 번들 누락");
  const inputs = Object.keys(result.metafile.inputs).map((input) => input.replaceAll("\\", "/"));
  const sourcePrefix = root.replaceAll("\\", "/");
  assert(!inputs.some((input) => input.startsWith(`${sourcePrefix}/components/`)), "프로덕션 번들이 원본 components를 참조함");
  assert(inputs.some((input) => input.includes("/node_modules/@dbwk10317/bonggu-design-system/dist/index.js")), "프로덕션 번들이 설치된 package entry를 쓰지 않음");
  const reactRoots = new Set(inputs.flatMap((input) => {
    const match = input.match(/^(.*\/node_modules)\/react\//);
    return match ? [`${match[1]}/react`] : [];
  }));
  assert.equal(reactRoots.size, 1, `React 복수 사본 포함: ${[...reactRoots].join(", ")}`);
  assert(!inputs.some((input) => input.includes("/node_modules/@dbwk10317/bonggu-design-system/node_modules/react/")), "패키지 내부 React 중복 포함");
  assert(inputs.some((input) => input.includes("/node_modules/@dbwk10317/bonggu-design-system/dist/assets/mascot-neutral.svg")), "exports asset이 번들에서 해석되지 않음");
  assertBuiltModules(packageRoot);
  console.log(`PASS package production bundle: ${inputs.length} inputs, one React installation`);
}

async function main() {
  fs.mkdirSync(artifacts);
  fs.cpSync(template, consumer, { recursive: true });

  const pack = run(process.execPath, [npmCli, "pack", "--pack-destination", artifacts, "--silent"], { cwd: root });
  const tarballs = fs.readdirSync(artifacts).filter((name) => name.endsWith(".tgz"));
  assert.equal(tarballs.length, 1, `npm pack 산출물 수가 1이 아님: ${pack.stdout}${pack.stderr}`);
  const tarball = path.join(artifacts, tarballs[0]);
  assertPackageContents(tarball);

  const secondArtifacts = path.join(work, "artifacts-second");
  fs.mkdirSync(secondArtifacts);
  run(process.execPath, [npmCli, "pack", "--pack-destination", secondArtifacts, "--silent"], { cwd: root });
  const secondTarballs = fs.readdirSync(secondArtifacts).filter((name) => name.endsWith(".tgz"));
  assert.equal(secondTarballs.length, 1, "두 번째 npm pack 산출물 수가 1이 아님");
  assert.deepEqual(normalizedTarContents(tarball), normalizedTarContents(path.join(secondArtifacts, secondTarballs[0])), "연속 npm pack의 정규화 파일 내용이 다름");
  console.log("PASS package reproducibility: two normalized tarball contents match");

  const packageTemplate = fs.readFileSync(path.join(consumer, "package.template.json"), "utf8");
  const tarballDependency = `file:${path.relative(consumer, tarball).replaceAll("\\", "/")}`;
  fs.writeFileSync(path.join(consumer, "package.json"), packageTemplate.replace("__PACKAGE_TARBALL__", tarballDependency));
  fs.rmSync(path.join(consumer, "package.template.json"));
  run(process.execPath, [npmCli, "install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"]);

  const packageRoot = fs.realpathSync(path.join(consumer, "node_modules", "@dbwk10317", "bonggu-design-system"));
  assert(packageRoot.startsWith(`${fs.realpathSync(consumer)}${path.sep}`), "file dependency가 fixture 밖 원본으로 연결됨");
  assert.notEqual(packageRoot, root, "file dependency가 원본 저장소를 참조함");

  const tsc = path.join(root, "node_modules", "typescript", "bin", "tsc");
  run(process.execPath, [tsc, "--project", "tsconfig.json"]);
  console.log("PASS package types: public TSX consumer");

  const internal = run(process.execPath, [tsc, "--project", "tsconfig.internal.json"], { allowFailure: true });
  assert.notEqual(internal.status, 0, "내부 package subpath import가 허용됨");
  assert.match(`${internal.stdout}\n${internal.stderr}`, /TS2307[\s\S]*@dbwk10317\/bonggu-design-system\/components\/core\/frame\.js|@dbwk10317\/bonggu-design-system\/components\/core\/frame\.js[\s\S]*TS2307/);
  console.log("PASS package exports: internal subpath blocked");

  const ssr = run(process.execPath, ["ssr.mjs"]);
  process.stdout.write(ssr.stdout);
  assertCssAndAssets(packageRoot);
  await assertProductionBundle(packageRoot);
  await assertPackageBrowser({ run, work, consumer });
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
}).finally(() => {
  const resolvedWork = path.resolve(work);
  const safePrefix = `${tempRoot}${path.sep}bonggu-package-fixture-`;
  if (!resolvedWork.startsWith(safePrefix)) throw new Error(`안전하지 않은 임시 경로 정리 거부: ${resolvedWork}`);
  fs.rmSync(resolvedWork, { recursive: true, force: true });
});
