// CSS and sources cross-check each other. Rule A: every bds-* class a source applies has a CSS rule.
// Rule B: every bds-* class in CSS is applied by some consumer.
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

// ---- CSS definitions ---------------------------------------------------
// Classes are counted only by the dot prefix in selectors; @keyframes names (bds-grow-y, bds-toast-in)
// and animation values have no dot, so they are not mistaken for classes.
const defined = new Map(); // class -> "file:line"
for (const dir of CSS_DIRS) {
  for (const file of walk(dir).filter((f) => f.endsWith('.css'))) {
    const text = read(file).replace(/\/\*[^]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
    for (const match of text.matchAll(/\.(bds-[A-Za-z0-9_-]+)/g)) {
      if (!defined.has(match[1])) defined.set(match[1], `${file}:${lineOf(text, match.index)}`);
    }
  }
}

// ---- Classes applied by consumers --------------------------------------
// Only class/className values count; ids ("bds-cmdk-list") and aria references are not classes.
const MARK = '\u0000'; // interpolation / string concatenation point
const used = new Map(); // class -> "file:line"
const prefixes = new Set(); // fixed prefixes of dynamic compositions

// Flatten a class expression to literal text: `+` outside literals becomes MARK,
// other code (identifiers, operators) becomes whitespace and thus a token boundary.
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
    else if (!/\s/.test(ch)) out += ' '; // identifiers/operators are token boundaries
  }
  return out;
}

// From the opening bracket at `start` to its matching close; brackets inside strings are not counted.
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

// Object property value: ends at `,` or `}` at depth 0 (createElement props, e.g. MascotMark).
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

// Where classes appear. cx() is the system's class combinator, so classes routed through a variable
// (SidebarShell's cls) are caught too; string constants starting with bds- count as class constants
// (core/missing.js MISSING_CLASS, imported and passed to cx).
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
      if (piece.includes(MARK)) prefixes.add(stem); // dynamic composition: only the prefix is known
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
