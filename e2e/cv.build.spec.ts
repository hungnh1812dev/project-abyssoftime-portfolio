import { expect, test } from "@playwright/test";

const CV_URL = "/en/cv";

// Section IDs are hardcoded in component source — safe to assert on.
const SECTION_IDS = ["summary", "skills", "experience", "projects", "education", "languages"] as const;

// ─── HTTP & Stability ─────────────────────────────────────────────────────────

test.describe("CV Page — HTTP & Stability", () => {
  test("returns 200 status", async ({ page }) => {
    const response = await page.goto(CV_URL);
    expect(response?.status()).toBe(200);
  });

  test("response content-type is text/html", async ({ page }) => {
    const response = await page.goto(CV_URL);
    expect(response?.headers()["content-type"]).toContain("text/html");
  });

  test("page title contains 'CV'", async ({ page }) => {
    await page.goto(CV_URL);
    await expect(page).toHaveTitle(/CV/i);
  });

  test("no JavaScript errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(CV_URL);
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });

  test("no failed network requests for page assets", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (res) => {
      if (res.status() >= 400 && !res.url().includes("favicon")) {
        failed.push(`${res.status()} ${res.url()}`);
      }
    });
    await page.goto(CV_URL);
    await page.waitForLoadState("networkidle");
    expect(failed).toEqual([]);
  });
});

// ─── Section Visibility ───────────────────────────────────────────────────────

test.describe("CV Page — Section Visibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CV_URL);
  });

  for (const id of SECTION_IDS) {
    test(`#${id} section is visible`, async ({ page }) => {
      await expect(page.locator(`#${id}`)).toBeVisible();
    });
  }
});

// ─── Header Content ───────────────────────────────────────────────────────────

test.describe("CV Page — Header Content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CV_URL);
  });

  test("page has exactly one h1", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("h1 is visible and non-empty", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("position subtitle (h2) is visible and non-empty", async ({ page }) => {
    const h2 = page.locator("h2").first();
    await expect(h2).toBeVisible();
    const text = await h2.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("phone link is present", async ({ page }) => {
    await expect(page.locator('a[href^="tel:"]')).toBeVisible();
  });

  test("email link is present", async ({ page }) => {
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible();
  });

  test("LinkedIn link opens in new tab with noopener", async ({ page }) => {
    const link = page.locator('a:has-text("LinkedIn")');
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  });

  test("GitHub link opens in new tab with noopener", async ({ page }) => {
    const link = page.locator('a:has-text("GitHub")');
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  });

  test("profile avatar image is visible", async ({ page }) => {
    await expect(page.locator('img[alt="Profile Avatar"]')).toBeVisible();
  });
});

// ─── Section Content ──────────────────────────────────────────────────────────

test.describe("CV Page — Section Content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CV_URL);
  });

  // Section heading classes are static — safe to assert on regardless of API content.
  test("section headings have uppercase and tracking-widest classes", async ({ page }) => {
    const h3 = page.locator("section h3").first();
    await expect(h3).toBeVisible();
    const cls = await h3.getAttribute("class");
    expect(cls).toContain("uppercase");
    expect(cls).toContain("tracking-widest");
  });

  // Each section heading is rendered and non-empty (text value comes from API, not asserted).
  for (const id of SECTION_IDS) {
    test(`#${id} has a visible non-empty section heading`, async ({ page }) => {
      const h3 = page.locator(`#${id} h3`);
      await expect(h3).toBeVisible();
      const text = await h3.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    });
  }

  test("#skills renders at least one skill item", async ({ page }) => {
    // Skill items render as spans inside the skills section
    const items = page.locator("#skills span");
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);
  });

  test("#experience renders at least one role entry", async ({ page }) => {
    await expect(page.locator("#experience h4").first()).toBeVisible();
  });

  test("#projects renders at least one project entry", async ({ page }) => {
    await expect(page.locator("#projects h4").first()).toBeVisible();
  });

  test("#education renders at least one education entry", async ({ page }) => {
    await expect(page.locator("#education h4").first()).toBeVisible();
  });

  test("#languages renders at least one language entry", async ({ page }) => {
    // Language entries are plain divs with text — check section has visible text content
    const section = page.locator("#languages");
    const text = await section.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });
});

// ─── Anchor Navigation ────────────────────────────────────────────────────────

test.describe("CV Page — Anchor Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CV_URL);
  });

  test("nav renders exactly 6 section links", async ({ page }) => {
    await expect(page.locator("nav a")).toHaveCount(6);
  });

  for (const id of SECTION_IDS) {
    test(`nav contains link to #${id}`, async ({ page }) => {
      await expect(page.locator(`nav a[href="#${id}"]`)).toBeVisible();
    });
  }
});

// ─── Print Button ─────────────────────────────────────────────────────────────

test.describe("CV Page — Print Button", () => {
  test("Print / Save PDF button is visible in screen mode", async ({ page }) => {
    await page.goto(CV_URL);
    const btn = page.locator('button:has-text("Print / Save PDF")');
    await expect(btn).toBeVisible();
    const isHidden = await btn.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return s.display === "none" || s.visibility === "hidden";
    });
    expect(isHidden).toBe(false);
  });

  test("Print / Save PDF button calls window.print()", async ({ page }) => {
    let printCalled = false;
    await page.exposeFunction("__recordPrint", () => {
      printCalled = true;
    });
    await page.addInitScript(() => {
      window.print = () =>
        (window as unknown as { __recordPrint: () => void }).__recordPrint();
    });
    await page.goto(CV_URL);
    await page.locator('button:has-text("Print / Save PDF")').click();
    expect(printCalled).toBe(true);
  });

  test("Print button is keyboard focusable", async ({ page }) => {
    await page.goto(CV_URL);
    const btn = page.locator('button:has-text("Print / Save PDF")');
    await btn.focus();
    await expect(btn).toBeFocused();
  });
});

// ─── ?no-avatar=1 Query Param ────────────────────────────────────────────────

test.describe("CV Page — ?no-avatar=1 Query Param", () => {
  test("avatar image is not rendered when ?no-avatar=1", async ({ page }) => {
    await page.goto(`${CV_URL}?no-avatar=1`);
    await expect(page.locator('img[alt="Profile Avatar"]')).toHaveCount(0);
  });

  test("page still returns 200 and h1 is visible without avatar", async ({ page }) => {
    const response = await page.goto(`${CV_URL}?no-avatar=1`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });
});

// ─── i18n Routing ─────────────────────────────────────────────────────────────

test.describe("CV Page — i18n Routing", () => {
  test("/en/cv returns 200", async ({ page }) => {
    const res = await page.goto("/en/cv");
    expect(res?.status()).toBe(200);
  });

  test("/vi/cv returns 200", async ({ page }) => {
    const res = await page.goto("/vi/cv");
    expect(res?.status()).toBe(200);
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

test.describe("CV Page — Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CV_URL);
  });

  test("all images have a non-empty alt attribute", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `img[${i}] missing alt`).not.toBeNull();
      expect(alt!.trim().length, `img[${i}] has empty alt`).toBeGreaterThan(0);
    }
  });

  test("all target=_blank links have rel=noopener", async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute("rel");
      expect(rel, `external link[${i}] missing noopener`).toContain("noopener");
    }
  });
});

// ─── Visual Snapshot ──────────────────────────────────────────────────────────

test.describe("CV Page — Visual Snapshot (Build)", () => {
  test("full-page screenshot matches baseline", async ({ page }) => {
    await page.goto(CV_URL);
    await page.waitForLoadState("networkidle");
    await page.locator('img[alt="Profile Avatar"]').waitFor({ state: "visible" });
    await expect(page).toHaveScreenshot("cv-page-build-full.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
