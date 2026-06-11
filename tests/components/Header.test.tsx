import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

describe("Header", () => {
  it("renders the limelight nav links at root", () => {
    globalThis.__pathname = "/";
    render(<Header />);
    expect(screen.getByRole("link", { name: "홈" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "서비스" })).toHaveAttribute(
      "href",
      "/services",
    );
    // 클릭 시 라우팅 핸들러(router.push) 실행
    fireEvent.click(screen.getByRole("link", { name: "서비스" }));
  });

  it("resolves the active item from a deeper pathname", () => {
    globalThis.__pathname = "/pricing";
    render(<Header />);
    expect(
      screen.getByRole("link", { name: "제작플랜&가격안내" }),
    ).toHaveAttribute("href", "/pricing");
    expect(screen.getByRole("link", { name: "성공사례" })).toHaveAttribute(
      "href",
      "/cases",
    );
  });

  it("toggles the mobile menu open and closes on link click", () => {
    globalThis.__pathname = "/";
    render(<Header />);
    const toggle = screen.getByLabelText("메뉴 열기");

    // 처음에는 모바일 메뉴 링크가 없음 (데스크톱 링크만)
    expect(screen.getAllByRole("link", { name: "예약" })).toHaveLength(1);

    fireEvent.click(toggle);
    expect(screen.getAllByRole("link", { name: "예약" })).toHaveLength(2);

    // 모바일 메뉴의 링크 클릭 시 닫힘
    const mobileLinks = screen.getAllByRole("link", { name: "예약" });
    fireEvent.click(mobileLinks[mobileLinks.length - 1]!);
    expect(screen.getAllByRole("link", { name: "예약" })).toHaveLength(1);
  });

  it("closes the mobile menu when the diagnosis CTA is clicked", () => {
    globalThis.__pathname = "/";
    render(<Header />);
    fireEvent.click(screen.getByLabelText("메뉴 열기"));
    const ctas = screen.getAllByRole("link", { name: "무료 진단 신청" });
    // 모바일 메뉴의 CTA 클릭 → 닫힘
    fireEvent.click(ctas[ctas.length - 1]!);
    expect(screen.getAllByRole("link", { name: "예약" })).toHaveLength(1);
  });
});
