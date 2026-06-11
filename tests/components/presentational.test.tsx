import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import FloatingBar from "@/components/FloatingBar";
import PlanCardView from "@/components/PlanCard";
import ReviewMarquee from "@/components/ReviewMarquee";
import ProcessSection from "@/components/ProcessSection";
import CaseCard from "@/components/CaseCard";
import StatusBadge from "@/components/admin/StatusBadge";
import Hero from "@/components/home/Hero";
import CarePlanBenefits from "@/components/home/CarePlanBenefits";
import SuccessShowcase from "@/components/home/SuccessShowcase";
import { PRODUCTION_PLANS, CARE_PLANS } from "@/lib/pricing";
import { CASES } from "@/lib/cases";
import type { SubmissionStatus } from "@/lib/types";

describe("Logo", () => {
  it("links home", () => {
    render(<Logo className="x" />);
    expect(screen.getByLabelText("WEFLOW 홈")).toHaveAttribute("href", "/");
  });
});

describe("Footer", () => {
  it("renders company info and external links", () => {
    render(<Footer />);
    expect(screen.getByText(/사업자등록번호/)).toBeInTheDocument();
    expect(screen.getByText("전화문의").closest("a")).toHaveAttribute(
      "href",
      "tel:010-2971-7280",
    );
  });
});

describe("FloatingBar", () => {
  it("renders all four items with internal and external links", () => {
    render(<FloatingBar />);
    expect(screen.getByText("24시간 상담")).toBeInTheDocument();
    expect(screen.getByText("무료진단").closest("a")).toHaveAttribute(
      "href",
      "/diagnosis",
    );
    expect(screen.getByText("블로그").closest("a")).toHaveAttribute(
      "target",
      "_blank",
    );
  });
});

describe("PlanCardView", () => {
  it("renders a highlighted plan with subtitle", () => {
    const master = PRODUCTION_PLANS.find((p) => p.highlight)!;
    render(<PlanCardView plan={master} />);
    expect(screen.getByText("BEST")).toBeInTheDocument();
    expect(screen.getByText(master.oldPrice)).toBeInTheDocument();
    expect(screen.getByText(master.newPrice)).toBeInTheDocument();
  });

  it("renders a non-highlighted plan with badge only", () => {
    const start = PRODUCTION_PLANS[0]!;
    render(<PlanCardView plan={start} />);
    expect(screen.getByText(start.badge!)).toBeInTheDocument();
    expect(screen.queryByText("BEST")).not.toBeInTheDocument();
  });

  it("renders price suffix when present", () => {
    render(<PlanCardView plan={CARE_PLANS[0]!} />);
    expect(screen.getAllByText("~").length).toBeGreaterThan(0);
  });
});

describe("ReviewMarquee", () => {
  it("renders reviews and a more link", () => {
    render(<ReviewMarquee />);
    expect(screen.getByText(/후기 더보기/)).toBeInTheDocument();
    expect(screen.getAllByText(/별|늘었어요|만족/).length).toBeGreaterThan(0);
  });
});

describe("ProcessSection", () => {
  it("renders simple and detailed steps", () => {
    render(<ProcessSection />);
    expect(screen.getAllByText("제작 진행 과정").length).toBeGreaterThan(0);
    expect(screen.getByText("6단계 제작 프로세스")).toBeInTheDocument();
    expect(screen.getByText("상담 · 진단")).toBeInTheDocument();
  });
});

describe("CaseCard", () => {
  it("links to the case detail page", () => {
    const item = CASES[0]!;
    render(<CaseCard item={item} />);
    expect(screen.getByText(item.name).closest("a")).toHaveAttribute(
      "href",
      `/cases/${item.slug}`,
    );
  });
});

describe("StatusBadge", () => {
  it("renders every status label", () => {
    const statuses: SubmissionStatus[] = ["pending", "in_progress", "done"];
    const labels = ["대기", "진행중", "완료"];
    statuses.forEach((s, i) => {
      const { unmount } = render(<StatusBadge status={s} />);
      expect(screen.getByText(labels[i]!)).toBeInTheDocument();
      unmount();
    });
  });
});

describe("home sections", () => {
  it("renders Hero and navigates from the liquid-glass buttons", () => {
    render(<Hero />);
    expect(screen.getByText("무료 진단 신청")).toBeInTheDocument();
    // 리퀴드 글래스 버튼(LiquidButton) 클릭 → 라우팅 핸들러 실행
    fireEvent.click(screen.getByRole("button", { name: "성공 사례 보기" }));
    fireEvent.click(
      screen.getByRole("button", { name: "WEFLOW 랜딩 페이지" }),
    );
  });
  it("renders CarePlanBenefits", () => {
    render(<CarePlanBenefits />);
    expect(screen.getByText("WEFLOW만의 케어 플랜 혜택")).toBeInTheDocument();
  });
  it("renders SuccessShowcase", () => {
    render(<SuccessShowcase />);
    expect(screen.getByText("살펴보기")).toBeInTheDocument();
    expect(screen.getByText("더보기").closest("a")).toHaveAttribute(
      "href",
      "/cases",
    );
  });
});
