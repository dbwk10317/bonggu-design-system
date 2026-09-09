DateRangePicker · 차트 기간. 프리셋이 기본, "직접"을 누르면 시작/끝 입력이 펼쳐진다.

```jsx
<DateRangePicker value={range} onChange={setRange} />   // {preset:"12h"} 또는 {from,to}
<DateRangePicker size="sm" presets={[{value:"1h",label:"1시간"},{value:"24h",label:"24시간"}]} allowCustom={false} value={r} onChange={setR} />
```
