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

  test("opens a case detail from the cases grid", async ({ page }) => {
    await page.goto("/cases");
    await page.getByText("OO PT샵").first().click();
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
