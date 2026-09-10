import React, { useState } from "react";
import { Icon } from "../action/Icon.jsx";
import { TextField } from "./TextField.jsx";

const LV = ["", "약함", "보통", "좋음", "강함"];
export const passwordStrength = (s = "") => { if (!s) return 0; let n = 0; if (s.length >= 8) n++; if (s.length >= 12) n++; if (/[A-Z]/.test(s) && /[a-z]/.test(s)) n++; if (/\d/.test(s) && /[^\w]/.test(s)) n++; return Math.min(4, Math.max(1, n)); };

/** 비밀번호 입력. 보기 토글 + (선택) 강도 미터. strength는 텍스트로도 병기한다.
 * @param {Parameters<typeof import("./PasswordField.d.ts").PasswordField>[0]} props */
export function PasswordField({ value, onChange, strength = false, autoComplete = "current-password", ...rest }) {
  const [show, setShow] = useState(false);
  const lv = strength ? passwordStrength(value) : 0;
  return (
    <div className="bds-pw">
      <TextField type={show ? "text" : "password"} value={value} onChange={onChange} autoComplete={autoComplete} mono
        suffix={<button type="button" className="bds-pw__eye" aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"} aria-pressed={show} onClick={() => setShow((s) => !s)}><Icon name={show ? "eye-slash" : "eye"} size={15} /></button>} {...rest} />
      {strength && <><div className="bds-pw__meter" data-level={lv} aria-hidden="true"><i /><i /><i /><i /></div><span className="bds-pw__lv" role="status">{lv ? "강도: " + LV[lv] : "8자 이상, 대·소문자·숫자·기호 조합"}</span></>}
    </div>
  );
}
