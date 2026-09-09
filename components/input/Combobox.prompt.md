Combobox · 목록이 길어질 선택(모델 9개→수십 개). 타이핑으로 거르고 키보드로 고른다.

```jsx
<Field label="그래프 모델"><Combobox value={id} onChange={setId} options={models.map(m=>({value:m.id,label:m.name,detail:m.runtime}))} /></Field>
```
- detail은 mono(런타임·식별자). 선택 해제는 × 버튼(clearable).
- Field의 오류·필수 상태를 aria-invalid·aria-required로 검색 입력에 전달한다. invalid·required prop으로 각각 재정의할 수 있다.
- 필수 선택의 제출 검증은 폼에서 선택 value를 기준으로 수행하고 오류를 Field.error로 전달한다. 검색 입력에는 native required를 적용하지 않는다. 검색어는 선택값이 아니며, 선택 후에도 검색 중에는 빈 문자열일 수 있다.
