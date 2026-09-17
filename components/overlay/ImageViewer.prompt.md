ImageViewer · 갤러리 사진을 모달에서 확대하고 정보를 읽습니다. 크기·오류·포커스 계약은 RULE.md의 "탐색·작업 확장 계약"을 따릅니다.

```jsx
<ImageViewer open={open} onClose={() => setOpen(false)} images={photos} index={index} onIndexChange={setIndex} />
```

사진은 `id`·`src`·`alt`와 선택적인 `title`·`metadata`를 받습니다. 화면 맞춤 상태에서 좌·우는 이전·다음 사진, +·-는 확대·축소, 0은 화면 맞춤입니다. 확대된 이미지는 내부 영역에서 스크롤합니다.
