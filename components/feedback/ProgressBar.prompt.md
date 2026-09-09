ProgressBar — 업로드·등록 같은 "시작과 끝이 있는" 진행. 사용률 같은 비율은 Chart radial/BarList.

```jsx
<ProgressBar label="ocr-finetune.zip" value={0.44} detail={<>4/9 청크 · <span className="bds-mono">42 MiB/s</span></>} />
<ProgressBar label="서버 검증 중" value={null} />   // 비결정형
<ProgressBar size="sm" tone="crit" value={0.3} label="실패 · 재시도 대기" />
```
