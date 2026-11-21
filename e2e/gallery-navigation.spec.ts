import { test, expect } from "@playwright/test";
const hydrated = async (page: import("@playwright/test").Page) => {
  await expect(page.locator('html[data-app-ready="true"]')).toHaveCount(1);
};

test("gallery stays synchronized after rapid navigation and keyboard selection", async ({
  page,
}) => {
  await page.goto("/propiedades/jardin-claret");
  await hydrated(page);
  await expect(page.locator('[aria-roledescription="carrusel"]')).toHaveAttribute(
    "data-ready",
    "true",
  );
  const gallery = page.getByRole("region", { name: "Fotos de la propiedad" });
  const thumbnails = gallery.getByRole("button", { name: /^Ver foto/ });
  await expect(thumbnails).toHaveCount(2);
  const hero = gallery.locator("[tabindex='0']");
  const heroBox = await hero.boundingBox();
  const railBox = await gallery.locator('[aria-label="Elegir foto"]').boundingBox();
  expect(railBox!.y - (heroBox!.y + heroBox!.height)).toBeLessThan(25);
  await page.getByRole("button", { name: "Foto siguiente", exact: true }).evaluate((button) => {
    for (let n = 0; n < 19; n++) (button as HTMLButtonElement).click();
  });
  await expect(thumbnails.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(gallery.locator('[aria-live="polite"]')).toHaveText("2/2");
  await expect
    .poll(() =>
      gallery
        .locator('[aria-hidden="false"] img')
        .evaluate(
          (image) =>
            (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
        ),
    )
    .toBe(true);
  await hero.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(thumbnails.nth(0)).toHaveAttribute("aria-current", "true");
  await expect(page.locator("body")).not.toContainText("Cargando foto…");
});

test("touch swipe changes the selected photo without blocking vertical page scrolling", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Touch input is verified on emulated mobile devices");
  await page.goto("/propiedades/jardin-claret");
  await hydrated(page);
  await expect(page.locator('[aria-roledescription="carrusel"]')).toHaveAttribute(
    "data-ready",
    "true",
  );
  const viewport = page.locator(
    '[aria-label="Galería: usá las flechas o deslizá para cambiar de foto"]',
  );
  await viewport.scrollIntoViewIfNeeded();
  const box = (await viewport.boundingBox())!;
  const cdp = await page.context().newCDPSession(page);
  const y = Math.min((page.viewportSize()?.height ?? 844) - 120, box.y + box.height / 2);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width * 0.8, y }],
  });
  for (let n = 1; n <= 8; n++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + box.width * (0.8 - n * 0.075), y }],
    });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.getByRole("button", { name: "Ver foto 2", exact: true })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(viewport.locator(":scope > div")).toHaveCSS("touch-action", "pan-y pinch-zoom");
});

test("header contracts on scroll and footer keeps official destinations", async ({ page }) => {
  await page.goto("/propiedades");
  await hydrated(page);
  const header = page.locator("header.site-header");
  await expect(header).toHaveAttribute("data-scrolled", "false");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(header).toHaveAttribute("data-scrolled", "true");
  await expect(
    page.locator("footer").getByRole("link", { name: "Tempo Hogar: alojamientos temporarios" }),
  ).toHaveAttribute("href", "https://www.tempohogar.com.ar/");
  await expect(page.locator("footer img[alt='Tempo Hogar']")).toBeVisible();
});
