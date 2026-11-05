import { defineConfig, devices } from "@playwright/test";

// Proof tests for the seeded regressions. Each proof is a targeted test that
// PASSES on main and FAILS on its bug branch. They are intentionally separate
// from the baseline suite in tests/ and are driven by gauntlet/verify.sh.
const baseURL = process.env.GAUNTLET_BASE_URL ?? "http://localhost:3100";

export default defineConfig({
  testDir: ".",
  testMatch: /\d{2}-.*\.spec\.ts/,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  outputDir: "./.proof-results",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "tablet-834", use: { ...devices["Desktop Chrome"], viewport: { width: 834, height: 1112 }, hasTouch: true } },
    { name: "mobile-390", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    { name: "firefox-1440", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
    { name: "webkit-1440", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
  ],
});
