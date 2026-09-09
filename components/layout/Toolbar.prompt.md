Toolbar — 표 위 검색·필터·액션 한 줄. 검색은 ToolbarGrow로 감싸 늘린다.

```jsx
<Toolbar end={<Button variant="primary" icon="plus">사용자 추가</Button>}>
  <ToolbarGrow><SearchField value={q} onChange={setQ} /></ToolbarGrow>
  <Select fit="auto" options={roles} />
</Toolbar>
```
