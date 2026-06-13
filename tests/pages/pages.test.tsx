import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CASES } from "@/lib/cases";

// 페이지는 저장소에서 성공사례를 읽으므로 기본 시드로 모킹한다.
vi.mock("@/lib/store", () => ({
  listCases: vi.fn(async () => CASES),
  getCase: vi.fn(async (slug: string) => CASES.find((c) => c.slug === slug) ?? null),
}));

import HomePage from "@/app/page";
import ServicesPage from "@/app/services/page";
import PricingPage from "@/app/pricing/page";
import CasesPage from "@/app/cases/page";
import DiagnosisPage from "@/app/diagnosis/page";
import ReservationPage from "@/app/reservation/page";
import LandingPage from "@/app/landing/page";
import NotFound from "@/app/not-found";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import CaseDetailPage, { generateMetadata } from "@/app/cases/[slug]/page";
import RootLayout, { metadata, viewport } from "@/app/layout";

describe("static pages render", () => {
  it("home", async () => {
    render(await HomePage());
    expect(screen.getAllByText(/문의로 이어지는/).length).toBeGreaterThan(0);
  });
  it("services", () => {
    render(<ServicesPage />);
    expect(screen.getByText("광고 운영 · 사후관리 시스템")).toBeInTheDocument();
  });
  it("pricing", () => {
    render(<PricingPage />);
    expect(screen.getByText("제작플랜 & 가격안내")).toBeInTheDocument();
    expect(screen.getByText("안내 사항")).toBeInTheDocument();
  });
  it("cases", async () => {
    render(await CasesPage());
    expect(screen.getByText("다양한 업종의 성공 사례")).toBeInTheDocument();
  });
  it("diagnosis", () => {
    render(<DiagnosisPage />);
    expect(screen.getByText("무료진단 받기")).toBeInTheDocument();
  });
  it("reservation", () => {
    render(<ReservationPage />);
    expect(screen.getByText("상담 예약")).toBeInTheDocument();
  });
  it("landing", () => {
    render(<LandingPage />);
    expect(screen.getByText("WEFLOW CARE PLAN")).toBeInTheDocument();
  });
  it("not-found", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });
  it("privacy", () => {
    render(<PrivacyPage />);
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
  });
  it("terms", () => {
    render(<TermsPage />);
    expect(screen.getByText("이용약관")).toBeInTheDocument();
  });
});

describe("case detail page", () => {
  it("builds metadata for a valid and invalid slug", async () => {
    expect((await generateMetadata({ params: { slug: "pt" } })).title).toContain(
      "성공사례",
    );
    expect((await generateMetadata({ params: { slug: "missing" } })).title).toBe(
      "성공사례 | WEFLOW",
    );
  });

  it("renders a valid case", async () => {
    render(await CaseDetailPage({ params: { slug: "pt" } }));
    expect(screen.getByText("OO PT샵")).toBeInTheDocument();
    expect(screen.getByText("진행 포인트")).toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      CaseDetailPage({ params: { slug: "unknown" } }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("root layout", () => {
  it("exposes metadata and viewport", () => {
    expect(metadata.title).toContain("WEFLOW");
    expect(viewport.initialScale).toBe(1);
  });

  it("renders children within the document shell", () => {
    const el = RootLayout({ children: "child" });
    expect(el.props.lang).toBe("ko");
  });
});
