import { describe, it, expect } from "vitest";
import { parseCaseInput, DEFAULT_GRADIENT, CASES } from "@/lib/cases";

describe("parseCaseInput", () => {
  const base = {
    name: "OO 카페",
    category: "카페",
    summary: "요약",
    image: "/cases_카페.jpg",
  };

  it("rejects non-object input", () => {
    expect(parseCaseInput(null).ok).toBe(false);
    expect(parseCaseInput("x").ok).toBe(false);
  });

  it("requires name/category/summary/image", () => {
    expect(parseCaseInput({ ...base, name: "  " }).error).toContain("상호명");
    expect(parseCaseInput({ ...base, category: "" }).error).toContain("업종");
    expect(parseCaseInput({ ...base, summary: "" }).error).toContain("요약");
    expect(parseCaseInput({ ...base, image: "" }).error).toContain("이미지");
  });

  it("applies the default gradient when omitted", () => {
    const r = parseCaseInput(base);
    expect(r.ok).toBe(true);
    expect(r.data?.gradient).toBe(DEFAULT_GRADIENT);
  });

  it("keeps a provided gradient", () => {
    const r = parseCaseInput({ ...base, gradient: "from-rose-400 to-pink-600" });
    expect(r.data?.gradient).toBe("from-rose-400 to-pink-600");
  });

  it("normalizes metrics (skips non-objects and incomplete entries)", () => {
    const r = parseCaseInput({
      ...base,
      metrics: [
        { label: "문의", value: "+100%" },
        { label: "빈값", value: "" },
        null,
        "notobj",
        { label: 1, value: 2 },
      ],
    });
    expect(r.data?.metrics).toEqual([{ label: "문의", value: "+100%" }]);
  });

  it("ignores metrics when not an array", () => {
    const r = parseCaseInput({ ...base, metrics: "nope" });
    expect(r.data?.metrics).toEqual([]);
  });

  it("normalizes highlights (trims, drops empty/non-strings)", () => {
    const r = parseCaseInput({
      ...base,
      highlights: [" 포인트1 ", "", 5, "포인트2"],
    });
    expect(r.data?.highlights).toEqual(["포인트1", "포인트2"]);
  });

  it("ignores highlights when not an array", () => {
    const r = parseCaseInput({ ...base, highlights: 123 });
    expect(r.data?.highlights).toEqual([]);
  });
});

describe("CASES seed", () => {
  it("has unique slugs and no medical content", () => {
    const slugs = CASES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const banned = /병원|의료|진료|치과|성형|한의원|약국/;
    CASES.forEach((c) => {
      expect(banned.test(`${c.name}${c.category}${c.summary}`)).toBe(false);
    });
  });
});
