import { expect, test } from "@playwright/test";

const CV_URL = "/en/cv";

// Section IDs confirmed from component source (e.g., <section id="summary">)
const SECTION_IDS = ["summary", "skills", "experience", "projects", "education", "languages"] as const;

test.describe("CV Page — Stability", () => {
  test("loads with 200 status", async ({ page }) => {
    const response = await page.goto(CV_URL);
    expect(response?.status()).toBe(200);
  });

  test("no JavaScript errors on page load", async ({ page }) => {
    const jsErrors: string[] = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") jsErrors.push(msg.text());
    });
    await page.goto(CV_URL);
    await page.waitForLoadState("networkidle");
    expect(jsErrors).toHaveLength(0);
  });

  for (const sectionId of SECTION_IDS) {
    test(`section #${sectionId} is visible`, async ({ page }) => {
      await page.goto(CV_URL);
      await expect(page.locator(`#${sectionId}`)).toBeVisible();
    });
  }
});

test.describe("CV Page — Header Content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CV_URL);
  });

  test("profile avatar image is present", async ({ page }) => {
    await expect(page.locator('img[alt="Profile Avatar"]')).toBeVisible();
  });

  test("name heading (h1) is rendered and non-empty", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    expect((await h1.textContent())?.trim().length).toBeGreaterThan(0);
  });

  test("contact links are present (phone, email, LinkedIn, GitHub)", async ({ page }) => {
    await expect(page.locator('a[href^="tel:"]')).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible();
    await expect(page.locator('a:has-text("LinkedIn")')).toBeVisible();
    await expect(page.locator('a:has-text("GitHub")')).toBeVisible();
  });
});

test.describe("CV Page — Style", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CV_URL);
  });

  test("Print / Save PDF button is visible in screen mode", async ({ page }) => {
    const btn = page.locator('button:has-text("Print / Save PDF")');
    await expect(btn).toBeVisible();
    const isHidden = await btn.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return s.display === "none" || s.visibility === "hidden";
    });
    expect(isHidden).toBe(false);
  });

  test("section headings have uppercase + tracking-widest classes", async ({ page }) => {
    const h3 = page.locator("section h3").first();
    await expect(h3).toBeVisible();
    const cls = await h3.getAttribute("class");
    expect(cls).toContain("uppercase");
    expect(cls).toContain("tracking-widest");
  });

  test("anchor nav has 6 links to sections", async ({ page }) => {
    const count = await page.locator("nav a").count();
    expect(count).toBeGreaterThanOrEqual(6);
  });
});

test.describe("CV Page — Visual Snapshot", () => {
  test("full page screenshot matches baseline", async ({ page }) => {
    await page.goto(CV_URL);
    await page.waitForLoadState("networkidle");
    await page.locator('img[alt="Profile Avatar"]').waitFor({ state: "visible" });
    await expect(page).toHaveScreenshot("cv-page-full.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
