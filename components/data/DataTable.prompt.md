DataTable · 서비스·사용자 표. 좁아지면 hideBelow 열을 숨기고 expandable로 펼쳐 본다(가로 스크롤은 최후).

```jsx
<DataTable aria-label="서비스" header={{title:"서비스",meta:"방금 갱신"}} rows={rows} rowKey={r => r.name}
  columns={[{key:"name",header:"이름"},{key:"status",header:"상태",render:r => <StatusPill tone="ok" size="sm">실행 중</StatusPill>},
    {key:"cpu",header:"CPU",align:"num",hideBelow:"tablet"},{key:"domain",header:"도메인",hideBelow:"desktop"}]}
  expandable={r => <span className="bds-mono">CPU {r.cpu} · 메모리 {r.mem}</span>} />
```
- aria-label이 없고 header가 있으면 표 이름은 header.title에서 온다.

결측: `render` 없는 열은 `row[key]`가 `null`·`undefined`·`NaN`이면 빈 칸이 아니라 "수집 안 됨"으로 그린다(mono를 벗고 흐리게). 빈 문자열·0·false는 수집된 값이라 그대로 그린다.
`render`의 반환은 ReactNode다. `null`은 React 규칙대로 아무것도 그리지 않으므로 결측이 아니다(예: 폐기된 행의 버튼 없음). `render` 열에서 결측을 보이려면 문구를 그대로 반환한다.

```jsx
// 값이 null이면 표가 알아서 "수집 안 됨"으로 그린다. 열에 render를 두지 않는 쪽이 낫다.
<DataTable rows={[{name:"monitoring-api",cpu:null}]} columns={[{key:"name",header:"이름"},{key:"cpu",header:"CPU",align:"num"}]} />
```
