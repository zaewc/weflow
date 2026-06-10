import { test, expect } from "@playwright/test";

test.describe("submission forms", () => {
  test("free diagnosis submit shows confirmation", async ({ page }) => {
    await page.goto("/diagnosis");
    await page.getByPlaceholder("홍길동").fill("E2E 진단");
    await page.getByPlaceholder("010-0000-0000").fill("010-1234-5678");
    await page.getByRole("combobox").selectOption("랜딩페이지 제작");
    await page.getByPlaceholder(/PT샵/).fill("카페");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "무료진단 후 견적받기" }).click();
    await expect(page.getByText("접수가 완료되었습니다!")).toBeVisible();
  });

  test("reservation requires date and time then submits", async ({ page }) => {
    await page.goto("/reservation");
    const submit = page.getByRole("button", { name: "예약 신청하기" });

    await submit.click();
    await expect(page.getByText("예약 날짜를 선택해주세요.")).toBeVisible();

    // 선택 가능한(비활성 아닌) 날짜 클릭
    const dayButtons = page
      .locator("button")
      .filter({ hasText: /^\d{1,2}$/ })
      .filter({ hasNot: page.locator("[disabled]") });
    await dayButtons.last().click();

    await submit.click();
    await expect(
      page.getByText("예약 시간을 선택하거나 직접 입력해주세요."),
    ).toBeVisible();

    await page.getByRole("button", { name: "14:00" }).click();
    await page.getByPlaceholder("홍길동").fill("E2E 예약");
    await page.getByPlaceholder("010-0000-0000").fill("010-9999-0000");
    await page.getByRole("checkbox").check();
    await submit.click();
    await expect(page.getByText("접수가 완료되었습니다!")).toBeVisible();
  });
});
