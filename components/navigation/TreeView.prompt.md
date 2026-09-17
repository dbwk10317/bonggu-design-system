TreeView · 노드·서비스·폴더의 계층을 펼치고 선택합니다. 키보드와 선택 신원은 RULE.md의 "탐색·작업 확장 계약"을 따릅니다.

```jsx
<TreeView aria-label="서버" nodes={[{id:"server",label:"봉구 서버",children:[{id:"api",label:"인증 API"}]}]}
  selectedId={selected} onSelect={setSelected} defaultExpandedIds={["server"]} />
```

`expandedIds`와 `onExpandedChange`로 펼침도 제어할 수 있습니다. 위·아래는 보이는 항목, 좌·우는 부모·자식 및 접기·펼치기, Enter·Space는 선택입니다.
