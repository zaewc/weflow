/**
 * 메뉴얼(위플로우 재구성 메뉴얼) — 데이터 계층 명세 검증 (Unit)
 * 각 it는 메뉴얼의 해당 page 요구사항을 검증한다.
 */
import { describe, it, expect } from "vitest";
import { SITE, LINKS, NAV, PROJECT_TYPES } from "@/lib/site";
import {
  PRODUCTION_PLANS,
  CARE_PLANS,
  AD_PLANS,
  PRICING_NOTES,
} from "@/lib/pricing";
import { SIMPLE_STEPS, DETAIL_STEPS, AD_SYSTEM } from "@/lib/process";
import { REVIEWS } from "@/lib/reviews";
import { CASES } from "@/lib/cases";
import { DIAGNOSIS_CHECKS } from "@/lib/diagnosis";

describe("메뉴얼 page1/5/13 — 카테고리 & 회사정보", () => {
  it("상단 카테고리: 홈/서비스/제작플랜&가격안내/성공사례/예약/무료진단받기", () => {
    expect(NAV.map((n) => n.label)).toEqual([
      "홈",
      "서비스",
      "제작플랜&가격안내",
      "성공사례",
      "예약",
      "무료진단받기",
    ]);
    expect(NAV.map((n) => n.href)).toEqual([
      "/",
      "/services",
      "/pricing",
      "/cases",
      "/reservation",
      "/diagnosis",
    ]);
  });

  it("하단바 회사정보 (대표/사업자번호/이메일/운영시간/카피라이트)", () => {
    expect(SITE.name).toBe("WEFLOW");
    expect(SITE.tagline).toBe("제작부터 관리까지 비즈니스 성장을 함께합니다.");
    expect(SITE.ceo).toBe("신서준");
    expect(SITE.bizNo).toBe("884-07-03480");
    expect(SITE.email).toBe("contact@weflowlab.kr");
    expect(SITE.hours).toBe("연중무휴 24시간 상담가능");
    expect(SITE.copyright).toContain("2026");
  });
});

describe("메뉴얼 page15 — 외부 링크/연락처", () => {
  it("전화 010-2971-7280", () => {
    expect(SITE.phone).toBe("010-2971-7280");
    expect(LINKS.phone).toBe("tel:010-2971-7280");
  });
  it("카카오/블로그/인스타/페이스북 링크", () => {
    expect(LINKS.kakao).toBe("http://pf.kakao.com/_xntCbX");
    expect(LINKS.blog).toBe("https://m.blog.naver.com/weflowlab");
    expect(LINKS.instagram).toContain("instagram.com/weflowlab.kr");
    expect(LINKS.facebook).toContain("facebook.com");
  });
});

describe("메뉴얼 page3/7/11 — 제작종류 4종", () => {
  it("랜딩페이지/홈페이지/랜딩&홈페이지/기타(WEFLOW 케어플랜)", () => {
    expect([...PROJECT_TYPES]).toEqual([
      "랜딩페이지 제작",
      "홈페이지 제작",
      "랜딩&홈페이지 제작",
      "기타(WEFLOW 케어플랜)",
    ]);
  });
});

describe("메뉴얼 page8 — 제작 플랜 (3중 택1)", () => {
  it("START 랜딩페이지 498,000 → 249,000", () => {
    const p = PRODUCTION_PLANS.find((x) => x.badge === "START")!;
    expect(p.name).toBe("랜딩페이지");
    expect(p.oldPrice).toBe("498,000원");
    expect(p.newPrice).toBe("249,000원");
    expect(p.features).toEqual(
      expect.arrayContaining(["랜딩페이지 1페이지", "문의폼 연동"]),
    );
  });
  it("GROW 홈페이지 1,980,000 → 990,000", () => {
    const p = PRODUCTION_PLANS.find((x) => x.badge === "GROW")!;
    expect(p.oldPrice).toBe("1,980,000원");
    expect(p.newPrice).toBe("990,000원");
    expect(p.features).toEqual(
      expect.arrayContaining(["홈페이지 5페이지", "카카오톡 상담연동"]),
    );
  });
  it("MASTER 프리미엄 2,980,000 → 1,490,000 (강조)", () => {
    const p = PRODUCTION_PLANS.find((x) => x.badge === "MASTER")!;
    expect(p.oldPrice).toBe("2,980,000원");
    expect(p.newPrice).toBe("1,490,000원");
    expect(p.highlight).toBe(true);
    expect(p.features).toEqual(
      expect.arrayContaining(["광고 전환 구조 설계", "SEO 최적화"]),
    );
  });
});

describe("메뉴얼 page9 — 케어 플랜 (3중 택1)", () => {
  it("WE/FLOW/WEFLOW CARE 가격 + WEFLOW 강조", () => {
    const we = CARE_PLANS.find((x) => x.name === "WE CARE")!;
    const flow = CARE_PLANS.find((x) => x.name === "FLOW CARE")!;
    const weflow = CARE_PLANS.find((x) => x.name === "WEFLOW CARE")!;
    expect(we.newPrice).toBe("월 89,000원");
    expect(flow.newPrice).toBe("월 189,000원");
    expect(weflow.newPrice).toBe("월 339,000원");
    expect(weflow.highlight).toBe(true);
    expect(we.priceSuffix).toBe("~");
  });
});

describe("메뉴얼 page10 — 광고 플랜 + 안내사항", () => {
  it("네이버/당근 광고 가격", () => {
    const naver = AD_PLANS.find((x) => x.name === "네이버 광고")!;
    const danggn = AD_PLANS.find((x) => x.name === "당근 플레이스 광고")!;
    expect(naver.newPrice).toBe("149,000원");
    expect(danggn.newPrice).toBe("79,000원");
  });
  it("안내: VAT / 도메인 / 광고비 / 유지보수", () => {
    const all = PRICING_NOTES.join(" ");
    expect(all).toContain("VAT");
    expect(all).toContain("도메인");
    expect(all).toContain("광고비");
    expect(all).toContain("유지보수");
  });
});

describe("메뉴얼 page2/6 — 제작 진행 과정 & 6단계", () => {
  it("제작 진행 과정 4칸", () => {
    expect(SIMPLE_STEPS.map((s) => s.title)).toEqual([
      "고객 상담",
      "협의 후 제작",
      "3~7일 완료",
      "광고 및 운영 사후 관리",
    ]);
  });
  it("6단계 프로세스 (01~06)", () => {
    expect(DETAIL_STEPS).toHaveLength(6);
    expect(DETAIL_STEPS.map((s) => s.no)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);
    expect(DETAIL_STEPS[0]!.title).toContain("상담");
    expect(DETAIL_STEPS[5]!.title).toContain("광고운영");
  });
  it("광고 운영·사후관리 시스템 8종", () => {
    expect(AD_SYSTEM).toHaveLength(8);
    expect(AD_SYSTEM).toEqual(
      expect.arrayContaining([
        "블로그 업로드",
        "인스타 업로드",
        "스레드 업로드",
        "네이버 키워드 업로드",
        "당근플레이스 키워드 업로드",
        "사이트맵 등록",
      ]),
    );
  });
});

describe("메뉴얼 page3 — 무료진단 체크 4종", () => {
  it("문의 구조 진단/디자인 점검/검색 노출 분석/문의 개선 제안", () => {
    expect(DIAGNOSIS_CHECKS.map((c) => c.label)).toEqual([
      "문의 구조 진단",
      "디자인 점검",
      "검색 노출 분석",
      "문의 개선 제안",
    ]);
  });
});

describe("메뉴얼 page3/4 — 후기(전부)", () => {
  it("후기 25개 이상 + 대표 문구 포함", () => {
    expect(REVIEWS.length).toBeGreaterThanOrEqual(25);
    const texts = REVIEWS.map((r) => r.text);
    expect(texts).toEqual(
      expect.arrayContaining([
        "문의 버튼 위치 바꾸고 상담 문의가 확실히 늘었어요.",
        "다음 프로젝트도 위플로우랑 진행할 예정입니다.",
      ]),
    );
  });
});

describe("메뉴얼 page7 — 성공사례 업종", () => {
  it("PT샵/필라테스/헬스장 등 사례 존재", () => {
    const cats = CASES.map((c) => c.category);
    expect(cats).toEqual(
      expect.arrayContaining(["PT샵", "필라테스", "헬스장"]),
    );
    CASES.forEach((c) => expect(c.image).toMatch(/^\/cases_.+\.jpg$/));
  });
});

describe("메뉴얼 page14 — 병원/의료 콘텐츠 금지", () => {
  it("데이터 어디에도 의료 관련 용어가 없어야 함", () => {
    const blob = JSON.stringify({
      SITE,
      PRODUCTION_PLANS,
      CARE_PLANS,
      AD_PLANS,
      PRICING_NOTES,
      DETAIL_STEPS,
      SIMPLE_STEPS,
      AD_SYSTEM,
      REVIEWS,
      CASES,
      DIAGNOSIS_CHECKS,
    });
    for (const term of ["병원", "의료", "진료", "치과", "성형", "한의원", "약국"]) {
      expect(blob).not.toContain(term);
    }
  });
});
