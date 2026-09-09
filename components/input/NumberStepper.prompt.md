NumberStepper · 작은 숫자를 정확히 맞출 때. 넓은 범위는 Slider.

```jsx
<Field label="epochs"><NumberStepper min={1} max={200} value={ep} onChange={setEp} /></Field>
<Field label="갱신 주기"><NumberStepper min={1} max={60} step={1} defaultValue={2} unit="초" /></Field>
```
