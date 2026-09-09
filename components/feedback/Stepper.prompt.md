Stepper — 순서가 있는 단계. 등록 9단계, 학습 stage. 진행률(%)은 ProgressBar, 단계는 Stepper.

```jsx
<Stepper aria-label="등록 단계" current={3} steps={[{label:"업로드"},{label:"해시 검증"},{label:"계약 파싱"},{label:"GPU 검증",detail:"Triton load"},{label:"smoke 추론"},{label:"VRAM 측정"}]} />
<Stepper orientation="vertical" steps={[{label:"prepare",status:"done"},{label:"train",status:"current",detail:"epoch 12/20"},{label:"eval",status:"todo"}]} />
```
- 좁은 컨테이너(< 480px)에서는 가로형이 자동으로 세로형이 된다.
