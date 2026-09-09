DatePicker · 날짜 하나(예약 시작일, 만료일). 차트 기간은 DateRangePicker. 값은 항상 ISO 문자열, 표시는 mono.

```jsx
<Field label="만료일"><DatePicker value={d} onChange={setD} min="2026-09-09" /></Field>
```
- 날짜를 고르거나 Esc로 닫으면 포커스가 입력 버튼으로 돌아간다.

- 외부 value 변경 시 표시 월을 동기화한다. 달력을 다시 열면 현재 선택 월(미선택이면 현재 월)부터 표시한다.
