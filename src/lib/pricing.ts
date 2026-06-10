// 가격 데이터 (메뉴얼 page 8 / 9 / 10 기준)

export interface PlanCard {
  badge?: string;
  name: string;
  subtitle?: string;
  features: string[];
  oldPrice: string;
  newPrice: string;
  priceSuffix?: string;
  highlight?: boolean;
}

// 제작 플랜 (3중 택1)
export const PRODUCTION_PLANS: PlanCard[] = [
  {
    badge: "START",
    name: "랜딩페이지",
    features: [
      "랜딩페이지 1페이지",
      "3~4일 빠른 제작기간",
      "반응형 제작 (PC/모바일)",
      "문의폼 연동",
      "기본 SEO 설정",
    ],
    oldPrice: "498,000원",
    newPrice: "249,000원",
  },
  {
    badge: "GROW",
    name: "홈페이지",
    features: [
      "홈페이지 5페이지",
      "1주 빠른 제작기간",
      "반응형 제작 (PC/모바일)",
      "문의폼 연동",
      "카카오톡 상담연동",
      "기본 SEO 설정",
    ],
    oldPrice: "1,980,000원",
    newPrice: "990,000원",
  },
  {
    badge: "MASTER",
    name: "프리미엄",
    subtitle: "홈페이지 + 랜딩페이지",
    features: [
      "1~2주 빠른 제작기간",
      "반응형 제작 (PC/모바일)",
      "프리미엄 디자인",
      "예약·문의 시스템",
      "SEO 최적화",
      "광고 전환 구조 설계",
    ],
    oldPrice: "2,980,000원",
    newPrice: "1,490,000원",
    highlight: true,
  },
];

// 케어 플랜 (3중 택1)
export const CARE_PLANS: PlanCard[] = [
  {
    name: "WE CARE",
    subtitle: "기본 관리 플랜",
    features: [
      "유지보수(월 수정) 월 1회",
      "블로그 : 월 1개",
      "인스타 : 월 4회 (주 1회)",
      "스레드 : 월 4회 (주 1회)",
      "SEO 상단등록",
    ],
    oldPrice: "월 170,000원",
    newPrice: "월 89,000원",
    priceSuffix: "~",
  },
  {
    name: "FLOW CARE",
    subtitle: "성장 관리 플랜",
    features: [
      "유지보수 : 월 3회",
      "인스타 : 월 8회 (주 2회)",
      "스레드 : 월 8회 (주 2회)",
      "블로그 : 월 2회",
      "네이버 키워드 세팅 할인 (149,000 → 79,000원)",
      "당근 키워드 광고 세팅 50% 할인 (79,000 → 39,000원)",
      "문의 개선",
      "SEO 상단 등록",
    ],
    oldPrice: "월 378,000원",
    newPrice: "월 189,000원",
    priceSuffix: "~",
  },
  {
    name: "WEFLOW CARE",
    subtitle: "올인원 관리 플랜",
    features: [
      "유지보수 : 무제한",
      "블로그 : 월 4회 (주 1회)",
      "인스타 : 월 12회 (주 3회)",
      "스레드 : 월 12회 (주 3회)",
      "네이버 키워드/당근 플레이스 광고 세팅 무료",
      "월 성과 체크",
      "랜딩 개선",
      "광고관리",
      "SEO 최적화",
    ],
    oldPrice: "월 678,000원",
    newPrice: "월 339,000원",
    priceSuffix: "~",
    highlight: true,
  },
];

// 광고 플랜
export const AD_PLANS: PlanCard[] = [
  {
    name: "네이버 광고",
    subtitle: "키워드 셋팅",
    features: [
      "키워드 분석",
      "광고 세팅 지원",
      "광고 문구 제작",
      "문의 구조 연결",
      "채널 연동 지원",
      "성과 최적화",
    ],
    oldPrice: "298,000원",
    newPrice: "149,000원",
    priceSuffix: "~",
  },
  {
    name: "당근 플레이스 광고",
    subtitle: "키워드 셋팅",
    features: [
      "지역 키워드 분석",
      "광고 세팅 지원",
      "광고 문구 제작",
      "지역 타겟 설정",
      "랜딩 연결 지원",
      "성과 최적화",
    ],
    oldPrice: "158,000원",
    newPrice: "79,000원",
    priceSuffix: "~",
  },
];

export const PRICING_NOTES: string[] = [
  "표기된 모든 가격은 VAT 포함 금액입니다.",
  "도메인은 고객님 명의로 등록되며 비용은 별도입니다. 위플로우에서 등록 및 연결 세팅은 무료 지원해 드립니다. (도메인 연결 지원 / 도메인 등록 대행 가능 / 도메인 비용 별도)",
  "광고비는 고객 계정에서 고객 결제수단으로 직접 결제되며, 위플로우는 운영 및 세팅만 진행합니다.",
  "유지보수는 텍스트, 이미지, 링크 등 경미한 수정 기준입니다. 페이지 추가 및 기능 개발은 별도 비용이 발생할 수 있습니다.",
];
