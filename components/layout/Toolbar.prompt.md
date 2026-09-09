Toolbar · 표 위 검색·필터·액션 한 줄. 검색은 ToolbarGrow로 감싸 늘린다.

```jsx
<Toolbar end={<Button variant="primary" icon="plus">사용자 추가</Button>}>
  <ToolbarGrow><SearchField value={q} onChange={setQ} /></ToolbarGrow>
  <Select fit="auto" options={roles} />
</Toolbar>
```
- role="toolbar"를 붙이지 않는다(화살표 이동 없음, Tab으로 컨트롤 사이 이동).
