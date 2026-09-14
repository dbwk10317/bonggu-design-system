// See RULE.md "동작 계약" (생성과 검증): one parser, token-parser.mjs, tested against an independent fixture,
// then used to compare _ds_manifest.json with tokens/*.css. A second parser would share the same wrong assumptions.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

async function main() {
  const { parseTokenBlocks, parseTokenKinds, scanTokenNames, stripComments } = await import('../token-parser.mjs');

  // 1. Parser itself. Expected values are hand-written, independent of the repo's real tokens.
  const fixtureDir = path.join(__dirname, 'fixtures', 'token-parser');
  const fixture = fs.readFileSync(path.join(fixtureDir, 'sample.css'), 'utf8');
  const expectedParse = JSON.parse(fs.readFileSync(path.join(fixtureDir, 'expected.json'), 'utf8'));
  assert.deepEqual(parseTokenBlocks(stripComments(fixture)), expectedParse.blocks, 'fixture 블록 파싱');
  assert.deepEqual([...scanTokenNames(fixture)].sort(), expectedParse.flatNames.sort(), 'fixture 평면 스캔');
  assert.deepEqual(parseTokenKinds(fixture), expectedParse.kinds, 'fixture @token-kinds 파싱');
  assert.throws(() => parseTokenKinds('/* @token-kinds\n   a: --dup\n   b: --dup\n*/'), /토큰 종류 중복/, '분류 중복은 던진다');

  // 2. Same parser: generated manifest vs source.
  const expected = [];
  for (const file of fs.readdirSync(path.join(root, 'tokens')).filter((name) => name.endsWith('.css')).sort()) {
    const source = stripComments(fs.readFileSync(path.join(root, 'tokens', file), 'utf8'));
    for (const entry of parseTokenBlocks(source)) {
      expected.push({ name: entry.name, value: entry.value, scope: entry.scope === ':root' ? '' : entry.scope, definedIn: `tokens/${file}` });
    }
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(root, '_ds_manifest.json'), 'utf8'));
  const adherence = JSON.parse(fs.readFileSync(path.join(root, '_adherence.oxlintrc.json'), 'utf8'));
  const tokenKinds = adherence['x-omelette'].tokenKinds;
  const key = (entry) => `${entry.scope || ':root'}\\u0000${entry.name}`;
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

  // 3. Every token must sit in a :root-family block. The block parser cannot see declarations elsewhere,
  //    so anything the flat scan finds beyond it would silently drop out of the manifest.
  const flatNames = new Set();
  for (const file of fs.readdirSync(path.join(root, 'tokens')).filter((name) => name.endsWith('.css'))) {
    for (const name of scanTokenNames(fs.readFileSync(path.join(root, 'tokens', file), 'utf8'))) flatNames.add(name);
  }
  const blockNames = new Set(expected.map((e) => e.name));
  assert.deepEqual([...flatNames].filter((n) => !blockNames.has(n)), [], ':root 밖에 선언된 토큰이 없다');

  console.log(`PASS manifest token sync: ${expected.length} declarations (${new Set(expected.map((e) => e.name)).size} unique), 파서 fixture 검증`);
}

main().catch((error) => { console.error(error.message); process.exit(1); });
