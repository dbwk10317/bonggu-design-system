// Makes the transformer's ds-bundle/components/**/<Name>.d.ts self-contained.
//
// The transformer silently loses two things, leaving holes in the API contract the design agent reads:
//   (1) prop types are referenced by name only (e.g. `columns: DataTableColumn<T>[]`) with no declaration,
//       and React types (`ReactNode`, `Key`, `CSSProperties`) come out without the `React.` prefix.
//   (2) a discriminated-union `<Name>Props` keeps only the common base; every branch's props vanish
//       (Chart lost series, labels, segments, value, axes, samples).
//
// No regex guessing: (1) asks TypeScript for "cannot find name" diagnostics and fixes those; (2) reads the
// union branches from the source AST and merges them. Repo source is canonical in both; no hand-copied duplicates.
//
// _ds_sync.json doesn't hash .d.ts (renderHashFor=_preview+html, auxShaFor=guidelines+README), so running
// after the build doesn't break anchors. Order: after package-build.mjs, before package-validate.mjs.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const OUT = process.argv[2] ? resolve(process.argv[2]) : join(ROOT, "ds-bundle");
// The repo's typescript is 7.x (native port) and has no JS compiler API;
// borrow the ts bundled by the transformer's ts-morph in .ds-sync/.
const require = createRequire(join(ROOT, ".ds-sync/x.js"));
const { Project, ts } = require("ts-morph");

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

// ── Index top-level type declarations from repo source .d.ts ──────────────────
const declText = new Map();  // name -> declaration text (for appending)
const declNode = new Map();  // name -> { node, sf } (for union merging)
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

// ── (2) Flatten discriminated-union props ──────────────────────────────────────
const jsdocOf = (m) => (m.jsDoc?.length ? String(m.jsDoc[m.jsDoc.length - 1].comment ?? "").trim() : "");

// Collects an interface's properties, following the local extends chain.
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

// Merges `export type XProps = A | B | C` into one interface body. Props present in every branch stay
// required; the rest become optional, with the owning kind noted in JSDoc so the agent doesn't mix branches.
function flattenUnionProps(compName) {
  const hit = declNode.get(`${compName}Props`);
  if (!hit || !ts.isTypeAliasDeclaration(hit.node) || !ts.isUnionTypeNode(hit.node.type)) return null;
  const memberNames = hit.node.type.types
    .filter(ts.isTypeReferenceNode)
    .map((t) => t.typeName.getText(hit.sf));
  if (memberNames.length < 2) return null;

  const branches = memberNames.map((n) => ({ name: n, props: propsOfInterface(n) }));
  if (branches.some((b) => b.props.length === 0)) return null;

  // Human-readable branch label: the kind literal when present.
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

// ── Names to qualify with the React namespace ──────────────────────────────────
const REACT_TYPES = new Set([
  "ReactNode", "ReactElement", "ReactPortal", "CSSProperties", "Key", "Ref", "RefObject",
  "ComponentType", "JSXElementConstructor", "ElementType", "MouseEvent", "KeyboardEvent",
  "ChangeEvent", "FormEvent", "FocusEvent", "DragEvent", "ClipboardEvent", "SyntheticEvent",
  "HTMLAttributes", "ButtonHTMLAttributes", "InputHTMLAttributes", "AriaAttributes",
]);
// React-internal type, not public API; simplifies the ref prop.
const REACT_INTERNAL = /\bstring \| \(\(instance: (\w+)\) => void \| DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES\[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES\]\) \| RefObject<\w+>/g;

const files = walk(join(OUT, "components")).filter((p) => p.endsWith(".d.ts"));
const norm = (p) => p.replace(/\\/g, "/").toLowerCase();
const fileSet = new Set(files.map(norm));

// One pass before diagnosing: simplify ref props + flatten union props.
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
      // .d.ts are declaration files; with skipLibCheck on they wouldn't be checked at all.
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
    if (!fileSet.has(norm(path))) continue; // our files only; ignore diagnostics from @types/react etc.
    if (!missing.has(path)) missing.set(path, new Set());
    missing.get(path).add(name);
  }
  return missing;
};

// ── (1) Fill unresolved names until none remain ────────────────────────────────
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
        // Bare names in type position only; leave already-qualified React.X and property names alone.
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

// Appended declarations may contain React types that also need qualifying, so diagnose once more.
const left = diagnose();
const total = [...left.values()].reduce((n, s) => n + s.size, 0);
console.log(`dts-fix: ${files.length} file(s), ${declText.size} source type(s) indexed`);
console.log(`  union props flattened: ${flattened.length ? flattened.join(", ") : "(none)"}`);
console.log(`  unresolved names: ${total}`);
if (unresolved.size) console.log("  !", [...unresolved].slice(0, 20).join(" | "));
for (const [f, names] of left) console.log("  !", basename(f), [...names].join(", "));
if (total > 0) process.exitCode = 1;
