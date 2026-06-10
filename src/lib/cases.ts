// 성공사례 데이터 (메뉴얼 page 2 / 7 기준)
// 외부 예시: https://weflow-ten.vercel.app/cases

export interface CaseItem {
  slug: string;
  name: string;
  category: string;
  summary: string;
  /** 카드 배경 그라데이션 (이미지 대체) */
  gradient: string;
  /** 상세 지표 */
  metrics: { label: string; value: string }[];
  highlights: string[];
}

export const CASES: CaseItem[] = [
  {
    slug: "pt",
    name: "OO PT샵",
    category: "PT샵",
    summary: "문의 버튼 위치 최적화로 상담 문의가 확실히 늘었습니다.",
    gradient: "from-blue-500 to-indigo-600",
    metrics: [
      { label: "상담 문의", value: "+180%" },
      { label: "제작 기간", value: "4일" },
    ],
    highlights: [
      "PT샵 구조에 맞춘 문의 동선 설계",
      "모바일 상담 버튼 위치 최적화",
      "회원권 안내 → 상담 전환 구조",
    ],
  },
  {
    slug: "pilates",
    name: "OO 필라테스",
    category: "필라테스",
    summary: "문의 동선이 훨씬 좋아지고 예약 문의가 안정적으로 들어옵니다.",
    gradient: "from-rose-400 to-pink-600",
    metrics: [
      { label: "예약 문의", value: "+150%" },
      { label: "이탈률", value: "-32%" },
    ],
    highlights: [
      "체험 수업 신청 폼 연동",
      "강사 소개 · 시간표 가독성 개선",
      "카카오톡 상담 연결",
    ],
  },
  {
    slug: "gym",
    name: "OO 헬스장",
    category: "헬스장",
    summary: "디자인보다 문의 구조를 신경 써서 실제 등록으로 이어졌습니다.",
    gradient: "from-emerald-400 to-teal-600",
    metrics: [
      { label: "신규 등록", value: "+120%" },
      { label: "제작 기간", value: "1주" },
    ],
    highlights: [
      "이용권 비교 섹션 구성",
      "방문 예약 폼 도입",
      "시설 사진 모바일 최적화",
    ],
  },
  {
    slug: "insurance",
    name: "OO 보험설계",
    category: "보험 설계",
    summary: "랜딩페이지 제작 후 상담 문의가 꾸준히 증가했습니다.",
    gradient: "from-sky-400 to-blue-600",
    metrics: [
      { label: "상담 신청", value: "+210%" },
      { label: "광고 전환", value: "2.3x" },
    ],
    highlights: [
      "보험 상담 페이지 정리 · 신뢰 요소 강화",
      "네이버 키워드 광고 연동",
      "문의 폼 단순화",
    ],
  },
  {
    slug: "law",
    name: "OO 법률 사무소",
    category: "법률 사무소",
    summary: "쉬운 설명과 빠른 진행으로 부담 없이 완성했습니다.",
    gradient: "from-slate-500 to-gray-700",
    metrics: [
      { label: "상담 예약", value: "+95%" },
      { label: "체류 시간", value: "+40%" },
    ],
    highlights: [
      "분야별 상담 카테고리 구성",
      "신뢰도 중심 디자인",
      "전화 · 카카오 즉시 연결",
    ],
  },
  {
    slug: "carcenter",
    name: "OO 카센터",
    category: "카센터",
    summary: "지역 키워드 광고와 연결해 방문 문의가 늘었습니다.",
    gradient: "from-amber-400 to-orange-600",
    metrics: [
      { label: "방문 문의", value: "+130%" },
      { label: "지역 노출", value: "상단" },
    ],
    highlights: [
      "당근 플레이스 지역 광고 연동",
      "정비 항목 가격 안내",
      "위치 · 예약 동선 정리",
    ],
  },
  {
    slug: "cafe",
    name: "OO 카페",
    category: "카페",
    summary: "모바일 화면이 훨씬 보기 좋아지고 피드백도 빨랐습니다.",
    gradient: "from-yellow-400 to-amber-600",
    metrics: [
      { label: "모바일 방문", value: "+160%" },
      { label: "제작 기간", value: "3일" },
    ],
    highlights: [
      "인스타 연동 갤러리",
      "메뉴 · 매장 사진 최적화",
      "지도 · 영업시간 안내",
    ],
  },
  {
    slug: "beauty",
    name: "OO 미용실",
    category: "미용실",
    summary: "업종 특성에 맞춰 예약 문의 동선을 새로 잡았습니다.",
    gradient: "from-fuchsia-400 to-purple-600",
    metrics: [
      { label: "예약 문의", value: "+140%" },
      { label: "재방문", value: "+25%" },
    ],
    highlights: [
      "디자이너별 시술 안내",
      "예약 폼 · 카카오 연동",
      "시술 전후 갤러리",
    ],
  },
];
