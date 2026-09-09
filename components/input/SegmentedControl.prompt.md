SegmentedControl — 2~5개 중 하나(속도·방향·밝기). 6개 이상은 Select.

```jsx
<SegmentedControl aria-label="속도" value={speed} onChange={setSpeed}
  options={[{value:"slow",label:"느리게"},{value:"medium",label:"보통"},{value:"fast",label:"빠르게"}]} />
<SegmentedControl aria-label="밝기" fit="flex" size="sm" value="3" onChange={..} options={[1,2,3,4,5].map(n=>({value:String(n),label:n}))} />
```
