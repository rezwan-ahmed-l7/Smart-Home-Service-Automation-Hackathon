import { test, expect } from "@playwright/test";

test("customer can start a service request", async ({ page }) => {
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: /Plumbing/ }).click();
  await expect(page.getByRole("heading", { name: /Request Plumbing/ })).toBeVisible();
});
