Slider · 밝기·주기·임계값 같은 연속 값. Field 안에서 라벨을 받는다.

```jsx
<Field label="밝기"><Slider min={1} max={5} value={b} onChange={setB} marks={[1,2,3,4,5]} /></Field>
<Field label="온도 임계" hint="70~95°C"><Slider min={60} max={100} step={5} defaultValue={85} unit="°C" /></Field>
```

`fit="auto"`와 `width`를 함께 넘겨 콘텐츠 배치에 맞춘 폭을 지정할 수 있습니다. 크기 계약은 RULE.md를 따릅니다.
