// 사이트 전역 정보 및 외부 링크 (메뉴얼 page 5 / 13 / 15 기준)

export const SITE = {
  name: "WEFLOW",
  tagline: "제작부터 관리까지 비즈니스 성장을 함께합니다.",
  ceo: "신서준",
  bizNo: "884-07-03480",
  email: "contact@weflowlab.kr",
  hours: "연중무휴 24시간 상담가능",
  phone: "010-2971-7280",
  copyright: "© 2026 WEFLOW. All rights reserved.",
} as const;

export const LINKS = {
  phone: "tel:010-2971-7280",
  kakao: "http://pf.kakao.com/_xntCbX",
  blog: "https://m.blog.naver.com/weflowlab",
  instagram:
    "https://www.instagram.com/weflowlab.kr?igsh=b2c1eTdwbHo2bWRt",
  facebook:
    "https://www.facebook.com/profile.php?id=61590187124682&sk=about",
} as const;

export const NAV = [
  { label: "홈", href: "/" },
  { label: "서비스", href: "/services" },
  { label: "제작플랜&가격안내", href: "/pricing" },
  { label: "성공사례", href: "/cases" },
  { label: "예약", href: "/reservation" },
  
] as const;

// 제작 종류 (예약 / 무료진단 폼 공통)
export const PROJECT_TYPES = [
  "랜딩페이지 제작",
  "홈페이지 제작",
  "랜딩&홈페이지 제작",
  "기타(WEFLOW 케어플랜)",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
