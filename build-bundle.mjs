// Builds _ds_bundle.js: components/**/*.{jsx,js} + theme-toggle.js, transformed with Babel (react preset) into one file.
// Run: node build-bundle.mjs   (@babel/standalone is hoisted to the root node_modules; BABEL_STANDALONE=<path> only overrides that lookup)
// Writes: _ds_bundle.js (header JSON: components, hooks, sourceHashes), _ds_manifest.json (components, hooks, unexposedExports, tokens),
//         _adherence.oxlintrc.json (derived parts only; see "adherence config" below)
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { join, relative, dirname, resolve } from "node:path";
import { parseTokenBlocks, parseTokenKinds, stripComments } from "./token-parser.mjs";

const ROOT = dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const NS = "Ds_d3ea90";
const require = createRequire(import.meta.url);
// debug inside @babel/standalone reads bare localStorage at load, which makes Node emit an ExperimentalWarning; mask it with an inert stub before requiring Babel.
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

// Dependency order (imported files first); alphabetical by path within a level.
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

const exposed = (n) => /^[A-Z]/.test(n) && !/^[A-Z0-9_]+$/.test(n); // component names; SCREAMING_CASE constants stay in __ds_scope only
// Public hooks go on the namespace too (not in the components list): without that, script-bundle consumers
// can't call them and ad-hoc side APIs like ToastProvider.useToast appear. Only hooks exported by
// public-entry.js count, so module-internal hooks don't widen the public surface.
const PUBLIC = new Set([...readFileSync(join(ROOT, "public-entry.js"), "utf8").matchAll(/^export {([^}]*)}/gm)]
  .flatMap((m) => m[1].split(",").map((s) => s.trim().split(/s+ass+/).pop())));
const isHook = (n) => /^use[A-Z]/.test(n) && PUBLIC.has(n);
const components = [], hooks = [], unexposed = [];
for (const p of files) for (const n of info[p].exports) (exposed(n) ? components : isHook(n) ? hooks : unexposed).push({ name: n, sourcePath: p });
unexposed.sort((a, b) => a.name.localeCompare(b.name));
const sourceHashes = Object.fromEntries(files.map((p) => [p, createHash("sha256").update(readFileSync(join(ROOT, p))).digest("hex").slice(0, 12)]));
const header = { format: 4, namespace: NS, components, sourceHashes, inlinedExternals: [], unexposedExports: unexposed, hooks };

// Some pages (the template loader) load React as a UMD global after the bundle: if React is absent, defer evaluation until window.React is assigned.
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

// ── adherence config ───────────────────────────────────────────────────────
// Regenerates only the sourced parts of _adherence.oxlintrc.json.
//   generated: x-omelette.tokens/tokenKinds (← tokens/*.css), x-omelette.components and per-component
//              no-restricted-syntax rules (← components/**/*.d.ts), no-restricted-imports path list (← components/ dirs)
//   preserved: plugins, overrides, react/forbid-elements, the 3 global no-restricted-syntax rules, x-omelette.fontFamilies
// tokenKinds come only from the `@token-kinds` comments, never from previous output or CSS values;
// a missing kind fails the build. See RULE.md "생성과 검증".
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

// Manifest token metadata is rebuilt from CSS too, never reused from previous output.
// token-parser.mjs is the single parser (see RULE.md "생성과 검증").
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
// Block parser and flat scan are independent paths; a divergence means the :root condition or block scan
// missed a declaration, so fail loudly.
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

// .d.ts: follow each component's props type through interfaces, extends, unions and inline objects.
// React's HTMLAttributes family is an open contract (any standard/aria/data attribute), so it gets no
// unknown-prop rule; only string unions the component declares itself are checked.
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
  // Public components are declared two ways: plain functions and forwardRef consts.
  // Missing either drops that component's prop rules from the adherence config entirely.
  for (const m of src.matchAll(/^export declare function ([A-Z]\w*)(?:<[^>\n]+>)?\s*\(\s*props:\s*([^\)\n]+)\)/gm)) {
    comps.push(m[1]); functions.push({ name: m[1], type: m[2].trim() });
  }
  for (const m of src.matchAll(/^export declare const ([A-Z]\w*)\s*:\s*ForwardRefExoticComponent<\s*([A-Za-z_$][\w$]*)\s*&/gm)) {
    comps.push(m[1]); functions.push({ name: m[1], type: m[2].trim() });
  }
}
comps.sort();

// Interface body → members. Split on depth-0 `;` only (`<`/`>` aren't counted because of arrow functions).
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
/* Check Omit before reactAttrs: otherwise Omit<HTMLAttributes<..>, "x"> matches reactAttrs first and the
   exclusion list is lost. Unresolved types fail the build instead of silently becoming empty rules. */
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
/* Components deliberately excluded from prop rules; the value is the reason (never left empty). */
const PROP_RULE_EXEMPT = {};
const propRules = [];
for (const c of comps) {
  const fn = functions.find((f) => f.name === c), shape = resolveType(fn?.type || `${c}Props`, c);
  const names = [...shape.names].sort();
  if (!shape.open && !names.length && !(c in PROP_RULE_EXEMPT)) {
    throw new Error(`<${c}>의 공개 prop을 하나도 찾지 못했습니다. .d.ts 선언을 확인하거나 PROP_RULE_EXEMPT에 사유와 함께 넣으세요.`);
  }
  if (!shape.open && names.length) propRules.push({ selector: `JSXOpeningElement[name.name='${c}'] > JSXAttribute > JSXIdentifier[name!=/^(?:${[...names, "key", "ref", "className", "style", "children"].join("|")})$/]`, message: `<${c}> doesn't accept that prop. Declared props: ${names.join(", ")}.` });
  // Props the .d.ts removes via Omit stay banned even on open contracts; an unchecked Omit makes the declaration a lie.
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
const banner = "Generated. Do not edit by hand: change tokens/*.css or components/**/*.d.ts and rerun `node build-bundle.mjs`. Token kinds come from the `/* @token-kinds ... */` comment in each tokens/*.css. Only plugins, overrides, react/forbid-elements, the 3 global no-restricted-syntax rules and x-omelette.fontFamilies are maintained by hand.";
const { ["x-generated"]: _previousBanner, ...cfgWithoutBanner } = cfg;
const generatedCfg = { "x-generated": banner, ...cfgWithoutBanner };
if (Object.keys(generatedCfg)[0] !== "x-generated" || generatedCfg["x-generated"] !== banner) throw new Error("생성물 배너가 최신 원천 문구로 기록되지 않음");
writeFileSync(CFG, JSON.stringify(generatedCfg, null, 2));
console.log(`adherence: ${tokens.length} unique tokens (${manifestTokens.length} declarations across scopes), ${comps.length} components, ${propRules.length} prop rules`);
