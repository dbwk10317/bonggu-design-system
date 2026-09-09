Legend · 차트 여러 개가 한 범례를 공유할 때(같은 시리즈를 카드 3장에 그릴 때) 카드 머리에 한 번만. 단일 차트는 Chart 내장 범례.

```jsx
<Legend items={[{label:"수신",tone:"rx",value:"31.4 Mb/s"},{label:"송신",tone:"tx",value:"8.2 Mb/s"}]} shape="line" />
```
- shape="line"이면 선 스와치. 항목의 dash("6 4" 등)를 그대로 그려 Chart의 선 패턴과 맞춘다. 항목별 shape·color로 개별 지정도 된다.
- compact는 Chart 내장 범례용 작은 글자. 독립 범례는 기본값으로 둔다.
