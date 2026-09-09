// _ds_bundle.js 빌드. components/**/*.jsx + core/*.js + theme-toggle.js를 Babel(react preset)로 변환해 한 파일로 묶는다.
// 실행: node build-bundle.mjs   (@babel/standalone이 필요. 없으면 BABEL_STANDALONE=<경로> 로 지정하거나 `npm i -g @babel/standalone`)
// 출력: _ds_bundle.js(헤더 JSON에 components·sourceHashes 갱신), _ds_manifest.json(components·unexposedExports 갱신)
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { join, relative, dirname, resolve } from "node:path";

const ROOT = dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const NS = "Ds_d3ea90";
const require = createRequire(import.meta.url);
const Babel = require(process.env.BABEL_STANDALONE || "@babel/standalone");

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const rel = (p) => relative(ROOT, p).replaceAll("\\", "/");
const files = [...walk(join(ROOT, "components")).filter((p) => /\.(jsx|js)$/.test(p)).map(rel), "theme-toggle.js"].sort();
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const IMPORT_RE = /^import\s+(?:(\w+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*"([^"]+)";\s*$/gm;
const info = {};
for (const p of files) {
  const src = read(p), react = [], scope = [], deps = [];
  for (const m of src.matchAll(IMPORT_RE)) {
    const names = (m[2] || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (m[3] === "react") react.push(...names);
    else { scope.push(...names); deps.push(rel(resolve(dirname(join(ROOT, p)), m[3]))); }
  }
  const exports = [...src.matchAll(/^export\s+(?:function|const|let|class)\s+(\w+)/gm)].map((m) => m[1]);
  info[p] = { src, react, scope, deps, exports };
}

// 의존 순서(임포트한 파일이 먼저). 같은 단계에서는 경로 알파벳순.
const order = [], done = new Set();
while (order.length < files.length) {
  const next = files.find((p) => !done.has(p) && info[p].deps.every((d) => done.has(d)));
  if (!next) throw new Error("순환 임포트: " + files.filter((p) => !done.has(p)).join(", "));
  order.push(next); done.add(next);
}

const block = (p) => {
  const { src, react, scope, exports } = info[p];
  let code = Babel.transform(src, { presets: [["react", { runtime: "classic" }]], sourceType: "module" }).code;
  code = code.replace(/^import[\s\S]*?from\s*"[^"]+";\s*\n/gm, "").replace(/^export\s+(?=(?:function|const|let|class)\s)/gm, "").trimEnd();
  const pro = [];
  if (react.length) pro.push(`const { ${react.join(", ")} } = React;`);
  if (scope.length) pro.push(`const { ${scope.join(", ")} } = __ds_scope;`);
  const tail = exports.length ? `\nObject.assign(__ds_scope, { ${exports.join(", ")} });` : "";
  return `// ${p}\ntry { (() => {\n${[...pro, code].join("\n")}${tail}\n})(); } catch (e) { __ds_ns.__errors.push({ path: "${p}", error: String((e && e.message) || e) }); }\n`;
};

const exposed = (n) => /^[A-Z]/.test(n) && !/^[A-Z0-9_]+$/.test(n); // 컴포넌트 이름만 노출. SCREAMING_CASE 상수·소문자 훅은 __ds_scope에만
const components = [], unexposed = [];
for (const p of files) for (const n of info[p].exports) (exposed(n) ? components : unexposed).push({ name: n, sourcePath: p });
unexposed.sort((a, b) => a.name.localeCompare(b.name));
const sourceHashes = Object.fromEntries(files.map((p) => [p, createHash("sha256").update(readFileSync(join(ROOT, p))).digest("hex").slice(0, 12)]));
const header = { format: 4, namespace: NS, components, sourceHashes, inlinedExternals: [], unexposedExports: unexposed };

// React(UMD 전역)가 번들보다 늦게 로드되는 페이지(템플릿 로더)를 위해, React가 없으면 window.React 대입 시점까지 평가를 미룬다.
const out = [
  `/* @ds-bundle: ${JSON.stringify(header)} */`, "", "(() => {", "",
  `const __ds_ns = (window.${NS} = window.${NS} || {});`, "", "const __ds_scope = {};", "", "(__ds_ns.__errors = __ds_ns.__errors || []);", "",
  "const __ds_run = () => {", "",
  ...order.map(block),
  ...components.map((c) => `__ds_ns.${c.name} = __ds_scope.${c.name};\n`),
  "};", "",
  "if (window.React) __ds_run();",
  'else { let r; Object.defineProperty(window, "React", { configurable: true, get: () => r, set: (v) => { r = v; Object.defineProperty(window, "React", { value: v, writable: true, configurable: true, enumerable: true }); __ds_run(); } }); }',
  "})();", "",
].join("\n");
writeFileSync(join(ROOT, "_ds_bundle.js"), out);

const mp = join(ROOT, "_ds_manifest.json");
const man = JSON.parse(readFileSync(mp, "utf8"));
man.components = components; man.unexposedExports = unexposed;
writeFileSync(mp, JSON.stringify(man));
console.log(`bundle: ${order.length} files, ${components.length} components, ${unexposed.length} unexposed, ${(out.length / 1024).toFixed(0)} KB`);
