UptimeBar · 서비스별 90일 가용성. 색은 상태색 넷, 비율 텍스트는 mono. 칸 hover는 title로 날짜·상태.

가용성은 `(ok + warn) / (ok + warn + crit)`로 계산한다. 일부 지연(warn)은 가용, 장애(crit)는 비가용이며 미수집(off)은 분모에서 제외한다. 수집된 칸이 없으면 "수집 안 됨"으로 표시한다. `uptime`을 주면 계산값 대신 지정한 백분율을 표시한다.

```jsx
<UptimeBar name="ai-hub" segments={days} start="6월 11일" end="오늘" />
```
