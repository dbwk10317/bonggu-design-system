CopyField · 값을 "읽고 복사"하는 곳. 편집은 TextField.

```jsx
<CopyField label="발급된 토큰" secret value="bgt_9f2c1e7a4b8d3f60a1c5e2b7d4f8a9c0" onCopy={(ok)=>toast({message: ok?"복사했습니다":"자동 복사가 차단되었습니다"})} />
<CopyField label="호출 예시" multiline value={curl} />
```
- 복사가 끝나면 "복사됨"이 스크린리더에 status로 읽힌다.
