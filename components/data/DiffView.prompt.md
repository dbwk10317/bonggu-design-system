DiffView · revision 간 필드 변경. 삭제는 취소선(crit tint), 추가는 ok tint.

```jsx
<DiffView from="rev_0827" to="rev_0913" changes={[
  {field:"prefect.recipes.finetune.epochs", from:12, to:20},
  {field:"dataset.schema.fields.label_weight", to:"float"},
  {field:"image_digest", from:"sha256:3f1c…", to:"sha256:9a2e…"}]} />
```

`fit="auto"`와 `width`를 함께 넘겨 콘텐츠 배치에 맞춘 폭을 지정할 수 있습니다. 크기 계약은 RULE.md를 따릅니다.
