import { test, expect } from "@playwright/test";

test("loading product listing", async ({ page }) => {
  await page.goto("/catalogo");
  await expect(page).toHaveScreenshot(`load-product-listing.png`, {
    timeout: 4000,
  });
});

test("search products", async ({ page }) => {
  await page.goto("/catalogo");
  const newTodo = page.getByPlaceholder("Buscar");

  await newTodo.fill("masilla");
  await newTodo.press("Enter");
  await expect(page).toHaveScreenshot(`search-products.png`, {
    timeout: 4000,
    fullPage: true,
  });
});
