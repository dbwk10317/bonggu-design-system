/* The only parser for tokens/*.css, shared by the build (build-bundle.mjs) and the checks
   (tests/manifest-token-regressions.cjs, against independent fixtures in tests/fixtures/token-parser).
   See RULE.md "생성과 검증".

   scope keeps the selector plus any enclosing @media conditions. When several selectors share a block,
   the first one is the representative and each declaration is recorded once. */

export const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "");

/** Custom-property declarations from :root-family blocks, in declaration order, as { name, value, scope }. */
export function parseTokenBlocks(text, atRules = [], out = []) {
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
    if (header.startsWith("@")) parseTokenBlocks(body, [...atRules, header], out);
    else if (header.includes(":root")) {
      const selector = header.split(",")[0].trim();
      const scope = [...atRules, selector].join(" ").trim();
      for (const m of body.matchAll(/(--[\w-]+)\s*:([^;{}]*)/g)) out.push({ name: m[1], value: m[2].trim(), scope });
    }
    cursor = i;
  }
  return out;
}

/** Flat scan that ignores block structure; cross-checks declarations the block parser's :root condition may miss. */
export function scanTokenNames(text) {
  const names = new Set();
  for (const m of stripComments(text).matchAll(/[{;\s](--[\w-]+)\s*:([^;}]*)/g)) names.add(m[1]);
  return names;
}

/** @token-kinds source comments merged into one { name: kind }; duplicates throw. */
export function parseTokenKinds(text, into = {}) {
  for (const block of text.matchAll(/\/\*\s*@token-kinds([\s\S]*?)\*\//g)) {
    for (const line of block[1].split(/\r?\n/)) {
      const row = line.match(/^\s*(\w+)\s*:\s*(.*)$/);
      if (!row) continue;
      for (const name of row[2].match(/--[\w-]+/g) || []) {
        if (Object.hasOwn(into, name)) throw new Error(`토큰 종류 중복: ${name} (${into[name]}와 ${row[1]})`);
        into[name] = row[1];
      }
    }
  }
  return into;
}
