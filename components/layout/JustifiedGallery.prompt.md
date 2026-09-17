JustifiedGallery · 여러 장을 훑어보는 사진 목록. 원본 비율을 지키고 행 폭을 채운다. 한 장을 대표로 보이는 자리는 AspectRatio.

```jsx
<JustifiedGallery
  aria-label="최신 사진"
  items={photos.map((p) => ({ id: p.id, src: p.thumb, alt: `${p.date} 촬영 사진`, width: p.width, height: p.height }))}
  onOpen={(item) => open(item.id)}
  footer={next ? <Button onClick={loadMore}>더 불러오기</Button> : null}
/>
```

`fit="auto"`와 `width`를 함께 넘겨 콘텐츠 배치에 맞춘 폭을 지정할 수 있습니다. 크기 계약은 RULE.md를 따릅니다.
