Combobox · 목록이 길어질 선택(모델 9개→수십 개). 타이핑으로 거르고 키보드로 고른다.

```jsx
<Field label="그래프 모델"><Combobox value={id} onChange={setId} options={models.map(m=>({value:m.id,label:m.name,detail:m.runtime}))} /></Field>
```
- detail은 mono(런타임·식별자). 선택 해제는 × 버튼(clearable).
