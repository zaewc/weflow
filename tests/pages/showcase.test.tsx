import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ShowcasePage from "@/app/showcase/page";

describe("showcase page", () => {
  it("renders the vendored UI gallery", () => {
    render(<ShowcasePage />);
    expect(screen.getByText("Liquid Glass × Gradients")).toBeInTheDocument();
    expect(screen.getByText("Metal Buttons")).toBeInTheDocument();
    expect(screen.getByText("Liquid Glass Dock")).toBeInTheDocument();
    // CTA(컬러풀) + 리퀴드 버튼
    expect(screen.getByText("무료 진단 신청")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Liquid Glass" }),
    ).toBeInTheDocument();
    // 메탈 버튼 6종
    expect(screen.getByRole("button", { name: "gold" })).toBeInTheDocument();
  });
});
