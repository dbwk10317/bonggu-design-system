NumberStepper · 작은 숫자를 정확히 맞출 때. 넓은 범위는 Slider.

```jsx
<Field label="epochs"><NumberStepper min={1} max={200} value={ep} onChange={setEp} /></Field>
<Field label="갱신 주기"><NumberStepper min={1} max={60} step={1} defaultValue={2} unit="초" /></Field>
```

- 입력 중에는 빈칸·범위 밖 숫자를 그대로 편집한다. blur·Enter·증감 버튼에서 min/max로 보정된 숫자를 onChange로 확정한다. 빈칸/불완전한 숫자는 마지막 확정값으로 복원한다. 외부 value 변경은 편집값도 동기화한다.
- 마이그레이션: onChange는 매 키 입력 대신 확정 시 호출된다. 실시간 미리보기는 확정된 값 기준으로 갱신한다.
