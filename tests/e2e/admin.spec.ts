import { test, expect } from "@playwright/test";

const ADMIN_KEY = "weflow2026";

test.describe("admin dashboard", () => {
  test("submitted inquiry appears and can be managed", async ({ page }) => {
    const name = `E2E관리 ${Date.now()}`;

    // 1) 사용자: 무료진단 접수
    await page.goto("/diagnosis");
    await page.getByPlaceholder("홍길동").fill(name);
    await page.getByPlaceholder("010-0000-0000").fill("010-2222-3333");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "무료진단 후 견적받기" }).click();
    await expect(page.getByText("접수가 완료되었습니다!")).toBeVisible();

    // 2) 관리자: 로그인
    await page.goto("/admin");
    await page.getByPlaceholder("관리자 키").fill(ADMIN_KEY);
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page.getByText("WEFLOW 관리자 대시보드")).toBeVisible();

    // 3) 접수 건 노출 확인
    const row = page.locator("tr", { hasText: name });
    await expect(row).toBeVisible();

    // 4) 상태 변경 → 완료 배지
    await row.getByRole("button", { name: "완료" }).click();
    await expect(row.getByText("완료").first()).toBeVisible();

    // 5) 로그아웃
    await page.getByRole("button", { name: /로그아웃/ }).click();
    await expect(page.getByPlaceholder("관리자 키")).toBeVisible();
  });

  test("rejects an invalid admin key", async ({ page }) => {
    await page.goto("/admin");
    await page.getByPlaceholder("관리자 키").fill("nope");
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(
      page.getByText("관리자 키가 올바르지 않습니다."),
    ).toBeVisible();
  });
});
