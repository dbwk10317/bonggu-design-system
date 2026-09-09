/* tokens/*.css를 읽는 유일한 파서. 빌드(build-bundle.mjs)와 검사(tests/manifest-token-regressions.cjs)가
   같은 코드를 두 벌 갖고 있으면 같은 잘못된 가정을 공유해 함께 틀려도 통과한다. 그래서 파서는 여기 하나뿐이고,
   검사는 이 파서를 독립 fixture와 기대값으로 시험한다(tests/fixtures/token-parser).

   scope 문자열은 선택자와 중첩된 @media 조건을 함께 보존한다. 한 블록을 여러 선택자가 공유하면 첫 선택자를
   대표값으로 쓰되 블록 안의 선언은 한 번만 기록한다. */

export const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "");

/** :root 계열 블록의 커스텀 프로퍼티 선언을 선언 순서대로 낸다. 값은 { name, value, scope }. */
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

/** 블록 구조를 보지 않는 평면 스캔. 블록 파서가 :root 조건 때문에 놓친 선언을 교차 검증하는 용도다. */
export function scanTokenNames(text) {
  const names = new Set();
  for (const m of stripComments(text).matchAll(/[{;\s](--[\w-]+)\s*:([^;}]*)/g)) names.add(m[1]);
  return names;
}

/** @token-kinds 원천 주석. { name: kind } 하나로 합치고 중복은 던진다. */
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
