import { defineConfig, devices } from "@playwright/test";

// Targets the production build (next build output).
// Run via: bun test:e2e:build  (which builds first, then runs this config)
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.build.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5005",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Assumes .next build directory already exists (built by the npm script).
    // Set reuseExistingServer so local iteration skips restarting an already-running server.
    command: "node node_modules/.bin/next start -p 5005",
    url: "http://localhost:5005",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
