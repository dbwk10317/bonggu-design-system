CodeEditor · 학습 config·run input JSON. TextArea+mono 대신 이것: 줄번호, Tab 들여쓰기, 오류 줄 표시.

```jsx
<Field label="config JSON" hint="허용 필드: epochs, lr, batch_size, seed"><CodeEditor value={cfg} onChange={setCfg} onValidChange={setParsed} rows={7} /></Field>
```
- 하단 줄에 "유효한 JSON" 또는 "N번째 줄: 오류"가 뜬다. 전송 버튼은 parsed가 null이면 비활성.
- Tab은 두 칸 들여쓰기, Shift+Tab은 가로채지 않아 키보드로 빠져나갈 수 있다.
