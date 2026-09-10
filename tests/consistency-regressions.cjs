// CSS와 소스가 서로를 검증한다. 규칙 A: 소스가 붙이는 bds-* 클래스는 CSS에 규칙이 있어야 한다.
// 규칙 B: CSS에 있는 bds-* 클래스는 어떤 소비자든 실제로 붙여야 한다.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const CSS_DIRS = ['styles', 'tokens', 'guidelines'];
const CONSUMER_EXT = new Set(['.jsx', '.js', '.html']);

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const child = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(child, out);
    else out.push(child);
  }
  return out;
}

// ---- CSS 정의 ----------------------------------------------------------
// 클래스는 셀렉터의 점 접두사로만 센다. @keyframes 이름(bds-grow-y, bds-toast-in)과
// animation 값에는 점이 없으므로 클래스로 오인되지 않는다.
const defined = new Map(); // class -> "file:line"
for (const dir of CSS_DIRS) {
  for (const file of walk(dir).filter((f) => f.endsWith('.css'))) {
    const text = read(file).replace(/\/\*[^]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
    for (const match of text.matchAll(/\.(bds-[A-Za-z0-9_-]+)/g)) {
      if (!defined.has(match[1])) defined.set(match[1], `${file}:${lineOf(text, match.index)}`);
    }
  }
}

// ---- 소비자가 붙이는 클래스 --------------------------------------------
// class/className 값만 본다. id("bds-cmdk-list")나 aria 참조는 클래스가 아니므로 제외된다.
const MARK = '\u0000'; // 보간·문자열 연결 지점
const used = new Map(); // class -> "file:line"
const prefixes = new Set(); // 동적 조합의 고정 접두사

// 클래스 표현식을 리터럴 텍스트로 평탄화한다. 리터럴 밖의 `+`는 MARK,
// 나머지 코드(식별자·연산자)는 공백이 되어 토큰 경계가 된다.
function flatten(expr) {
  let out = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      i++;
      for (; i < expr.length && expr[i] !== ch; i++) {
        if (expr[i] === '\\') { i++; continue; }
        if (ch === '`' && expr[i] === '$' && expr[i + 1] === '{') {
          let depth = 1;
          for (i += 2; i < expr.length && depth; i++) {
            if (expr[i] === '{') depth++;
            else if (expr[i] === '}') depth--;
          }
          i--;
          out += MARK;
          continue;
        }
        out += expr[i];
      }
      continue;
    }
    if (ch === '+') out += MARK; // "bds-hide-" + bp
    else if (!/\s/.test(ch)) out += ' '; // 식별자·연산자는 토큰 경계
  }
  return out;
}

// start 위치의 여는 괄호부터 짝이 맞는 닫는 괄호까지. 문자열 안의 괄호는 세지 않는다.
function balanced(text, start, open, close) {
  let depth = 0, quote = null;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') quote = ch;
    else if (ch === open) depth++;
    else if (ch === close && !--depth) return text.slice(start + 1, i);
  }
  return text.slice(start + 1);
}

// 객체 속성 값: 깊이 0에서 , 또는 } 를 만나면 끝난다. MascotMark처럼 createElement 인자로 넘기는 형태.
function propertyValue(text, start) {
  let depth = 0, quote = null;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') quote = ch;
    else if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) { if (!depth) return text.slice(start, i); depth--; }
    else if (ch === ',' && !depth) return text.slice(start, i);
  }
  return text.slice(start);
}

// 클래스가 등장하는 자리. cx()는 이 디자인 시스템의 클래스 결합 함수라 변수로 한 번 거쳐
// 붙는 경우(SidebarShell의 cls)도 잡히고, bds-로 시작하는 문자열 상수는 클래스 상수로 본다
// (core/missing.js의 MISSING_CLASS처럼 import해서 cx에 넘기는 형태).
function classExpressions(text) {
  const out = [];
  for (const m of text.matchAll(/\bclass(?:Name)?\s*=\s*/g)) {
    const at = m.index + m[0].length, ch = text[at];
    if (ch === '{') out.push([balanced(text, at, '{', '}'), m.index]);
    else if (ch === '"' || ch === "'") out.push([text.slice(at, text.indexOf(ch, at + 1) + 1), m.index]);
  }
  for (const m of text.matchAll(/"?className"?\s*:\s*/g)) out.push([propertyValue(text, m.index + m[0].length), m.index]);
  for (const m of text.matchAll(/\bcx\s*\(/g)) out.push([balanced(text, m.index + m[0].length - 1, '(', ')'), m.index]);
  for (const m of text.matchAll(/\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*(["'])bds-[^"'\n]*\1/g)) out.push([m[0], m.index]);
  return out;
}

const consumers = [
  ...walk('components').filter((f) => CONSUMER_EXT.has(path.extname(f))),
  ...walk('templates').filter((f) => CONSUMER_EXT.has(path.extname(f))),
  ...walk('guidelines').filter((f) => CONSUMER_EXT.has(path.extname(f))),
  'thumbnail.html',
];
for (const file of consumers) {
  const text = read(file);
  for (const [expr, at] of classExpressions(text)) {
    for (const piece of flatten(expr).split(/\s+/)) {
      if (!piece.startsWith('bds-')) continue;
      const stem = piece.split(MARK)[0];
      if (piece.includes(MARK)) prefixes.add(stem); // 동적 조합: 접두사로만 안다
      else if (!used.has(stem)) used.set(stem, `${file}:${lineOf(text, at)}`);
    }
  }
}

const covered = (name) => used.has(name) || [...prefixes].some((p) => name.length > p.length && name.startsWith(p));

const missingRule = [...used].filter(([name]) => !defined.has(name));
const unusedClass = [...defined].filter(([name]) => !covered(name));

if (missingRule.length || unusedClass.length) {
  if (missingRule.length) {
    console.error(`규칙 A 위반 ${missingRule.length}건: 소스가 붙이지만 CSS에 규칙이 없는 클래스`);
    for (const [name, where] of missingRule) console.error(`  ${name}  (${where})`);
  }
  if (unusedClass.length) {
    console.error(`규칙 B 위반 ${unusedClass.length}건: CSS에 있지만 아무도 붙이지 않는 클래스`);
    for (const [name, where] of unusedClass) console.error(`  .${name}  (${where})`);
  }
  process.exit(1);
}
console.log(`PASS consistency regressions: ${used.size} class literals, ${prefixes.size} dynamic prefixes, ${defined.size} CSS classes cross-checked`);
