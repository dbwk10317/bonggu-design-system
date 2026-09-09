Select — 네이티브 select. 옵션 6개 이상이거나 모바일 친화가 필요하면 SegmentedControl 대신 이것.

```jsx
<Field label="효과"><Select value={v} onChange={e => setV(e.target.value)} options={[{value:"static",label:"고정"},{value:"breathing",label:"숨쉬기"}]} /></Field>
```
