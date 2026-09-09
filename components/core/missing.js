/* 결측 계약: "데이터는 nullable이 기본. 수집되지 않은 값은 꾸미지 않고 '수집 안 됨'으로 그대로 보여준다"를
   한 곳에서 구현한다. 표기 문자열·판정 함수·표기 클래스는 전부 여기서만 나온다.

   판정 규칙(isMissing)
   - null · undefined  결측. 수집되지 않은 값의 기본 표현이다.
   - NaN               결측. 계산이 실패한 수치를 "NaN"으로 꾸며 보여주지 않는다.
   - MISSING_TEXT      결측. 이미 문구로 포맷해서 넘기는 사용처(templates/dashboard/data.js의 fmt.*)를 그대로 지원한다.
                       문자열 비교는 이 파일 안 한 곳에만 있으므로 문구를 바꿔도 판정과 표기가 함께 움직인다.
   - "" · 0 · false    값. 수집된 결과가 비어 있거나 0인 것과 수집 실패는 다르다. 빈 문자열은 빈 칸으로 그린다.
   - ReactNode(요소·배열) 판정하지 않는다. 노드를 만드는 것은 소비자 몫이고 React 규칙(null = 아무것도 그리지 않음)을 따른다.

   isMissing은 "어떻게 보여줄지"를 정한다. 차트 좌표·누적 같은 기하 계산은 종전대로 값이 null인지로 판단한다. */
export const MISSING_TEXT = "수집 안 됨";
/** 결측 문구에 붙는 유일한 클래스. 규칙은 styles/c-data.css에 있다(mono를 벗고 --ink-3). */
export const MISSING_CLASS = "bds-na";
export const isMissing = (v) => v == null || v === MISSING_TEXT || (typeof v === "number" && Number.isNaN(v));
