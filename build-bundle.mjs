// _ds_bundle.js 빌드. components/**/*.jsx + core/*.js + theme-toggle.js를 Babel(react preset)로 변환해 한 파일로 묶는다.
// 실행: node build-bundle.mjs   (@babel/standalone이 필요. 없으면 BABEL_STANDALONE=<경로> 로 지정하거나 `npm i -g @babel/standalone`)
// 출력: _ds_bundle.js(헤더 JSON에 components·sourceHashes 갱신), _ds_manifest.json(components·unexposedExports 갱신),
//       _adherence.oxlintrc.json(파생 부분만 갱신 — 아래 "adherence 설정" 참고)
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

// ── adherence 설정 ─────────────────────────────────────────────────────────
// _adherence.oxlintrc.json에서 출처가 있는 부분만 다시 만든다.
//   생성: x-omelette.tokens·tokenKinds(← tokens/*.css), x-omelette.components와 컴포넌트별
//         no-restricted-syntax 규칙(← components/**/*.d.ts), no-restricted-imports의 경로 목록(← components/ 디렉터리)
//   보존: plugins, overrides, react/forbid-elements, 전역 no-restricted-syntax 3개, x-omelette.fontFamilies
// tokenKinds의 종류는 정의 옆 `/* @kind <종류> */` 주석이 있으면 그것을 쓴다. 없으면 기존 값을 유지하고,
// 그것도 없으면(새 토큰) 값으로 추정한 뒤 로그에 남긴다. 옛 종류 판정 규칙은 복원하지 못했으므로 주석으로 옮겨 적는 것이 정답이다.
const CFG = join(ROOT, "_adherence.oxlintrc.json");
const cfg = JSON.parse(readFileSync(CFG, "utf8"));
const x = cfg["x-omelette"];

const tokenValues = {}, declaredKinds = {};
for (const f of readdirSync(join(ROOT, "tokens")).sort()) {
  const raw = readFileSync(join(ROOT, "tokens", f), "utf8");
  for (const m of raw.matchAll(/(--[\w-]+)\s*:[^;{}]*;?[^\S\n]*\/\*[^*]*?@kind\s+(\w+)/g)) declaredKinds[m[1]] = m[2];
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of css.matchAll(/[{;\s](--[\w-]+)\s*:([^;}]*)/g)) if (!(m[1] in tokenValues)) tokenValues[m[1]] = m[2].trim();
}
const tokens = Object.keys(tokenValues).sort();
const kinds = {}, guessed = [], conflicts = [];
for (const n of tokens) {
  if (declaredKinds[n]) {
    kinds[n] = declaredKinds[n];
    if (x.tokenKinds[n] && x.tokenKinds[n] !== kinds[n]) conflicts.push(`${n} ${x.tokenKinds[n]}→${kinds[n]}`);
  } else if (x.tokenKinds[n]) kinds[n] = x.tokenKinds[n];
  else { kinds[n] = /#[0-9a-f]{3}|\b(?:oklch|rgba?|hsla?|color-mix)\(/i.test(tokenValues[n]) ? "color" : "other"; guessed.push(`${n}=${kinds[n]}`); }
}

// .d.ts: 컴포넌트는 `export declare function <대문자>`, 그 props는 같은 이름 + "Props" 인터페이스.
const stripTs = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const ifaces = {}, comps = [];
for (const p of walk(join(ROOT, "components")).filter((p) => p.endsWith(".d.ts")).sort()) {
  const src = stripTs(readFileSync(p, "utf8"));
  for (const m of src.matchAll(/export interface (\w+)[^{]*\{/g)) {
    let i = m.index + m[0].length, depth = 1;
    while (i < src.length && depth) { const c = src[i++]; if (c === "{") depth++; else if (c === "}") depth--; }
    ifaces[m[1]] = src.slice(m.index + m[0].length, i - 1);
  }
  for (const m of src.matchAll(/^export declare function ([A-Z]\w*)/gm)) comps.push(m[1]);
}
comps.sort();

// 인터페이스 본문 → 멤버. 깊이 0의 `;`로만 자른다(`<`·`>`는 화살표 함수 때문에 세지 않는다).
const membersOf = (body) => {
  const parts = []; let depth = 0, cur = "";
  for (const ch of body) {
    if ("{[(".includes(ch)) depth++; else if ("}])".includes(ch)) depth--;
    if (ch === ";" && !depth) { parts.push(cur); cur = ""; } else cur += ch;
  }
  return [...parts, cur].map((s) => s.trim().match(/^(\w+)\??\s*:\s*([\s\S]+)$/)).filter(Boolean).map((m) => ({ name: m[1], type: m[2].trim() }));
};
const STR_UNION = /^"[^"]*"(?:\s*\|\s*"[^"]*")*$/;
const propRules = [], noProps = [];
for (const c of comps) {
  if (!(c + "Props" in ifaces)) { noProps.push(c); continue; } // props가 인터페이스가 아닌 컴포넌트(Chart의 유니언 등)는 규칙을 만들지 않는다
  const props = membersOf(ifaces[c + "Props"]), names = props.map((p) => p.name);
  propRules.push({ selector: `JSXOpeningElement[name.name='${c}'] > JSXAttribute > JSXIdentifier[name!=/^(?:${[...names, "key", "ref", "className", "style", "children"].join("|")})$/]`, message: `<${c}> doesn't accept that prop. Declared props: ${names.join(", ")}.` });
  for (const p of props) if (STR_UNION.test(p.type)) {
    const vals = p.type.split("|").map((s) => s.trim().slice(1, -1));
    propRules.push({ selector: `JSXOpeningElement[name.name='${c}'] > JSXAttribute[name.name='${p.name}'] > Literal[value!=/^(?:${vals.join("|")})$/]`, message: `<${c}> ${p.name} must be one of ${vals.map((v) => `'${v}'`).join(" | ")}.` });
  }
}

const nrs = cfg.rules["no-restricted-syntax"];
cfg.rules["no-restricted-syntax"] = [nrs[0], ...nrs.slice(1).filter((r) => !r.selector.startsWith("JSXOpeningElement")), ...propRules];
cfg.rules["no-restricted-imports"][1].patterns[0].group = [...readdirSync(join(ROOT, "components")).sort().map((d) => `components/${d}/**`), "theme-toggle.js"];
x.components = Object.fromEntries(comps.map((c) => [c, { replaces: [] }]));
x.tokens = tokens;
x.tokenKinds = kinds;
const banner = "생성물. 직접 고치지 말고 tokens/*.css·components/**/*.d.ts를 고친 뒤 `node build-bundle.mjs`를 다시 실행한다. 토큰 종류는 정의 옆 `/* @kind <종류> */` 주석으로 정한다. plugins·overrides·react/forbid-elements·전역 no-restricted-syntax 3개·x-omelette.fontFamilies만 손으로 유지한다.";
writeFileSync(CFG, JSON.stringify({ "x-generated": banner, ...cfg }, null, 2));
console.log(`adherence: ${tokens.length} tokens(@kind ${Object.keys(declaredKinds).length}), ${comps.length} components, ${propRules.length} prop rules` +
  (guessed.length ? `\n  새 토큰(종류 추정, @kind 주석으로 확정할 것): ${guessed.join(", ")}` : "") +
  (conflicts.length ? `\n  @kind가 기존 종류를 덮음: ${conflicts.join(", ")}` : "") +
  (noProps.length ? `\n  props 인터페이스 없어 규칙 제외: ${noProps.join(", ")}` : ""));
