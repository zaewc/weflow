import { test, expect } from "@playwright/test";

test.describe("home navigation", () => {
  test("renders hero and persistent floating bar", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /문의로 이어지는/ }),
    ).toBeVisible();
    // 항상 보이는 하단 고정바
    await expect(page.getByText("카카오톡문의")).toBeVisible();
    await expect(page.getByText("무료진단", { exact: true })).toBeVisible();
  });

  test("navigates to pricing and cases", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "제작플랜&가격안내" }).click();
    await expect(
      page.getByRole("heading", { name: "제작플랜 & 가격안내" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "성공사례" }).first().click();
    await expect(
      page.getByRole("heading", { name: "다양한 업종의 성공 사례" }),
    ).toBeVisible();
  });

  test("cases grid links to a case detail page", async ({ page }) => {
    await page.goto("/cases");
    // 카드가 상세 페이지로 연결되는지 (href) 확인 — 이미지 로딩에 따른
    // 클릭 내비게이션 플래키를 피하기 위해 href 검증 + 직접 방문으로 분리
    await expect(
      page.getByRole("link", { name: /OO PT샵/ }).first(),
    ).toHaveAttribute("href", "/cases/pt");

    await page.goto("/cases/pt");
    await expect(
      page.getByRole("heading", { name: "OO PT샵" }),
    ).toBeVisible();
    await expect(page.getByText("진행 포인트")).toBeVisible();
  });

  test("landing page shows the sticky inquiry form", async ({ page }) => {
    await page.goto("/landing");
    await expect(page.getByText("WEFLOW CARE PLAN")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "무료진단 받기" }),
    ).toBeVisible();
  });
});
