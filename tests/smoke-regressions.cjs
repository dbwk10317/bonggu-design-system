// 매니페스트에 실린 모든 컴포넌트를 소스에서 그대로 렌더한다. 목록을 손으로 적지 않으므로
// 새 컴포넌트가 추가되면 자동으로 덮인다. 여기서 잡는 것은 "렌더가 되는가" 하나뿐이다.
const assert = require('node:assert/strict');
const { sourceModule, dependencyRequire, root } = require('./source-modules.cjs');
const React = dependencyRequire('react');
const { renderToStaticMarkup } = dependencyRequire('react-dom/server');
const manifest = require(require('node:path').join(root, '_ds_manifest.json'));

// 빈 props로 렌더가 성립하지 않는 컴포넌트만. 각 값은 .d.ts의 필수 prop 최소치다.
const trigger = React.createElement('button');
const OVERRIDES = {
  SidebarShell: { brand: { name: '봉구' } }, // brand는 필수. 로고 자리에서 brand.mark를 바로 읽는다
  Popover: { trigger },  // trigger를 cloneElement로 감싸므로 요소가 필수
  Tooltip: { children: trigger }, // Children.only로 단일 요소 자식을 요구한다
};

const failures = [];
for (const { name, sourcePath } of manifest.components) {
  try {
    const Component = sourceModule(sourcePath)[name];
    // forwardRef 컴포넌트는 함수가 아니라 객체다.
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
console.log(`PASS smoke regressions: ${manifest.components.length} components render from source`);
