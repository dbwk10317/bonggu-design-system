import assert from "node:assert/strict";

const React = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const storageSnapshot = () => {
  if (!Object.hasOwn(globalThis, "localStorage")) return null;
  const storage = globalThis.localStorage;
  if (storage == null) return storage;
  return Array.from({ length: storage.length }, (_, index) => {
    const key = storage.key(index);
    return [key, key == null ? null : storage.getItem(key)];
  });
};
const browserGlobalsBefore = {
  document: Object.getOwnPropertyDescriptor(globalThis, "document"),
  localStorage: Object.getOwnPropertyDescriptor(globalThis, "localStorage"),
  storage: storageSnapshot(),
};

const { Button, Panel, ToastProvider, useToast } = await import("@dbwk10317/bonggu-design-system");

assert.deepEqual(Object.getOwnPropertyDescriptor(globalThis, "document"), browserGlobalsBefore.document);
assert.deepEqual(Object.getOwnPropertyDescriptor(globalThis, "localStorage"), browserGlobalsBefore.localStorage);
assert.deepEqual(storageSnapshot(), browserGlobalsBefore.storage);

function ToastConsumer() {
  const api = useToast();
  assert.equal(typeof api.toast, "function");
  assert.equal(typeof api.dismiss, "function");
  return React.createElement(Button, { type: "button" }, "저장");
}

const markup = renderToStaticMarkup(
  React.createElement(
    ToastProvider,
    { max: 2 },
    React.createElement(Panel, { caption: "SSR fixture" }, React.createElement(ToastConsumer)),
  ),
);
assert.match(markup, /SSR fixture/);
assert.match(markup, /저장/);
console.log("PASS package SSR: ESM import, browser-global purity, React server render");
