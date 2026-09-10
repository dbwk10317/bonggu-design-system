Select · 네이티브 select. 기본 크기는 `md`이고, 좁은 툴바에서는 `size="sm"`을 쓸 수 있습니다. 옵션 6개 이상이거나 모바일 친화가 필요하면 SegmentedControl 대신 이것.

```jsx
<Field label="효과"><Select value={v} onChange={e => setV(e.target.value)} options={[{value:"static",label:"고정"},{value:"breathing",label:"숨쉬기"}]} /></Field>
```
