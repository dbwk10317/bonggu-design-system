// design-sync 변환기 입력 준비. 재동기화 때 package-build.mjs 전에 먼저 돌린다.
//   1) dist/styles.css의 @import를 재귀로 인라인 → .cache/flat.css (cfg.cssEntry가 파일 하나만 받으므로)
//   2) components/**/<Name>.prompt.md → .cache/docs/<Name>.md (변환기의 슬러그 매칭이 ".prompt"를 이름의 일부로 읽으므로)
// 실행: node .design-sync/prep.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import { dirname, resolve, join, basename } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const CACHE = join(ROOT, ".design-sync/.cache");

const IMPORT_RE = /^\s*@import\s+(?:url\(\s*)?["']([^"')]+)["']\s*\)?\s*;\s*$/gm;
const inline = (file, seen = new Set()) => {
  if (seen.has(file)) return "";
  seen.add(file);
  return readFileSync(file, "utf8").replace(IMPORT_RE, (m, spec) =>
    /^(?:https?:|data:)/.test(spec) ? m : inline(resolve(dirname(file), spec), seen));
};
mkdirSync(CACHE, { recursive: true });
const css = inline(join(ROOT, "dist/styles.css"));
writeFileSync(join(CACHE, "flat.css"), css);
console.log(`flat.css: ${(css.length / 1024).toFixed(0)} KB`);

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const docs = join(CACHE, "docs");
rmSync(docs, { recursive: true, force: true });
mkdirSync(docs, { recursive: true });
const found = walk(join(ROOT, "components")).filter((p) => p.endsWith(".prompt.md"));
for (const p of found) writeFileSync(join(docs, basename(p).replace(/\.prompt\.md$/, ".md")), readFileSync(p));
console.log(`docs: ${found.length} file(s)`);
