Code · CodeBlock · Kbd — 텍스트 안의 기술 토막.

```jsx
<p>모델 <Code>ko-embed-v3</Code>는 <Kbd>⌘</Kbd><Kbd>K</Kbd>로 검색합니다.</p>
<CodeBlock language="bash">{`curl -X POST https://hub.example/v2/models/ko-embed-v3/infer \\
  -H "Authorization: Bearer $TOKEN" -d @input.json`}</CodeBlock>
```
- 한글 문장에 monospace를 쓰지 않는다. Code 안은 식별자·명령만.
