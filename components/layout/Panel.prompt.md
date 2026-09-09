Panel · 카드. 안에 CardHead/KeyValues/Chart를 놓는다. 선택 카드는 selected, 클릭 카드는 interactive.

```jsx
<Panel><CardHead title="CPU" meta="Ryzen 9 7950X" metaMono /><Chart kind="radial" … /></Panel>
<Panel caption="GPU 메모리 예약">…</Panel>
<Panel interactive selected onClick={..}>…</Panel>
```
