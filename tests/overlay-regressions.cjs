const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const dependencyRequire = process.env.DS_TEST_NODE_MODULES
  ? createRequire(path.join(path.resolve(process.env.DS_TEST_NODE_MODULES), '__data-tests.cjs'))
  : require;
const Babel = dependencyRequire('@babel/standalone');
const React = dependencyRequire('react');
const { renderToStaticMarkup } = dependencyRequire('react-dom/server');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function sourceModule(relative) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  let source = fs.readFileSync(filename, 'utf8');
  const module = { exports: {} };
  cache.set(filename, module);
  const code = Babel.transform(source, { presets: ['react'], plugins: ['transform-modules-commonjs'] }).code;
  new Function('require', 'module', 'exports', code)(
    (id) => id.startsWith('.') ? sourceModule(path.resolve(path.dirname(filename), id)) : dependencyRequire(id),
    module, module.exports,
  );
  return module.exports;
}
const { FormModal } = sourceModule('components/overlay/FormModal.jsx');
const { ConfirmDialog } = sourceModule('components/feedback/ConfirmDialog.jsx');
const { NotificationDrawer } = sourceModule('components/feedback/NotificationDrawer.jsx');
const h = React.createElement;
const form = (props = {}) => h(FormModal, { open: true, title: '저장', onClose() {}, onSubmit() {}, ...props }, h('input'));
const html = renderToStaticMarkup(h(React.Fragment, null, form(), form()));
const ids = [...html.matchAll(/<form id="([^"]+)"/g)].map(m => m[1]);
const targets = [...html.matchAll(/ form="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, 2);
assert.notEqual(ids[0], ids[1], 'each concurrent form has an independent association');
assert.deepEqual(targets, ids);
assert(!renderToStaticMarkup(form({ submitLabel: null })).includes('type="submit"'), 'completed forms hide their submission action');
const busy = renderToStaticMarkup(form({ busy: true }));
assert(!busy.includes('aria-label="닫기"'), 'busy forms do not offer an inactive close control');
assert.equal(renderToStaticMarkup(h(ConfirmDialog, { open: false, title: '삭제' })), '');
const confirmation = renderToStaticMarkup(h(ConfirmDialog, { open: true, title: '삭제', typeToConfirm: 'model' }));
assert(confirmation.includes('value=""'));
assert(/<button[^>]*disabled=""[^>]*>[^]*?확인/.test(confirmation), 'typed confirmation begins disabled');
const notifications = renderToStaticMarkup(h(NotificationDrawer, { open: false, onClose() {}, id: 'alarms' }));
assert(notifications.includes('<dialog'));
assert(notifications.includes('id="alarms"'));
assert(notifications.includes('bds-side__panel'));
assert(!notifications.includes('role="dialog"'), 'notifications use the common native dialog');
console.log('PASS overlay source regressions: form association, completed/busy forms, initial confirmation, native notification drawer');
