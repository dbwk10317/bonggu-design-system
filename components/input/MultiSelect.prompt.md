MultiSelect · 역할 여러 개 할당, 알림 채널 여러 개. 선택은 Tag로 보이고 × 로 뺀다. 5개 이하 고정 목록이면 Checkbox 나열이 더 낫다.

```jsx
<Field label="역할"><MultiSelect options={roles} value={sel} onChange={setSel} placeholder="역할 검색" /></Field>
```

- 선택 후 활성 항목을 첫 번째 남은 선택지로 초기화한다. 외부 options/value 변경으로 목록이 줄어도 활성 인덱스를 현재 목록 범위 안으로 보정한다.
