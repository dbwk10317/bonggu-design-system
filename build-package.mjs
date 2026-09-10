import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const require = createRequire(import.meta.url);
// Babel의 debug 코드가 로드 시 bare localStorage를 읽으므로 비활성 스텁으로 경고만 막는다.
try { Object.defineProperty(globalThis, "localStorage", { value: { getItem: () => null }, configurable: true, writable: true }); } catch {}
const Babel = require("@babel/standalone");

const walk = (directory) => readdirSync(directory).flatMap((name) => {
  const path = join(directory, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const posix = (path) => path.replaceAll("\\", "/");
const read = (path) => readFileSync(join(root, path), "utf8");
const modulePath = (path) => posix(relative(root, path)).replace(/\.jsx$/, ".js");
const normalizeImports = (code) => code.replace(/(from\s+["'][^"']+)\.jsx(["'])/g, "$1.js$2");

const readme = read("readme.md");
const componentSection = readme.match(/### Components \((\d+) · \d+그룹\)\r?\n([\s\S]*?)\r?\n\r?\n그룹 기준:/);
if (!componentSection) throw new Error("readme.md의 공개 Components 목록을 읽을 수 없습니다.");
const documented = [...componentSection[2].matchAll(/^- [a-z]+:\s*(.+)$/gm)]
  .flatMap((match) => match[1].split(","))
  .map((item) => item.trim().match(/^([A-Z]\w*)/)?.[1])
  .filter(Boolean);
if (documented.length !== Number(componentSection[1])) throw new Error("readme.md의 공개 Components 개수와 목록이 다릅니다.");

const jsEntry = read("public-entry.js");
const jsExports = [...jsEntry.matchAll(/^export \{([^}]+)\} from "([^"]+)";/gm)]
  .flatMap((match) => match[1].split(",").map((name) => name.trim()));
const expectedValues = [...documented, "useToast"].sort();
const actualValues = [...jsExports].sort();
if (JSON.stringify(actualValues) !== JSON.stringify(expectedValues)) {
  throw new Error("public-entry.js는 README 96개 컴포넌트와 useToast만 내보내야 합니다.");
}
for (const internal of ["useFieldContext", "passwordStrength", "NOTIFICATION_DRAWER_ID"]) {
  if (jsExports.includes(internal)) throw new Error(`public-entry.js가 내부 값 ${internal}을 내보냅니다.`);
}

const dtsEntry = read("public-entry.d.ts");
for (const internal of ["useFieldContext", "passwordStrength", "NOTIFICATION_DRAWER_ID"]) {
  if (new RegExp(`\\b${internal}\\b`).test(dtsEntry)) throw new Error(`public-entry.d.ts가 내부 값 ${internal}을 내보냅니다.`);
}
const publicModules = new Set([...jsEntry.matchAll(/from "\.\/(components\/[^.]+)\.jsx";/g)].map((match) => `${match[1]}.d.ts`));
const wildcardModules = new Set([...dtsEntry.matchAll(/^export \* from "\.\/(components\/[^.]+)\.js";/gm)].map((match) => `${match[1]}.d.ts`));
const namedTypes = new Set([...dtsEntry.matchAll(/^export type \{([^}]+)\}/gm)].flatMap((match) => match[1].split(",").map((name) => name.trim())));
const missingTypes = [];
for (const path of publicModules) {
  const declarations = [...read(path).matchAll(/^export (?:interface|type) (\w+)/gm)].map((match) => match[1]);
  for (const name of declarations) if (!wildcardModules.has(path) && !namedTypes.has(name)) missingTypes.push(`${name} (${path})`);
}
if (missingTypes.length) throw new Error(`public-entry.d.ts에 공개 관련 타입이 빠졌습니다: ${missingTypes.join(", ")}`);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const source of walk(join(root, "components"))) {
  const rel = modulePath(source);
  if (!/\.(?:js|d\.ts)$/.test(rel)) continue;
  const target = join(dist, rel);
  mkdirSync(dirname(target), { recursive: true });
  if (/\.(?:jsx|js)$/.test(source)) {
    const result = Babel.transform(readFileSync(source, "utf8"), {
      filename: posix(relative(root, source)),
      presets: [["react", { runtime: "classic" }]],
      sourceType: "module",
    });
    writeFileSync(target, `${normalizeImports(result.code)}\n`);
  } else {
    cpSync(source, target);
  }
}

writeFileSync(join(dist, "index.js"), normalizeImports(jsEntry));
writeFileSync(join(dist, "index.d.ts"), dtsEntry);
for (const path of ["styles.css", "tokens", "styles", "fonts", "assets"]) cpSync(join(root, path), join(dist, path), { recursive: true });

const builtJs = walk(dist).filter((path) => path.endsWith(".js"));
for (const path of builtJs) {
  const code = readFileSync(path, "utf8");
  const codeWithoutComments = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  if (/<[A-Za-z][^>]*>/.test(codeWithoutComments) || /from\s+["'][^"']+\.jsx["']/.test(code)) throw new Error(`배포 JS 변환 실패: ${modulePath(path)}`);
}
console.log(`package: ${actualValues.length} public values, ${publicModules.size} public modules, ${builtJs.length} ESM files`);
