// _ds_manifest.json의 토큰 메타데이터가 tokens/*.css의 실제 선언과 같은지 확인한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function tokenBlocks(text, atRules = [], out = []) {
  let cursor = 0;
  while (cursor < text.length) {
    const open = text.indexOf('{', cursor);
    if (open < 0) break;
    const header = text.slice(cursor, open).trim();
    let i = open + 1;
    let depth = 1;
    let quote = '';
    while (i < text.length && depth) {
      const ch = text[i++];
      if (quote) {
        if (ch === quote) quote = '';
        continue;
      }
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
    }
    const body = text.slice(open + 1, i - 1);
    if (header.startsWith('@')) tokenBlocks(body, [...atRules, header], out);
    else if (header.includes(':root')) {
      const selector = header.split(',')[0].trim();
      const scope = [...atRules, selector].join(' ').trim();
      for (const match of body.matchAll(/(--[\w-]+)\s*:([^;{}]*)/g)) {
        out.push({
          name: match[1],
          value: match[2].trim(),
          scope: scope === ':root' ? '' : scope,
        });
      }
    }
    cursor = i;
  }
  return out;
}

const expected = [];
for (const file of fs.readdirSync(path.join(root, 'tokens')).filter((name) => name.endsWith('.css')).sort()) {
  const source = fs.readFileSync(path.join(root, 'tokens', file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const entry of tokenBlocks(source)) {
    entry.definedIn = `tokens/${file}`;
    expected.push(entry);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, '_ds_manifest.json'), 'utf8'));
const adherence = JSON.parse(fs.readFileSync(path.join(root, '_adherence.oxlintrc.json'), 'utf8'));
const tokenKinds = adherence['x-omelette'].tokenKinds;
const key = (entry) => `${entry.scope || ':root'}\u0000${entry.name}`;
const expectedByKey = new Map();
for (const entry of expected) {
  const k = key(entry);
  assert(!expectedByKey.has(k), `CSS token declaration duplicated: ${k}`);
  expectedByKey.set(k, entry);
}
const actualByKey = new Map();
for (const entry of manifest.tokens || []) {
  const k = key(entry);
  assert(!actualByKey.has(k), `manifest token duplicated: ${k}`);
  actualByKey.set(k, entry);
}

assert.deepEqual([...actualByKey.keys()].sort(), [...expectedByKey.keys()].sort(), 'manifest tokens differ from CSS declarations');
for (const [k, expectedEntry] of expectedByKey) {
  const actual = actualByKey.get(k);
  assert.equal(actual.value, expectedEntry.value, `manifest token value differs: ${k}`);
  assert.equal(actual.definedIn, expectedEntry.definedIn, `manifest token source differs: ${k}`);
  assert.equal(actual.kind, tokenKinds[actual.name], `manifest token kind differs: ${k}`);
}

console.log(`PASS manifest token sync: ${expected.length} declarations`);
