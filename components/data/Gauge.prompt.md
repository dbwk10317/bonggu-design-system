Gauge — 사용률 하나(CPU·VRAM·디스크). 0~70 정상 · 70~90 주의 · 90~ 위험이 값 텍스트 색에도 반영된다. 시간 변화는 Chart line, 여러 항목 비교는 BarList.

```jsx
<Gauge value={0.62} label="CPU" />
<Gauge value={18.4} max={24} unit="GiB" valueFormatter={v=>v.toFixed(1)} label="VRAM" ticks />
<Gauge value={null} label="온도" />
```
