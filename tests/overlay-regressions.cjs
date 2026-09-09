const assert = require('node:assert/strict');
const { sourceModule, dependencyRequire } = require('./source-modules.cjs');
const React = dependencyRequire('react');
const { renderToStaticMarkup } = dependencyRequire('react-dom/server');
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

// Toast 퇴장: 닫기는 bds-toast--leaving 표시 뒤에 제거된다. 연속 닫기·max 초과·reduced-motion을 함께 본다.
const { create, act } = dependencyRequire('react-test-renderer');
const { ToastProvider, Toast, useToast } = sourceModule('components/feedback/Toast.jsx');
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

(async () => {
  let api = null, tree = null;
  const Probe = () => { api = useToast(); return null; };
  const shown = () => tree.root.findAllByType(Toast).map((n) => ({ id: n.props.id, leaving: !!n.props.leaving }));
  const live = () => shown().filter((t) => !t.leaving);

  await act(async () => { tree = create(h(ToastProvider, { max: 2 }, h(Probe))); });
  let first, second, third;
  await act(async () => { first = api.toast({ message: '하나', duration: 0 }); });
  await act(async () => { second = api.toast({ message: '둘', duration: 0 }); });
  assert.deepEqual(shown(), [{ id: first, leaving: false }, { id: second, leaving: false }]);

  await act(async () => { api.dismiss(first); });
  assert.deepEqual(shown(), [{ id: first, leaving: true }, { id: second, leaving: false }], 'dismissal marks the exit instead of dropping the toast');
  await act(async () => { api.dismiss(first); });
  assert.deepEqual(shown(), [{ id: first, leaving: true }, { id: second, leaving: false }], 'closing the same toast twice keeps one exiting toast');

  // 퇴장 중인 토스트는 max 자리를 차지하지 않는다: max=2인데 살아 있는 것이 둘로 유지된다.
  await act(async () => { third = api.toast({ message: '셋', duration: 0 }); });
  assert.deepEqual(live().map((t) => t.id), [second, third], 'an exiting toast does not evict a live one');

  await act(async () => { await sleep(400); });
  assert.deepEqual(shown().map((t) => t.id), [second, third], 'the exiting toast is removed once the transition ends');

  // reduced-motion: 퇴장 표시 없이 바로 사라진다.
  const media = globalThis.matchMedia;
  globalThis.matchMedia = (q) => ({ matches: /reduce/.test(q) });
  try {
    await act(async () => { api.dismiss(second); });
    assert.deepEqual(shown().map((t) => t.id), [third], 'reduced motion removes the toast immediately');
  } finally { if (media) globalThis.matchMedia = media; else delete globalThis.matchMedia; }

  await act(async () => { tree.unmount(); });
  console.log('PASS overlay source regressions: form association, completed/busy forms, initial confirmation, native notification drawer, toast exit');
})().catch((error) => { console.error(error); process.exit(1); });
