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
console.log(`bundle: ${order.length} files, ${components.length} components, ${unexposed.length} unexposed, ${(out.length / 1024).toFixed(0)} KB`);

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
  for (const m of raw.matchAll(/\/\*\s*@token-kinds([\s\S]*?)\*\//g)) {
    for (const line of m[1].split(/\r?\n/)) {
      const row = line.match(/^\s*(\w+)\s*:\s*(.*)$/);
      if (!row) continue;
      for (const n of row[2].match(/--[\w-]+/g) || []) {
        if (Object.hasOwn(declaredKinds, n)) throw new Error(`토큰 종류 중복: ${n} (${declaredKinds[n]}와 ${row[1]})`);
        declaredKinds[n] = row[1];
      }
    }
  }
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, "");
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
// 스키마의 scope 문자열은 선택자와 중첩된 @media 조건을 함께 보존한다. 여러 선택자가 한
// 블록을 공유하면 첫 선택자를 대표값으로 사용하되, 블록 안의 모든 선언은 한 번만 기록한다.
const manifestTokens = [], tokenBlocks = (text, atRules = []) => {
  let cursor = 0;
  while (cursor < text.length) {
    const open = text.indexOf("{", cursor);
    if (open < 0) break;
    const header = text.slice(cursor, open).trim();
    let i = open + 1, depth = 1, quote = "";
    while (i < text.length && depth) {
      const ch = text[i++];
      if (quote) { if (ch === quote) quote = ""; continue; }
      if (ch === "\"" || ch === "'") { quote = ch; continue; }
      if (ch === "{") depth++; else if (ch === "}") depth--;
    }
    const body = text.slice(open + 1, i - 1);
    if (header.startsWith("@")) tokenBlocks(body, [...atRules, header]);
    else if (header.includes(":root")) {
      const selector = header.split(",")[0].trim();
      const scope = [...atRules, selector].join(" ").trim();
      for (const m of body.matchAll(/(--[\w-]+)\s*:([^;{}]*)/g)) {
        const name = m[1];
        if (!kinds[name]) throw new Error(`tokenKinds 원천에 없는 토큰: ${name}`);
        const entry = { name, value: m[2].trim(), kind: kinds[name], definedIn: "" };
        if (scope !== ":root") entry.scope = scope;
        manifestTokens.push(entry);
      }
    }
    cursor = i;
  }
};
for (const f of readdirSync(join(ROOT, "tokens")).sort()) {
  const raw = readFileSync(join(ROOT, "tokens", f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const before = manifestTokens.length;
  tokenBlocks(raw);
  for (const entry of manifestTokens.slice(before)) entry.definedIn = `tokens/${f}`;
}
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
  for (const m of src.matchAll(/^export declare function ([A-Z]\w*)(?:<[^>\n]+>)?\s*\(\s*props:\s*([^\)\n]+)\)/gm)) {
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
const emptyShape = () => ({ names: new Set(), literals: new Map(), open: false });
const mergeShape = (to, from) => {
  for (const n of from.names) to.names.add(n);
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
const resolveType = (raw) => {
  const type = raw.trim();
  if (reactAttrs.test(type)) return Object.assign(emptyShape(), { open: true });
  if (type.startsWith("{") && type.endsWith("}")) return shapeFromMembers(membersOf(type.slice(1, -1)));
  const union = splitTop(type, "|");
  if (union.length > 1) return union.reduce((out, part) => mergeShape(out, resolveType(part)), emptyShape());
  const omit = type.match(/^Omit\s*<([\s\S]+)>$/);
  if (omit) {
    const args = splitTop(omit[1], ","), out = resolveType(args[0] || "");
    for (const n of (args[1] || "").match(/\b\w+\b/g) || []) { out.names.delete(n); out.literals.delete(n); }
    return out;
  }
  const generic = type.match(/^([A-Za-z_]\w*)\s*<[^>]*>$/);
  if (generic && (aliases[generic[1]] || ifaces[generic[1]])) return resolveType(generic[1]);
  if (aliases[type] && !resolving.has(type)) {
    resolving.add(type); const out = resolveType(aliases[type]); resolving.delete(type); return out;
  }
  if (ifaces[type] && !resolving.has(type)) {
    resolving.add(type);
    const out = shapeFromMembers(membersOf(ifaces[type].body));
    for (const parent of splitTop(ifaces[type].extends, ",")) mergeShape(out, resolveType(parent));
    resolving.delete(type); return out;
  }
  return emptyShape();
};
const propRules = [];
for (const c of comps) {
  const fn = functions.find((f) => f.name === c), shape = resolveType(fn?.type || `${c}Props`);
  const names = [...shape.names].sort();
  if (!shape.open) propRules.push({ selector: `JSXOpeningElement[name.name='${c}'] > JSXAttribute > JSXIdentifier[name!=/^(?:${[...names, "key", "ref", "className", "style", "children"].join("|")})$/]`, message: `<${c}> doesn't accept that prop. Declared props: ${names.join(", ")}.` });
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
console.log(`adherence: ${tokens.length} tokens(@kind ${Object.keys(declaredKinds).length}), ${comps.length} components, ${propRules.length} prop rules`);
