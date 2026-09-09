Checkbox — 저장 버튼과 함께 쓰는 선택. 즉시 반영되는 토글은 Switch.

```jsx
<Checkbox checked={a} onChange={e => setA(e.target.checked)}>알림 받기</Checkbox>
<Checkbox radio name="mode" value="fast">빠르게</Checkbox>
<Checkbox aria-label="전체 선택" indeterminate />
```
