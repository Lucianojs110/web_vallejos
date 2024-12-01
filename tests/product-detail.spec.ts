import { test, expect } from "@playwright/test";

test("should navigate to product detail", async ({ page }) => {
  await page.goto("/catalogo/placa-de-yeso-std-9-5-mm-x-1-20-x-2-40-novoplack");

  await expect(page).toHaveScreenshot(`product-detail.png`, {
    timeout: 4000,
    fullPage: true,
  });
});
