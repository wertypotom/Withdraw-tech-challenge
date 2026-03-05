import { test, expect } from "@playwright/test";

test.describe("Withdrawal Flow E2E", () => {
  test("Test 1: Happy-path submit shows success state", async ({ page }) => {
    await page.goto("/withdraw");
    await expect(page).toHaveTitle(/Withdraw \| USDT/);

    await page.getByPlaceholder("Enter amount").fill("150.5");
    await page.getByPlaceholder("Enter wallet address").fill("TRX987654321");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Submit withdrawal/i }).click();

    const successTitle = page.getByRole("heading", {
      name: "Withdrawal submitted",
    });
    await expect(successTitle).toBeVisible({ timeout: 10000 });

    const successId = page.locator("p", { hasText: /ID: wd_/ });
    await expect(successId).toBeVisible();
  });

  test("Test 2: 409 Conflict shows error state and Back button", async ({
    page,
  }) => {
    await page.route("**/api/v1/withdrawals", (route) => {
      if (route.request().method() === "POST") {
        route.fulfill({
          status: 409,
          contentType: "application/json",
          body: JSON.stringify({
            error: "conflict",
            message: "Simulated 409: withdrawal already submitted",
          }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto("/withdraw");

    await page.getByPlaceholder("Enter amount").fill("50");
    await page.getByPlaceholder("Enter wallet address").fill("TRX000000001");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Submit withdrawal/i }).click();

    const errorMsg = page.locator("p.text-destructive", {
      hasText: "Simulated 409: withdrawal already submitted",
    });
    await expect(errorMsg).toBeVisible({ timeout: 5000 });

    const backBtn = page.getByRole("button", { name: /Back/i });
    await expect(backBtn).toBeVisible();

    await backBtn.click();
    await expect(page.getByPlaceholder("Enter amount")).toBeVisible();
  });
});
