// Render every manifest component from source. The list is not hand-written, so new components are
// covered automatically. The only question here is "does it render".
const assert = require('node:assert/strict');
const { sourceModule, dependencyRequire, root } = require('./source-modules.cjs');
const React = dependencyRequire('react');
const { renderToStaticMarkup } = dependencyRequire('react-dom/server');
const manifest = require(require('node:path').join(root, '_ds_manifest.json'));

// Only components that cannot render with empty props; each value is the minimum required by the .d.ts.
const trigger = React.createElement('button');
const OVERRIDES = {
  SidebarShell: { brand: { name: '봉구' } }, // brand is required; the logo slot reads brand.mark directly
  Popover: { trigger },  // trigger is wrapped with cloneElement, so an element is required
  Tooltip: { children: trigger }, // Children.only demands a single element child
  IconButton: { icon: 'bell', 'aria-label': '알림' }, // aria-label is required
  NotificationTrigger: { unreadCount: 0, open: false, onToggle() {} },
};

// See RULE.md "접근성": server render must finish without warnings; unguarded browser-only hooks fail here.
const warnings = [];
for (const level of ['warn', 'error']) {
  const original = console[level];
  console[level] = (...args) => { warnings.push(String(args[0])); original(...args); };
}

const failures = [];
for (const { name, sourcePath } of manifest.components) {
  try {
    const Component = sourceModule(sourcePath)[name];
    // forwardRef components are objects, not functions.
    assert.ok(Component, `${sourcePath}에서 ${name}을 내보내지 않습니다`);
    renderToStaticMarkup(React.createElement(Component, OVERRIDES[name] ?? {}));
  } catch (error) {
    failures.push(`  ${name} (${sourcePath}): ${error.message}`);
  }
}

if (failures.length) {
  console.error(`렌더 실패 ${failures.length}건 / ${manifest.components.length}개`);
  for (const line of failures) console.error(line);
  process.exit(1);
}
if (warnings.length) {
  console.error(`서버 렌더 경고 ${warnings.length}건. 경고 없이 끝나야 합니다.`);
  for (const line of [...new Set(warnings)]) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`PASS smoke regressions: ${manifest.components.length} components render from source, 서버 렌더 무경고`);
