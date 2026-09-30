import { test, expect } from "@playwright/test";

test.describe("Public Catalogue E2E Suite", () => {
  test("loads home page and lists published components", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(
      "Tech Inject Component Library",
    );
    await expect(
      page.locator("text=Published Component Registry"),
    ).toBeVisible();
  });

  test("navigates to component detail page for free button component", async ({
    page,
  }) => {
    await page.goto("/components/button");
    await expect(page.locator("h1")).toContainText("Button");
    await expect(page.locator("text=Copy Install Command")).toBeVisible();
  });

  test("shows locked state for premium data-table component when signed out", async ({
    page,
  }) => {
    await page.goto("/components/data-table");
    await expect(page.locator("h3")).toContainText("Premium Component Locked");
    await expect(page.locator("text=Sign In to Premium Account")).toBeVisible();
  });

  test("allows customer login with seed credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "free@techinject.design");
    await page.fill('input[type="password"]', "FreeCustomerPassword123!");
    await page.click('button[type="submit"]');

    await expect(page.locator("h1")).toContainText("free@techinject.design");
    await expect(page.locator("text=Free Customer")).toBeVisible();
  });
});
