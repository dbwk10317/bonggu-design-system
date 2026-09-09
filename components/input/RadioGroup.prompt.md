RadioGroup — 2~5개 중 하나. 2~3개 짧은 라벨은 SegmentedControl, 설명이 필요한 선택은 layout="cards", 6개 이상은 Select.

```jsx
<RadioGroup label="종료 정책" value={v} onChange={setV} layout="cards" options={[
  {value:"idle",label:"유휴 시 종료",hint:"15분 요청 없으면 자동 종료"},
  {value:"keep",label:"항상 유지",hint:"VRAM을 계속 점유"}]} />
```
