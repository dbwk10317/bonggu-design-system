StatusPill — 상태를 색+텍스트로 알리는 pill. 악센트와 상태색을 섞지 않는다. tone과 문구는 항상 한 쌍.

```jsx
<StatusPill tone="ok" pulse>모든 서비스 정상</StatusPill>
<StatusPill tone="warn" size="sm">CPU 82%</StatusPill>
<StatusPill tone="crit">연결 끊김</StatusPill>
<StatusPill tone="off">수집 안 됨</StatusPill>
```
