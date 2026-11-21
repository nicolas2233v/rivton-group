import { test, expect } from "@playwright/test";

for (const path of ["/contacto", "/publicar"]) {
  test(`${path} keeps a bounded desktop composition and usable mobile form`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('html[data-app-ready="true"]')).toHaveCount(1);
    const form = page.locator("main form");
    await expect(form).toBeVisible();
    await expect(form.getByRole("button", { name: /Enviar/ })).toBeVisible();
    const width = page.viewportSize()!.width;
    const formBox = (await form.boundingBox())!;
    expect(formBox.x).toBeGreaterThanOrEqual(20);
    expect(formBox.x + formBox.width).toBeLessThanOrEqual(width - 19);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    if (width >= 1024 && path === "/publicar") {
      const photo = page.locator("main picture img");
      await expect(photo).toBeVisible();
      const photoBox = (await photo.boundingBox())!;
      expect(photoBox.x + photoBox.width).toBeLessThan(formBox.x);
      expect(photoBox.height).toBeLessThan(500);
      expect(formBox.y).toBeLessThan(photoBox.y);
      expect(formBox.height).toBeLessThan(750);
    }
    const submit = form.getByRole("button", { name: /Enviar/ });
    await submit.scrollIntoViewIfNeeded();
    await submit.click();
    await expect(form).toContainText(/Campo obligatorio|Revisá|Ingresá/);
  });
}

test("opening stages still coordinate visibility and return focus to search", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('html[data-app-ready="true"]')).toHaveCount(1);
  const geometry = await page.locator(".scroll-story").evaluate((node) => ({
    top: node.getBoundingClientRect().top + window.scrollY,
    distance: node.getBoundingClientRect().height - node.querySelector<HTMLElement>(".story-stage")!.offsetHeight,
  }));
  for (const [progress, selector] of [[0.5, ".story-second"], [0.95, ".story-third"]] as const) {
    await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), geometry.top + geometry.distance * progress);
    await expect.poll(() => page.locator(selector).evaluate((node) => Number(getComputedStyle(node).opacity))).toBe(1);
    await expect(page.locator(".story-intro")).toHaveAttribute("aria-hidden", "true");
  }
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page.locator('input[data-search-location],input[aria-label="Ubicación"]')).toBeFocused();
});
