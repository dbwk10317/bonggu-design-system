SplitPane · 목록과 상세를 함께 놓고 영역 비율을 조절합니다. 좁은 배치와 포커스 계약은 RULE.md의 "탐색·작업 확장 계약"을 따릅니다.

```jsx
<SplitPane firstLabel="서버 목록" secondLabel="서버 상세" first={<TreeView {...treeProps} />} second={<DescriptionList items={details} />}
  ratio={ratio} onRatioChange={setRatio} />
```

`ratio`는 첫 영역 비중입니다. 생략하면 `defaultRatio`부터 내부 상태로 조절합니다. 경계에서 좌·우와 Home·End를 사용할 수 있습니다.
