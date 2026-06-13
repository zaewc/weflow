import { test, expect } from "@playwright/test";

/**
 * 메뉴얼 "전체적으로" 요구사항 — E2E
 */

test.describe("메뉴얼 — 카테고리 네비게이션", () => {
  test("헤더에서 각 페이지로 이동", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "서비스" }).first().click();
    await page.waitForURL(/\/services/);
    await expect(
      page.getByText("광고 운영 · 사후관리 시스템"),
    ).toBeVisible();

    await page.getByRole("link", { name: "제작플랜&가격안내" }).first().click();
    await page.waitForURL(/\/pricing/);
    await expect(
      page.getByRole("heading", { name: "제작플랜 & 가격안내" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "성공사례" }).first().click();
    await page.waitForURL(/\/cases/);
    await expect(
      page.getByRole("heading", { name: "다양한 업종의 성공 사례" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "예약" }).first().click();
    await page.waitForURL(/\/reservation/);
    await expect(
      page.getByRole("heading", { name: "상담 예약" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "무료진단받기" }).first().click();
    await page.waitForURL(/\/diagnosis/);
    await expect(
      page.getByRole("heading", { name: "무료진단 받기" }),
    ).toBeVisible();
  });
});

test.describe("메뉴얼 — 메인 배너 / 플랜 CTA 이동", () => {
  test("배너 'WEFLOW 랜딩 페이지' → 랜딩", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "WEFLOW 랜딩 페이지" }).click();
    await page.waitForURL(/\/landing/, { timeout: 15000 });
    await expect(page.getByText("WEFLOW CARE PLAN")).toBeVisible();
  });

  test("가격 플랜 '무료진단 후 견적받기'는 진단 페이지로 연결", async ({
    page,
  }) => {
    await page.goto("/pricing");
    await expect(
      page.getByRole("link", { name: "무료진단 후 견적받기" }).first(),
    ).toHaveAttribute("href", "/diagnosis");
  });
});

test.describe("메뉴얼 — 하단 고정바는 모든 페이지에 노출", () => {
  for (const path of [
    "/",
    "/services",
    "/pricing",
    "/cases",
    "/reservation",
    "/diagnosis",
    "/landing",
  ]) {
    test(`${path} 에서 하단바 노출`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByText("카카오톡문의")).toBeVisible();
      await expect(page.getByText("무료진단", { exact: true })).toBeVisible();
    });
  }
});

test.describe("메뉴얼 — 모바일 최적화", () => {
  test("모바일 뷰에서 홈 핵심 요소 노출", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /문의로 이어지는/ }),
    ).toBeVisible();
    await expect(page.getByText("무료진단", { exact: true })).toBeVisible();
  });
});
