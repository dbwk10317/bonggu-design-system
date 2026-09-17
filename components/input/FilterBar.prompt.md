FilterBar · 검색과 조건을 조합하는 목록 도구입니다. 상태·배치 계약은 RULE.md의 "탐색·작업 확장 계약"을 따릅니다.

```jsx
<FilterBar fields={[{key:"status",label:"상태",options:[{value:"ok",label:"정상"},{value:"warn",label:"지연"}]}]}
  query={query} onQueryChange={setQuery} filters={filters} onFiltersChange={setFilters} />
```

`filters`는 안정적인 id와 field·operator·value를 갖습니다. 소비 앱이 조건을 해석해 조회하거나 행을 걸러냅니다. `ref`는 검색 입력을 가리킵니다.
