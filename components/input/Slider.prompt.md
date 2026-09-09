Slider — 밝기·주기·임계값 같은 연속 값. Field 안에서 라벨을 받는다.

```jsx
<Field label="밝기"><Slider min={1} max={5} value={b} onChange={setB} marks={[1,2,3,4,5]} /></Field>
<Field label="온도 임계" hint="70~95°C"><Slider min={60} max={100} step={5} defaultValue={85} unit="°C" /></Field>
```
