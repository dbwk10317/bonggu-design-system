BarList — 이름·값·막대 목록(디스크별 사용량, GPU 예약). 값 형식은 valueFormatter, 임계는 thresholds.

```jsx
<BarList aria-label="디스크별 사용량" max={100} thresholds={{warn:70,crit:90}} valueFormatter={v => `${v.toFixed(1)}%`}
  items={[{name:"nvme0n1 · 시스템",value:63.2},{name:"sda · 미디어",value:91.4}]} />
```
