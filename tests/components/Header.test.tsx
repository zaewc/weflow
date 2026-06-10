import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

describe("Header", () => {
  it("marks home active when pathname is root", () => {
    globalThis.__pathname = "/";
    render(<Header />);
    const home = screen.getByRole("link", { name: "홈" });
    expect(home.className).toContain("bg-brand-50");
  });

  it("marks a section active when pathname matches its prefix", () => {
    globalThis.__pathname = "/services";
    render(<Header />);
    const services = screen.getByRole("link", { name: "서비스" });
    expect(services.className).toContain("bg-brand-50");
    const home = screen.getByRole("link", { name: "홈" });
    expect(home.className).not.toContain("bg-brand-50");
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
