Panel · 카드. 안에 CardHead/KeyValues/Chart를 놓는다. 선택 표시는 selected.

```jsx
<Panel><CardHead title="CPU" meta="Ryzen 9 7950X" metaMono /><Chart kind="radial" … /></Panel>
<Panel caption="GPU 메모리 예약">…</Panel>
<Panel as="button" interactive selected={sel} aria-pressed={sel} onClick={..}>…</Panel>
```
- interactive는 호버 상승과 커서만 담당하는 시각 prop이다. 이것만으로는 포커스도 키보드 조작도 생기지 않는다.
- 조작 가능한 카드는 `as="button"`으로 네이티브 버튼을 만든다. 선택 상태는 `aria-pressed`로 전한다.
- 카드 안에 Button이나 입력이 들어가면 카드 전체를 버튼으로 만들지 않는다. 동작은 내부 컨트롤에 둔다.
