import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SiteChrome from "@/components/SiteChrome";

describe("SiteChrome", () => {
  it("renders chrome (header/footer/bar) on public pages", () => {
    globalThis.__pathname = "/";
    render(
      <SiteChrome>
        <p>내용</p>
      </SiteChrome>,
    );
    expect(screen.getByText("내용")).toBeInTheDocument();
    // 하단 고정바 항목
    expect(screen.getByText("카카오톡문의")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
  });

  it("hides chrome on admin pages", () => {
    globalThis.__pathname = "/admin";
    render(
      <SiteChrome>
        <p>관리자</p>
      </SiteChrome>,
    );
    expect(screen.getByText("관리자")).toBeInTheDocument();
    expect(screen.queryByText("카카오톡문의")).not.toBeInTheDocument();
  });
});
