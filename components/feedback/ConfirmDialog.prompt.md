ConfirmDialog · 파괴적·되돌릴 수 없는 동작 앞에. crit 채움 버튼은 여기서만. 되돌릴 수 있는 동작은 Toast의 "실행 취소"로 대신한다.

```jsx
<ConfirmDialog open={o} onClose={close} onConfirm={del} danger title="모델 삭제" message="ko-embed-v3와 revision 4개가 삭제됩니다. 되돌릴 수 없습니다." confirmLabel="삭제" typeToConfirm="ko-embed-v3" />
```

- 닫았다 다시 열거나 typeToConfirm 대상이 바뀌면 입력값을 초기화한다. busy 동안 확인 입력·확인·취소·Esc·딤 클릭을 모두 막는다.
