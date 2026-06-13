import { describe, it, expect } from "vitest";
import { SITE, LINKS, NAV, PROJECT_TYPES } from "@/lib/site";
import { STATUS_LABEL } from "@/lib/types";
import { CASES } from "@/lib/cases";
import { REVIEWS } from "@/lib/reviews";
import {
  PRODUCTION_PLANS,
  CARE_PLANS,
  AD_PLANS,
  PRICING_NOTES,
} from "@/lib/pricing";
import { SIMPLE_STEPS, DETAIL_STEPS, AD_SYSTEM } from "@/lib/process";

describe("site constants", () => {
  it("exposes core company info", () => {
    expect(SITE.name).toBe("WEFLOW");
    expect(SITE.bizNo).toBe("884-07-03480");
    expect(SITE.phone).toBe("010-2971-7280");
  });

  it("exposes external links and nav", () => {
    expect(LINKS.kakao).toContain("kakao");
    expect(LINKS.phone).toBe("tel:010-2971-7280");
    expect(NAV).toHaveLength(6);
    expect(NAV[0]).toEqual({ label: "홈", href: "/" });
    expect(NAV[5]).toEqual({ label: "무료진단받기", href: "/diagnosis" });
    expect(PROJECT_TYPES).toHaveLength(4);
  });
});

describe("types", () => {
  it("maps every status to a Korean label", () => {
    expect(STATUS_LABEL).toEqual({
      pending: "대기",
      in_progress: "진행중",
      done: "완료",
    });
  });
});

describe("content data", () => {
  it("has cases with unique slugs", () => {
    expect(CASES.length).toBeGreaterThan(0);
    const slugs = new Set(CASES.map((c) => c.slug));
    expect(slugs.size).toBe(CASES.length);
    expect(CASES[0]?.metrics.length).toBeGreaterThan(0);
  });

  it("has reviews", () => {
    expect(REVIEWS.length).toBeGreaterThanOrEqual(25);
    expect(REVIEWS[0]).toHaveProperty("text");
    expect(REVIEWS[0]).toHaveProperty("author");
  });

  it("has pricing plans with one highlight each group", () => {
    expect(PRODUCTION_PLANS).toHaveLength(3);
    expect(CARE_PLANS).toHaveLength(3);
    expect(AD_PLANS).toHaveLength(2);
    expect(PRODUCTION_PLANS.some((p) => p.highlight)).toBe(true);
    expect(CARE_PLANS.some((p) => p.highlight)).toBe(true);
    expect(PRICING_NOTES.length).toBeGreaterThan(0);
  });

  it("has process steps", () => {
    expect(SIMPLE_STEPS).toHaveLength(4);
    expect(DETAIL_STEPS).toHaveLength(6);
    expect(AD_SYSTEM).toHaveLength(8);
  });
});
