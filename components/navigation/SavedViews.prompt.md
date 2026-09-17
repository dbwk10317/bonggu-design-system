SavedViews · 현재 필터·정렬·열 구성을 이름 있는 보기로 저장하는 도구입니다. 저장 책임은 RULE.md의 "탐색·작업 확장 계약"을 따릅니다.

```jsx
<SavedViews items={views} value={{filters,sort,columns}} selectedId={viewId}
  onApply={view => applyView(view.value)}
  onSave={(name,value) => saveView(name,value)}
  onRename={(id,name) => renameView(id,name)} onDelete={deleteView} />
```

저장·이름 변경·삭제 결과는 소비 앱이 `items`로 다시 제공합니다. 네트워크 작업의 진행·실패 표시는 앱의 피드백 영역과 연결합니다.
