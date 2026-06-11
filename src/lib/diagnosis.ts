import {
  Search,
  Palette,
  BarChart3,
  MessageSquarePlus,
  type LucideIcon,
} from "lucide-react";

// 무료진단 체크 항목 (메뉴얼 page 3 / 12)
export interface DiagnosisCheck {
  Icon: LucideIcon;
  label: string;
}

export const DIAGNOSIS_CHECKS: DiagnosisCheck[] = [
  { Icon: Search, label: "문의 구조 진단" },
  { Icon: Palette, label: "디자인 점검" },
  { Icon: BarChart3, label: "검색 노출 분석" },
  { Icon: MessageSquarePlus, label: "문의 개선 제안" },
];
