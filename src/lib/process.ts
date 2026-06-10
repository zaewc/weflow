// 제작 프로세스 데이터 (메뉴얼 page 2 / 6)

export interface SimpleStep {
  title: string;
}

export interface DetailStep {
  no: string;
  title: string;
  desc: string;
}

// 제작 진행 과정 (4칸)
export const SIMPLE_STEPS: SimpleStep[] = [
  { title: "고객 상담" },
  { title: "협의 후 제작" },
  { title: "3~7일 완료" },
  { title: "광고 및 운영 사후 관리" },
];

// 6단계 제작 프로세스
export const DETAIL_STEPS: DetailStep[] = [
  { no: "01", title: "상담 · 진단", desc: "업종 및 제작 방향 확인" },
  { no: "02", title: "기획 · 설계", desc: "문의 구조 및 전략 설계" },
  { no: "03", title: "디자인", desc: "브랜드 맞춤 화면 구성" },
  {
    no: "04",
    title: "개발 · 테스트",
    desc: "기능 구현 · 최적화 · 검수 및 수정 진행",
  },
  {
    no: "05",
    title: "SEO 상단등록",
    desc: "네이버 · 구글 · 사이트맵 등록",
  },
  {
    no: "06",
    title: "광고운영 · 사후관리",
    desc: "인스타 · 블로그 · 네이버 키워드 광고 운영관리",
  },
];

// 광고 운영 · 사후관리 시스템
export const AD_SYSTEM: string[] = [
  "블로그 업로드",
  "인스타 업로드",
  "스레드 업로드",
  "네이버 키워드 업로드",
  "당근플레이스 키워드 업로드",
  "네이버 서치어드바이저 상단등록",
  "구글 콘솔 상단등록",
  "사이트맵 등록",
];
