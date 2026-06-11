/**
 * 메뉴얼 — 페이지/컴포넌트 렌더 명세 검증 (Integration)
 * 실제 화면에 메뉴얼이 요구하는 텍스트/요소가 나타나는지 확인한다.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";
import ServicesPage from "@/app/services/page";
import PricingPage from "@/app/pricing/page";
import CasesPage from "@/app/cases/page";
import DiagnosisPage from "@/app/diagnosis/page";
import ReservationPage from "@/app/reservation/page";
import LandingPage from "@/app/landing/page";
import Footer from "@/components/Footer";
import FloatingBar from "@/components/FloatingBar";

describe("메뉴얼 page1/2 — 홈 화면", () => {
  it("메인 배너 문구 & 3개 버튼", () => {
    render(<HomePage />);
    expect(
      screen.getByText(
        "랜딩&홈페이지 제작 · 광고 운영 · 검색 상단 노출 · 맞춤형 웹 솔루션",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/문의로 이어지는/).length).toBeGreaterThan(0);
    expect(screen.getByText(/단순 제작이 아닌 문의 구조까지 설계합니다/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /무료 진단 신청/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "성공 사례 보기" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "WEFLOW 랜딩 페이지" }),
    ).toBeInTheDocument();
  });

  it("작은 박스 3종 (케어플랜/빠른제작/합리적 비용)", () => {
    render(<HomePage />);
    expect(screen.getByText("케어 플랜")).toBeInTheDocument();
    expect(screen.getByText("제작·광고·운영")).toBeInTheDocument();
    expect(screen.getByText("빠른제작")).toBeInTheDocument();
    expect(screen.getByText("3일~7일")).toBeInTheDocument();
    expect(screen.getByText("합리적 비용")).toBeInTheDocument();
    expect(screen.getByText("가성비+퀄리티")).toBeInTheDocument();
  });

  it("케어 플랜 혜택 + 진행 흐름", () => {
    render(<HomePage />);
    expect(screen.getByText("WEFLOW만의 케어 플랜 혜택")).toBeInTheDocument();
    expect(screen.getByText("24시간 상담대기")).toBeInTheDocument();
    expect(screen.getByText("고객의뢰")).toBeInTheDocument();
    expect(screen.getByText("3~7일 배송완료")).toBeInTheDocument();
  });

  it("제작 진행 과정(4) + 6단계 프로세스 + 후기", () => {
    render(<HomePage />);
    expect(screen.getAllByText("제작 진행 과정").length).toBeGreaterThan(0);
    expect(screen.getByText("6단계 제작 프로세스")).toBeInTheDocument();
    expect(screen.getByText("실제 고객 후기")).toBeInTheDocument();
    expect(screen.getByText(/후기 더보기/)).toBeInTheDocument();
    // 성공사례 섹션
    expect(screen.getByText("성공사례")).toBeInTheDocument();
  });
});

describe("메뉴얼 page6 — 서비스", () => {
  it("6단계 + 광고/SEO 시스템", () => {
    render(<ServicesPage />);
    expect(screen.getByText("상담 · 진단")).toBeInTheDocument();
    expect(screen.getByText("기획 · 설계")).toBeInTheDocument();
    expect(screen.getByText("광고운영 · 사후관리")).toBeInTheDocument();
    expect(
      screen.getByText("광고 운영 · 사후관리 시스템"),
    ).toBeInTheDocument();
    expect(screen.getByText("블로그 업로드")).toBeInTheDocument();
    expect(screen.getByText("사이트맵 등록")).toBeInTheDocument();
  });
});

describe("메뉴얼 page8/9/10 — 제작플랜 & 가격안내", () => {
  it("제작/케어/광고 플랜 + 세일가 + 안내", () => {
    render(<PricingPage />);
    expect(
      screen.getByRole("heading", { name: "제작플랜 & 가격안내" }),
    ).toBeInTheDocument();
    // 제작 플랜
    expect(screen.getByText("249,000원")).toBeInTheDocument();
    expect(screen.getByText("990,000원")).toBeInTheDocument();
    expect(screen.getByText("1,490,000원")).toBeInTheDocument();
    expect(screen.getByText("498,000원")).toBeInTheDocument(); // 취소선 원가
    // 케어 플랜
    expect(screen.getByText("WE CARE")).toBeInTheDocument();
    expect(screen.getByText("WEFLOW CARE")).toBeInTheDocument();
    // 광고 플랜
    expect(screen.getByText("네이버 광고")).toBeInTheDocument();
    expect(screen.getByText("당근 플레이스 광고")).toBeInTheDocument();
    // 안내
    expect(screen.getByText("안내 사항")).toBeInTheDocument();
    expect(screen.getByText(/VAT 포함/)).toBeInTheDocument();
  });
});

describe("메뉴얼 page7 — 성공사례", () => {
  it("타이틀 + 업종 + 더보기", () => {
    render(<CasesPage />);
    expect(
      screen.getByRole("heading", { name: "다양한 업종의 성공 사례" }),
    ).toBeInTheDocument();
    expect(screen.getByText("이런 업종을 함께했습니다")).toBeInTheDocument();
    expect(screen.getByText("세무사 사무소")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /더보기/ })).toHaveAttribute(
      "href",
      "/diagnosis",
    );
  });
});

describe("메뉴얼 page3 — 무료진단", () => {
  it("체크 4종 + 폼 필드 + 동의 + 버튼", () => {
    render(<DiagnosisPage />);
    expect(
      screen.getByRole("heading", { name: "무료진단 받기" }),
    ).toBeInTheDocument();
    ["문의 구조 진단", "디자인 점검", "검색 노출 분석", "문의 개선 제안"].forEach(
      (t) => expect(screen.getByText(new RegExp(t))).toBeInTheDocument(),
    );
    expect(screen.getByPlaceholderText("홍길동")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("010-0000-0000")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByText("개인정보 수집 및 상담 이용에 동의합니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "무료진단 후 견적받기" }),
    ).toBeInTheDocument();
    // 제작종류 4종 옵션
    ["랜딩페이지 제작", "홈페이지 제작", "랜딩&홈페이지 제작"].forEach((t) =>
      expect(screen.getByRole("option", { name: t })).toBeInTheDocument(),
    );
  });
});

describe("메뉴얼 page7 — 예약창", () => {
  it("달력 + 시간 20개(9:00~18:30) + 직접입력 + 폼", () => {
    render(<ReservationPage />);
    expect(
      screen.getByRole("heading", { name: "상담 예약" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "09:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "18:30" })).toBeInTheDocument();
    expect(
      screen.getByText("원하시는 시간대 (직접 입력)"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("홍길동")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("010-0000-0000")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "예약 신청하기" }),
    ).toBeInTheDocument();
  });
});

describe("메뉴얼 page11/12 — 랜딩페이지", () => {
  it("문구 + 버튼 + 사이드 폼 + 8카드 + 진단/후기", () => {
    render(<LandingPage />);
    expect(screen.getAllByText(/문의로 이어지는/).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/기획부터 제작, 광고 연동, 운영 관리까지/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /무료 진단 후 견적받기/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "실제 제작 성공 보기" }),
    ).toBeInTheDocument();
    expect(screen.getByText("WEFLOW CARE PLAN")).toBeInTheDocument();
    expect(screen.getByText("전체 플랜 한눈에 보기")).toBeInTheDocument();
    expect(
      screen.getByText("무료진단에서 이런 걸 확인해드립니다"),
    ).toBeInTheDocument();
    expect(screen.getByText("실제 고객 후기")).toBeInTheDocument();
    // 8개 플랜 카드(제작3+케어3+광고2)의 대표 가격 노출
    expect(screen.getByText("249,000원")).toBeInTheDocument();
    expect(screen.getByText("월 339,000원")).toBeInTheDocument();
  });
});

describe("메뉴얼 page5/13 — 하단 푸터", () => {
  it("회사정보 + 서비스/케어/상담문의 + 약관", () => {
    render(<Footer />);
    expect(screen.getByText(/대표 : 신서준/)).toBeInTheDocument();
    expect(screen.getByText(/884-07-03480/)).toBeInTheDocument();
    expect(screen.getByText(/contact@weflowlab.kr/)).toBeInTheDocument();
    expect(screen.getByText("WE 케어")).toBeInTheDocument();
    expect(screen.getByText("FLOW 케어")).toBeInTheDocument();
    expect(screen.getByText("WEFLOW 케어")).toBeInTheDocument();
    expect(screen.getByText("전화문의").closest("a")).toHaveAttribute(
      "href",
      "tel:010-2971-7280",
    );
    expect(screen.getByText("카카오 채널 문의")).toBeInTheDocument();
    expect(screen.getByText("인스타 문의")).toBeInTheDocument();
    expect(screen.getByText("페이스북 문의")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    expect(screen.getByText("이용약관")).toBeInTheDocument();
  });
});

describe("메뉴얼 page5/13 — 항상 보이는 하단바 4종", () => {
  it("24시간 상담/카카오톡문의/블로그/무료진단", () => {
    render(<FloatingBar />);
    expect(screen.getByText("24시간 상담")).toBeInTheDocument();
    expect(screen.getByText("카카오톡문의")).toBeInTheDocument();
    expect(screen.getByText("블로그")).toBeInTheDocument();
    expect(screen.getByText("무료진단").closest("a")).toHaveAttribute(
      "href",
      "/diagnosis",
    );
    expect(screen.getByText("24시간 상담").closest("a")).toHaveAttribute(
      "href",
      "tel:010-2971-7280",
    );
  });
});
