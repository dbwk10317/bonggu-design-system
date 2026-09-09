DataTable · 서비스·사용자 표. 좁아지면 hideBelow 열을 숨기고 expandable로 펼쳐 본다(가로 스크롤은 최후).

```jsx
<DataTable aria-label="서비스" header={{title:"서비스",meta:"방금 갱신"}} rows={rows} rowKey={r => r.name}
  columns={[{key:"name",header:"이름"},{key:"status",header:"상태",render:r => <StatusPill tone="ok" size="sm">실행 중</StatusPill>},
    {key:"cpu",header:"CPU",align:"num",hideBelow:"tablet"},{key:"domain",header:"도메인",hideBelow:"desktop"}]}
  expandable={r => <span className="bds-mono">CPU {r.cpu} · 메모리 {r.mem}</span>} />
```
- aria-label이 없고 header가 있으면 표 이름은 header.title에서 온다.
