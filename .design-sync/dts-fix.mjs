// 변환기가 낸 ds-bundle/components/**/<Name>.d.ts를 자기완결형으로 만든다.
//
// 변환기의 두 가지 손실을 메운다.
//   (1) prop 타입을 이름으로만 적고(예: `columns: DataTableColumn<T>[]`) 그 이름의 선언을 넣지 않는다.
//       React 타입(`ReactNode`·`Key`·`CSSProperties`)도 `React.` 없이 나온다.
//   (2) `<Name>Props`가 판별 유니온이면 공통 베이스만 남기고 각 갈래의 prop을 통째로 잃는다
//       (Chart: series·labels·segments·value·axes·samples가 전부 사라졌다).
// 둘 다 조용히 일어나고, 결과는 디자인 에이전트가 읽는 API 계약의 구멍이다.
//
// 정규식으로 추측하지 않는다. (1)은 TypeScript에게 "찾을 수 없는 이름"을 직접 물어 고치고,
// (2)는 소스 AST에서 유니온 갈래를 읽어 병합한다. 둘 다 저장소 소스가 정본이라 손으로 베낀 사본이 없다.
//
// _ds_sync.json은 .d.ts를 해싱하지 않으므로(renderHashFor=_preview+html, auxShaFor=guidelines+README)
// 빌드 뒤에 돌려도 앵커가 상하지 않는다. 실행: package-build.mjs 다음, package-validate.mjs 앞.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const OUT = process.argv[2] ? resolve(process.argv[2]) : join(ROOT, "ds-bundle");
// 저장소의 typescript는 7.x(네이티브 포트)라 JS 컴파일러 API가 없다.
// 변환기가 쓰는 .ds-sync/의 ts-morph가 번들한 ts를 그대로 빌려 쓴다.
const require = createRequire(join(ROOT, ".ds-sync/x.js"));
const { Project, ts } = require("ts-morph");

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

// ── 저장소 소스 .d.ts의 최상위 타입 선언 색인 ───────────────────────────────────
const declText = new Map();  // 이름 -> 선언 텍스트 (덧붙이기용)
const declNode = new Map();  // 이름 -> { node, sf } (유니온 병합용)
for (const file of walk(join(ROOT, "components")).filter((p) => p.endsWith(".d.ts"))) {
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  for (const st of sf.statements) {
    if (!ts.isInterfaceDeclaration(st) && !ts.isTypeAliasDeclaration(st) && !ts.isEnumDeclaration(st)) continue;
    const name = st.name.getText(sf);
    if (declText.has(name)) continue;
    let text = st.getText(sf);
    if (!/^export\b/.test(text)) text = "export " + text;
    declText.set(name, text);
    declNode.set(name, { node: st, sf });
  }
}

// ── (2) 판별 유니온 props 평탄화 ────────────────────────────────────────────────
const jsdocOf = (m) => (m.jsDoc?.length ? String(m.jsDoc[m.jsDoc.length - 1].comment ?? "").trim() : "");

// 인터페이스의 프로퍼티를 로컬 extends 체인까지 따라가며 모은다.
function propsOfInterface(name, seen = new Set()) {
  const hit = declNode.get(name);
  if (!hit || seen.has(name) || !ts.isInterfaceDeclaration(hit.node)) return [];
  seen.add(name);
  const { node, sf } = hit;
  const inherited = (node.heritageClauses ?? [])
    .flatMap((h) => h.types.map((t) => t.expression.getText(sf)))
    .flatMap((n) => propsOfInterface(n, seen));
  const own = node.members.filter(ts.isPropertySignature).map((m) => ({
    key: m.name.getText(sf),
    optional: !!m.questionToken,
    type: m.type ? m.type.getText(sf) : "unknown",
    doc: jsdocOf(m),
  }));
  return [...inherited, ...own];
}

// `export type XProps = A | B | C` 를 하나의 인터페이스 본문으로 병합한다.
// 모든 갈래에 같은 타입으로 있는 prop만 필수로 남기고, 나머지는 선택으로 내리되
// 어느 kind의 것인지 JSDoc에 적는다(에이전트가 잘못 조합하지 않도록).
function flattenUnionProps(compName) {
  const hit = declNode.get(`${compName}Props`);
  if (!hit || !ts.isTypeAliasDeclaration(hit.node) || !ts.isUnionTypeNode(hit.node.type)) return null;
  const memberNames = hit.node.type.types
    .filter(ts.isTypeReferenceNode)
    .map((t) => t.typeName.getText(hit.sf));
  if (memberNames.length < 2) return null;

  const branches = memberNames.map((n) => ({ name: n, props: propsOfInterface(n) }));
  if (branches.some((b) => b.props.length === 0)) return null;

  // 갈래를 사람이 읽는 이름으로: kind 리터럴이 있으면 그걸 쓴다.
  const labelOf = (b) => {
    const k = b.props.find((p) => p.key === "kind");
    return k ? k.type.replace(/["\s]/g, "") : b.name.replace(/(Chart)?Props$/, "");
  };

  const order = [];
  const byKey = new Map();
  for (const b of branches) {
    for (const p of b.props) {
      if (!byKey.has(p.key)) { byKey.set(p.key, []); order.push(p.key); }
      byKey.get(p.key).push({ ...p, branch: labelOf(b) });
    }
  }

  const lines = [];
  for (const key of order) {
    const hits = byKey.get(key);
    const universal = hits.length === branches.length;
    const types = [...new Set(hits.map((h) => h.type))];
    const type = types.length === 1 ? types[0] : types.join(" | ");
    const optional = !universal || hits.some((h) => h.optional);
    const doc = hits.map((h) => h.doc).find(Boolean) ?? "";
    const where = universal ? "" : `${hits.map((h) => h.branch).join(" · ")} 전용.`;
    const comment = [where, doc].filter(Boolean).join(" ");
    if (comment) lines.push(`  /** ${comment} */`);
    lines.push(`  ${key}${optional ? "?" : ""}: ${type};`);
  }
  return { body: lines.join("\n"), branches: branches.length };
}

// ── React 네임스페이스로 넘길 이름들 ────────────────────────────────────────────
const REACT_TYPES = new Set([
  "ReactNode", "ReactElement", "ReactPortal", "CSSProperties", "Key", "Ref", "RefObject",
  "ComponentType", "JSXElementConstructor", "ElementType", "MouseEvent", "KeyboardEvent",
  "ChangeEvent", "FormEvent", "FocusEvent", "DragEvent", "ClipboardEvent", "SyntheticEvent",
  "HTMLAttributes", "ButtonHTMLAttributes", "InputHTMLAttributes", "AriaAttributes",
]);
// React 내부 전용 타입 — 공개 API가 아니다. ref prop을 단순화한다.
const REACT_INTERNAL = /\bstring \| \(\(instance: (\w+)\) => void \| DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES\[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES\]\) \| RefObject<\w+>/g;

const files = walk(join(OUT, "components")).filter((p) => p.endsWith(".d.ts"));
const norm = (p) => p.replace(/\\/g, "/").toLowerCase();
const fileSet = new Set(files.map(norm));

// 진단 전에 한 번: ref prop 단순화 + 유니온 props 평탄화.
const flattened = [];
for (const f of files) {
  const name = basename(f, ".d.ts");
  let src = readFileSync(f, "utf8").replace(REACT_INTERNAL, (_m, el) => `React.Ref<${el}>`);
  const flat = flattenUnionProps(name);
  if (flat) {
    const re = new RegExp(`(export interface ${name}Props[^{]*\\{)[\\s\\S]*?\\n\\}`);
    if (re.test(src)) {
      src = src.replace(re, `export interface ${name}Props {\n${flat.body}\n}`);
      flattened.push(`${name}(${flat.branches})`);
    }
  }
  writeFileSync(f, src);
}

const diagnose = () => {
  const project = new Project({
    compilerOptions: {
      // .d.ts는 선언 파일이라 skipLibCheck가 켜져 있으면 검사 자체를 건너뛴다.
      noEmit: true, skipLibCheck: false, strict: false,
      target: ts.ScriptTarget.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
      lib: ["lib.esnext.d.ts", "lib.dom.d.ts"], types: [],
      baseUrl: join(ROOT, ".ds-sync"),
    },
  });
  project.addSourceFilesAtPaths(files);
  const missing = new Map(); // file -> Set(name)
  for (const d of project.getPreEmitDiagnostics()) {
    const code = d.getCode();
    if (code !== 2304 && code !== 2552) continue; // Cannot find name / did you mean
    const name = /Cannot find name '([^']+)'/.exec(ts.flattenDiagnosticMessageText(d.getMessageText(), " "))?.[1];
    const sf = d.getSourceFile();
    if (!name || !sf) continue;
    const path = sf.getFilePath();
    if (!fileSet.has(norm(path))) continue; // 우리 파일만. @types/react 등 라이브러리 진단은 무시
    if (!missing.has(path)) missing.set(path, new Set());
    missing.get(path).add(name);
  }
  return missing;
};

// ── (1) 미해결 이름을 없어질 때까지 메운다 ──────────────────────────────────────
const unresolved = new Set();
for (let pass = 1; pass <= 6; pass++) {
  const missing = diagnose();
  if (missing.size === 0) break;
  let changed = 0;
  for (const [file, names] of missing) {
    let src = readFileSync(file, "utf8");
    const add = [];
    for (const name of names) {
      if (REACT_TYPES.has(name)) {
        // 타입 위치의 홑이름만. 이미 React.가 붙은 것과 프로퍼티 이름은 건드리지 않는다.
        src = src.replace(new RegExp(`(?<![.\\w])${name}\\b`, "g"), `React.${name}`);
        changed++;
      } else if (declText.has(name)) {
        add.push(declText.get(name));
        changed++;
      } else {
        unresolved.add(`${basename(file)}: ${name}`);
      }
    }
    if (add.length) src = src.replace(/\n*$/, "\n\n") + add.join("\n\n") + "\n";
    writeFileSync(file, src);
  }
  if (!changed) break;
  if (pass === 6) console.log("dts-fix: hit pass cap");
}

// 덧붙인 선언 안의 React 타입도 자격을 갖춰야 하므로 마지막 진단으로 확인한다.
const left = diagnose();
const total = [...left.values()].reduce((n, s) => n + s.size, 0);
console.log(`dts-fix: ${files.length} file(s), ${declText.size} source type(s) indexed`);
console.log(`  union props flattened: ${flattened.length ? flattened.join(", ") : "(none)"}`);
console.log(`  unresolved names: ${total}`);
if (unresolved.size) console.log("  !", [...unresolved].slice(0, 20).join(" | "));
for (const [f, names] of left) console.log("  !", basename(f), [...names].join(", "));
if (total > 0) process.exitCode = 1;
