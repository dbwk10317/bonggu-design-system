import React from "react";
import { cx } from "../core/frame.js";

const EAR_L = "M6.5 8 C2.5 9.5 2 16 4.5 19.5 C6 21.6 8.5 22.5 10.5 21.5 L12.5 12 C11.5 9 8.8 7.1 6.5 8Z";
const EAR_R = "M29.5 8 C33.5 9.5 34 16 31.5 19.5 C30 21.6 27.5 22.5 25.5 21.5 L23.5 12 C24.5 9 27.2 7.1 29.5 8Z";
const L = "var(--mark-line)";
const S = (d, w = 1.2) => <path d={d} fill="none" stroke={L} strokeWidth={w} strokeLinecap="round" />;

function Face({ face, animated }) {
  const eye = animated ? "bds-mark__eye" : undefined;
  switch (face) {
    case "blank": return null;
    case "curious": return <>{<circle cx="14.4" cy="16.4" r="1.55" fill={L} />}<circle cx="21.6" cy="15.9" r="1.55" fill={L} />{S("M20 12.8 Q21.7 11.9 23.3 12.8", 1.1)}<ellipse cx="18.2" cy="21.2" rx="2.2" ry="1.7" fill={L} /></>;
    case "surprised": return <><circle cx="14.1" cy="15.8" r="2" fill={L} /><circle cx="21.9" cy="15.8" r="2" fill={L} /><ellipse cx="18" cy="20.7" rx="2" ry="1.45" fill={L} /><ellipse cx="18" cy="24.2" rx="1.45" ry="1.75" fill="none" stroke={L} strokeWidth="1.2" /></>;
    case "smiling": return <><circle cx="14.2" cy="16.2" r="1.5" fill={L} /><circle cx="21.8" cy="16.2" r="1.5" fill={L} /><ellipse cx="18" cy="20.7" rx="2.1" ry="1.55" fill={L} />{S("M14.5 23 Q18 26.1 21.5 23", 1.25)}</>;
    case "crying": return <>{S("M12.1 16.8 Q14.2 15.1 16.3 16.8 M19.7 16.8 Q21.8 15.1 23.9 16.8", 1.25)}<path d="M12.8 19.2 C11.7 21 11.8 22.2 12.9 22.9 C14 22.2 14 21 12.8 19.2Z M23.2 19.2 C22 21 22 22.2 23.1 22.9 C24.2 22.2 24.3 21 23.2 19.2Z" fill={L} opacity=".52" /><ellipse cx="18" cy="21" rx="2" ry="1.5" fill={L} />{S("M15.4 25 Q18 22.9 20.6 25")}</>;
    case "worried": return <>{S("M12.2 13.4 Q14.2 12.2 16.2 13.7 M19.8 13.7 Q21.8 12.2 23.8 13.4", 1.1)}<circle cx="14.2" cy="16.7" r="1.45" fill={L} /><circle cx="21.8" cy="16.7" r="1.45" fill={L} /><ellipse cx="18" cy="21" rx="2.05" ry="1.5" fill={L} />{S("M15.4 24.9 Q18 22.8 20.6 24.9")}</>;
    case "sleepy": return <>{S("M12.7 16.6 H15.8 M20.2 16.6 H23.3", 1.45)}<ellipse cx="18" cy="21.2" rx="2.2" ry="1.7" fill={L} /></>;
    case "excited": return <>{S("M11.7 17 Q14.2 13.8 16.7 17 M19.3 17 Q21.8 13.8 24.3 17", 1.35)}<ellipse cx="18" cy="20.4" rx="2" ry="1.45" fill={L} /><path d="M14.2 23.1 Q18 27 21.8 23.1 Q21.1 27.2 18 27.4 Q14.9 27.2 14.2 23.1Z" fill={L} /></>;
    default: return <><circle className={eye} cx="14.2" cy="16.5" r="1.6" fill={L} /><circle className={eye} cx="21.8" cy="16.5" r="1.6" fill={L} /><ellipse cx="18" cy="21.2" rx="2.2" ry="1.7" fill={L} /></>;
  }
}

/** 봉구 마스코트 마크. 기존 디자인시스템에서 그대로 가져온 유일한 브랜드 요소.
 *  얼굴은 --mark-* 토큰만 쓴다(테마가 바뀌어도 얼굴은 밝게). 귀는 --mark-ear(봉구 앰버, 기존 시스템 값 유지 — 시그널 파랑 아님). */
export function MascotMark({ face = "neutral", size = 26, animated = true, className, "aria-label": ariaLabel, ...rest }) {
  const dim = face === "sleepy";
  const body = (
    <>
      <path className="bds-mark__ear" d={EAR_L} fill="var(--mark-ear)" opacity={dim ? 0.8 : undefined} />
      <path className="bds-mark__ear" d={EAR_R} fill="var(--mark-ear)" opacity={dim ? 0.8 : undefined} />
      <circle cx="18" cy="18" r="11" fill="var(--mark-face)" stroke="var(--mark-edge)" strokeWidth="0.75" opacity={dim ? 0.9 : undefined} />
      <Face face={face} animated={animated} />
    </>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}
      {...rest} className={cx("bds-mark", animated && "bds-mark--animated", className)}>
      {face === "curious" ? <g transform="rotate(-4 18 18)">{body}</g> : body}
    </svg>
  );
}
