ColorInput — 조명 색 하나를 고른다. 하드웨어 색이므로 UI 팔레트 제약을 받지 않는다.

```jsx
<Field label="색 1"><ColorInput value={c} onChange={setC} presets={["#F0A35A","#5CA8FF","#46B36B","#B388FF","#F2554D","#22D3EE","#FFFFFF"]} /></Field>
```
- hex는 입력 후 Enter/blur에 확정. 잘못된 값은 이전 값으로 되돌린다.
