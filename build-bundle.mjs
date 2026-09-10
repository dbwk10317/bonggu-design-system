// _ds_bundle.js 빌드. components/**/*.jsx + core/*.js + theme-toggle.js를 Babel(react preset)로 변환해 한 파일로 묶는다.
// 실행: node build-bundle.mjs   (@babel/standalone이 필요. 없으면 BABEL_STANDALONE=<경로> 로 지정하거나 `npm i -g @babel/standalone`)
// 출력: _ds_bundle.js(헤더 JSON에 components·sourceHashes 갱신), _ds_manifest.json(components·unexposedExports 갱신),
//       _adherence.oxlintrc.json(파생 부분만 갱신 — 아래 "adherence 설정" 참고)
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { join, relative, dirname, resolve } from "node:path";
import { parseTokenBlocks, parseTokenKinds, stripComments } from "./token-parser.mjs";

const ROOT = dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const NS = "Ds_d3ea90";
const require = createRequire(import.meta.url);
// @babel/standalone 안의 debug가 로드 시 bare localStorage를 읽어 Node가 ExperimentalWarning을 내므로 Babel을 읽기 전에 불활성 스텁으로 가린다.
try { Object.defineProperty(globalThis, "localStorage", { value: { getItem: () => null }, configurable: true, writable: true }); } catch {}
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

const exposed = (n) => /^[A-Z]/.test(n) && !/^[A-Z0-9_]+$/.test(n); // 컴포넌트 이름. SCREAMING_CASE 상수는 __ds_scope에만
// 공개 훅도 네임스페이스에 올린다. 올리지 않으면 script 번들 소비자가 훅을 부를 방법이 없어
// 컴포넌트에 손으로 붙이는 곁가지 API(ToastProvider.useToast 같은)가 생긴다. components 목록에는 넣지 않는다.
// 모듈 사이에서만 쓰는 내부 훅까지 올리면 공개 표면이 넓어지므로, public-entry.js가 내보내는 것만 본다.
const PUBLIC = new Set([...readFileSync(join(ROOT, "public-entry.js"), "utf8").matchAll(/^export {([^}]*)}/gm)]
  .flatMap((m) => m[1].split(",").map((s) => s.trim().split(/s+ass+/).pop())));
const isHook = (n) => /^use[A-Z]/.test(n) && PUBLIC.has(n);
const components = [], hooks = [], unexposed = [];
for (const p of files) for (const n of info[p].exports) (exposed(n) ? components : isHook(n) ? hooks : unexposed).push({ name: n, sourcePath: p });
unexposed.sort((a, b) => a.name.localeCompare(b.name));
const sourceHashes = Object.fromEntries(files.map((p) => [p, createHash("sha256").update(readFileSync(join(ROOT, p))).digest("hex").slice(0, 12)]));
const header = { format: 4, namespace: NS, components, sourceHashes, inlinedExternals: [], unexposedExports: unexposed, hooks };

// React(UMD 전역)가 번들보다 늦게 로드되는 페이지(템플릿 로더)를 위해, React가 없으면 window.React 대입 시점까지 평가를 미룬다.
const out = [
  `/* @ds-bundle: ${JSON.stringify(header)} */`, "", "(() => {", "",
  `const __ds_ns = (window.${NS} = window.${NS} || {});`, "", "const __ds_scope = {};", "", "(__ds_ns.__errors = __ds_ns.__errors || []);", "",
  "const __ds_run = () => {", "",
  ...order.map(block),
  ...[...components, ...hooks].map((c) => `__ds_ns.${c.name} = __ds_scope.${c.name};\n`),
  "};", "",
  "if (window.React) __ds_run();",
  'else { let r; Object.defineProperty(window, "React", { configurable: true, get: () => r, set: (v) => { r = v; Object.defineProperty(window, "React", { value: v, writable: true, configurable: true, enumerable: true }); __ds_run(); } }); }',
  "})();", "",
].join("\n");
writeFileSync(join(ROOT, "_ds_bundle.js"), out);

const mp = join(ROOT, "_ds_manifest.json");
const man = JSON.parse(readFileSync(mp, "utf8"));
man.components = components; man.hooks = hooks; man.unexposedExports = unexposed;
console.log(`bundle: ${order.length} files, ${components.length} components, ${hooks.length} hooks, ${unexposed.length} unexposed, ${(out.length / 1024).toFixed(0)} KB`);

// ── adherence 설정 ─────────────────────────────────────────────────────────
// _adherence.oxlintrc.json에서 출처가 있는 부분만 다시 만든다.
//   생성: x-omelette.tokens·tokenKinds(← tokens/*.css), x-omelette.components와 컴포넌트별
//         no-restricted-syntax 규칙(← components/**/*.d.ts), no-restricted-imports의 경로 목록(← components/ 디렉터리)
//   보존: plugins, overrides, react/forbid-elements, 전역 no-restricted-syntax 3개, x-omelette.fontFamilies
// tokenKinds는 각 tokens/*.css의 `@token-kinds` 원천 주석에서만 읽는다. 기존 생성물이나
// CSS 값에서 추정하지 않는다. 토큰이 주석에서 빠지면 빌드를 실패시켜 분류 누락을 조용히 허용하지 않는다.
const CFG = join(ROOT, "_adherence.oxlintrc.json");
const cfg = JSON.parse(readFileSync(CFG, "utf8"));
const x = cfg["x-omelette"];

const tokenValues = {}, declaredKinds = {};
for (const f of readdirSync(join(ROOT, "tokens")).sort()) {
  const raw = readFileSync(join(ROOT, "tokens", f), "utf8");
  parseTokenKinds(raw, declaredKinds);
  const css = stripComments(raw);
  for (const m of css.matchAll(/[{;\s](--[\w-]+)\s*:([^;}]*)/g)) if (!(m[1] in tokenValues)) tokenValues[m[1]] = m[2].trim();
}
const tokens = Object.keys(tokenValues).sort();
const kinds = {}, missingKinds = [];
for (const n of tokens) {
  if (!declaredKinds[n]) missingKinds.push(n); else kinds[n] = declaredKinds[n];
}
const staleKinds = Object.keys(declaredKinds).filter((n) => !tokenValues[n]);
if (missingKinds.length || staleKinds.length) {
  throw new Error(`tokenKinds 원천 불일치: 누락=${missingKinds.join(", ") || "없음"}; 정의되지 않은 주석=${staleKinds.join(", ") || "없음"}`);
}

// 매니페스트의 토큰 메타데이터도 생성물의 이전 목록을 재사용하지 않고 CSS에서 다시 만든다.
// 파서는 token-parser.mjs 하나뿐이고 검사도 같은 파서를 독립 fixture로 시험한다.
const manifestTokens = [];
for (const f of readdirSync(join(ROOT, "tokens")).sort()) {
  const raw = stripComments(readFileSync(join(ROOT, "tokens", f), "utf8"));
  for (const { name, value, scope } of parseTokenBlocks(raw)) {
    if (!kinds[name]) throw new Error(`tokenKinds 원천에 없는 토큰: ${name}`);
    const entry = { name, value, kind: kinds[name], definedIn: `tokens/${f}` };
    if (scope !== ":root") entry.scope = scope;
    manifestTokens.push(entry);
  }
}
// 블록 파서와 평면 스캔은 서로 독립적인 두 경로다. 결과가 갈라지면 :root 조건이나 블록 스캔이 선언을
// 놓치고 있다는 뜻이므로 조용히 넘기지 않는다.
const blockNames = new Set(manifestTokens.map((t) => t.name));
const flatOnly = tokens.filter((n) => !blockNames.has(n));
if (flatOnly.length) throw new Error(`블록 파서가 놓친 토큰: ${flatOnly.join(", ")}`);
const manifestKeys = new Set();
for (const entry of manifestTokens) {
  const key = `${entry.scope || ":root"}\u0000${entry.name}`;
  if (manifestKeys.has(key)) throw new Error(`매니페스트 토큰 중복: ${entry.scope || ":root"} ${entry.name}`);
  manifestKeys.add(key);
}
man.tokens = manifestTokens;
writeFileSync(mp, JSON.stringify(man));

// .d.ts: 컴포넌트 함수가 가리키는 props 타입을 인터페이스·상속·유니언·인라인 객체까지
// 따라간다. React의 HTMLAttributes 계열은 임의의 표준/aria/data 속성을 열어 둔 계약이므로
// 미지 속성 금지 규칙을 만들지 않고, 컴포넌트가 직접 선언한 문자열 유니언만 검사한다.
const stripTs = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const ifaces = {}, aliases = {}, functions = [], comps = [];
for (const p of walk(join(ROOT, "components")).filter((p) => p.endsWith(".d.ts")).sort()) {
  const src = stripTs(readFileSync(p, "utf8"));
  for (const m of src.matchAll(/(?:export\s+)?interface (\w+)([^\{]*)\{/g)) {
    let i = m.index + m[0].length, depth = 1;
    while (i < src.length && depth) { const c = src[i++]; if (c === "{") depth++; else if (c === "}") depth--; }
    ifaces[m[1]] = { body: src.slice(m.index + m[0].length, i - 1), extends: (m[2].match(/extends\s+([\s\S]*)$/) || [])[1] || "" };
  }
  for (const m of src.matchAll(/(?:export\s+)?type\s+(\w+)\s*=\s*/g)) {
    let i = m.index + m[0].length, depth = 0, quote = "";
    while (i < src.length) {
      const ch = src[i++];
      if (quote) { if (ch === quote) quote = ""; continue; }
      if (ch === "\"" || ch === "'") { quote = ch; continue; }
      if ("{[(".includes(ch)) depth++; else if ("}])".includes(ch)) depth--;
      if (ch === ";" && depth === 0) break;
    }
    aliases[m[1]] = src.slice(m.index + m[0].length, i - 1).trim();
  }
  // 공개 컴포넌트 선언은 두 가지다: 평범한 함수와, forwardRef 컴포넌트의 const 선언.
  // 둘 다 잡지 않으면 그 컴포넌트의 prop 규칙이 adherence 설정에서 통째로 빠진다.
  for (const m of src.matchAll(/^export declare function ([A-Z]\w*)(?:<[^>\n]+>)?\s*\(\s*props:\s*([^\)\n]+)\)/gm)) {
    comps.push(m[1]); functions.push({ name: m[1], type: m[2].trim() });
  }
  for (const m of src.matchAll(/^export declare const ([A-Z]\w*)\s*:\s*ForwardRefExoticComponent<\s*([A-Za-z_$][\w$]*)\s*&/gm)) {
    comps.push(m[1]); functions.push({ name: m[1], type: m[2].trim() });
  }
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
const splitTop = (s, delimiter) => {
  const out = []; let cur = "", depth = 0, quote = "";
  for (const ch of s) {
    if (quote) { cur += ch; if (ch === quote) quote = ""; continue; }
    if (ch === "\"" || ch === "'") { quote = ch; cur += ch; continue; }
    if ("<{[(".includes(ch)) depth++; else if (">}])".includes(ch)) depth--;
    if (ch === delimiter && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};
const emptyShape = () => ({ names: new Set(), literals: new Map(), banned: new Set(), open: false });
const mergeShape = (to, from) => {
  for (const n of from.names) to.names.add(n);
  for (const n of from.banned) to.banned.add(n);
  for (const [n, values] of from.literals) {
    if (!to.literals.has(n)) to.literals.set(n, new Set());
    for (const v of values) to.literals.get(n).add(v);
  }
  to.open ||= from.open;
  return to;
};
const shapeFromMembers = (members) => {
  const shape = emptyShape();
  for (const p of members) {
    shape.names.add(p.name);
    if (STR_UNION.test(p.type)) shape.literals.set(p.name, new Set(p.type.split("|").map((s) => s.trim().slice(1, -1))));
  }
  return shape;
};
const reactAttrs = /(?:HTMLAttributes|SVGProps|ButtonHTMLAttributes|InputHTMLAttributes|SelectHTMLAttributes|TextareaHTMLAttributes|AnchorHTMLAttributes)\s*</;
const resolving = new Set();
/* Omit을 reactAttrs보다 먼저 본다. 순서가 반대면 Omit<HTMLAttributes<..>, "x">가 reactAttrs에서 먼저 잡혀
   제외 목록이 사라진다. 해석하지 못한 타입은 조용히 빈 규칙이 되지 않고 빌드를 세운다. */
const resolveType = (raw, owner) => {
  const type = raw.trim();
  if (!type) return emptyShape();
  const omit = type.match(/^Omit\s*<([\s\S]+)>$/);
  if (omit) {
    const args = splitTop(omit[1], ","), out = resolveType(args[0] || "", owner);
    for (const n of (args[1] || "").match(/\b\w+\b/g) || []) { out.names.delete(n); out.literals.delete(n); out.banned.add(n); }
    return out;
  }
  if (reactAttrs.test(type)) return Object.assign(emptyShape(), { open: true });
  if (type.startsWith("{") && type.endsWith("}")) return shapeFromMembers(membersOf(type.slice(1, -1)));
  const union = splitTop(type, "|");
  if (union.length > 1) return union.reduce((out, part) => mergeShape(out, resolveType(part, owner)), emptyShape());
  const generic = type.match(/^([A-Za-z_]\w*)\s*<[\s\S]*>$/);
  if (generic && (aliases[generic[1]] || ifaces[generic[1]])) return resolveType(generic[1], owner);
  if (aliases[type]) {
    if (resolving.has(type)) return emptyShape();
    resolving.add(type); const out = resolveType(aliases[type], owner); resolving.delete(type); return out;
  }
  if (ifaces[type]) {
    if (resolving.has(type)) return emptyShape();
    resolving.add(type);
    const out = shapeFromMembers(membersOf(ifaces[type].body));
    for (const parent of splitTop(ifaces[type].extends, ",")) mergeShape(out, resolveType(parent, owner));
    resolving.delete(type); return out;
  }
  throw new Error(`prop 타입 해석 실패: <${owner}>의 "${type}". resolveType이 아는 문법으로 바꾸거나, 규칙 대상에서 빼야 하면 PROP_RULE_EXEMPT에 사유와 함께 넣으세요.`);
};
/* 규칙 대상에서 의도적으로 빼는 컴포넌트. 사유 없이 비는 일이 없도록 값에 사유를 적는다. */
const PROP_RULE_EXEMPT = {};
const propRules = [];
for (const c of comps) {
  const fn = functions.find((f) => f.name === c), shape = resolveType(fn?.type || `${c}Props`, c);
  const names = [...shape.names].sort();
  if (!shape.open && !names.length && !(c in PROP_RULE_EXEMPT)) {
    throw new Error(`<${c}>의 공개 prop을 하나도 찾지 못했습니다. .d.ts 선언을 확인하거나 PROP_RULE_EXEMPT에 사유와 함께 넣으세요.`);
  }
  if (!shape.open && names.length) propRules.push({ selector: `JSXOpeningElement[name.name='${c}'] > JSXAttribute > JSXIdentifier[name!=/^(?:${[...names, "key", "ref", "className", "style", "children"].join("|")})$/]`, message: `<${c}> doesn't accept that prop. Declared props: ${names.join(", ")}.` });
  // .d.ts가 Omit으로 뺀 prop은 열린 계약에서도 금지로 남긴다. 빼겠다고 선언만 하고 검사하지 않으면 선언이 거짓말이 된다.
  const banned = [...shape.banned].filter((n) => !shape.names.has(n)).sort();
  if (banned.length) propRules.push({ selector: `JSXOpeningElement[name.name='${c}'] > JSXAttribute > JSXIdentifier[name=/^(?:${banned.join("|")})$/]`, message: `<${c}> removes that prop from its base type. Not accepted: ${banned.join(", ")}.` });
  for (const [name, values] of shape.literals) {
    const vals = [...values];
    propRules.push({ selector: `JSXOpeningElement[name.name='${c}'] > JSXAttribute[name.name='${name}'] > Literal[value!=/^(?:${vals.join("|")})$/]`, message: `<${c}> ${name} must be one of ${vals.map((v) => `'${v}'`).join(" | ")}.` });
  }
}

const nrs = cfg.rules["no-restricted-syntax"];
cfg.rules["no-restricted-syntax"] = [nrs[0], ...nrs.slice(1).filter((r) => !r.selector.startsWith("JSXOpeningElement")), ...propRules];
cfg.rules["no-restricted-imports"][1].patterns[0].group = [...readdirSync(join(ROOT, "components")).sort().map((d) => `components/${d}/**`), "theme-toggle.js"];
x.components = Object.fromEntries(comps.map((c) => [c, { replaces: [] }]));
x.tokens = tokens;
x.tokenKinds = kinds;
const banner = "생성물. 직접 고치지 말고 tokens/*.css·components/**/*.d.ts를 고친 뒤 `node build-bundle.mjs`를 다시 실행한다. 토큰 종류는 각 tokens/*.css의 `/* @token-kinds ... */` 원천 주석으로 정한다. plugins·overrides·react/forbid-elements·전역 no-restricted-syntax 3개·x-omelette.fontFamilies만 손으로 유지한다.";
const { ["x-generated"]: _previousBanner, ...cfgWithoutBanner } = cfg;
const generatedCfg = { "x-generated": banner, ...cfgWithoutBanner };
if (Object.keys(generatedCfg)[0] !== "x-generated" || generatedCfg["x-generated"] !== banner) throw new Error("생성물 배너가 최신 원천 문구로 기록되지 않음");
writeFileSync(CFG, JSON.stringify(generatedCfg, null, 2));
console.log(`adherence: ${tokens.length} unique tokens (${manifestTokens.length} declarations across scopes), ${comps.length} components, ${propRules.length} prop rules`);
