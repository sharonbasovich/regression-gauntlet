import { expect, test } from "@playwright/test";

test("BUG-15: home page LCP stays under 4 s on a throttled (1.5 Mbps) connection", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "network throttling uses CDP");
  test.setTimeout(90_000);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1_500_000 / 8, uploadThroughput: 750_000 / 8 });
  await page.addInitScript(() => {
    (window as unknown as { __lcp: number }).__lcp = 0;
    new PerformanceObserver((list) => {
      const last = list.getEntries().pop();
      if (last) (window as unknown as { __lcp: number }).__lcp = last.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto("/", { waitUntil: "load", timeout: 80_000 });
  await page.waitForTimeout(1_000);
  const lcp = await page.evaluate(() => (window as unknown as { __lcp: number }).__lcp);
  const heroBytes = await page.evaluate(() =>
    performance.getEntriesByType("resource").filter((e) => /\/hero\./.test(e.name)).reduce((n, e) => n + (e as PerformanceResourceTiming).encodedBodySize, 0),
  );
  console.log(`LCP ${Math.round(lcp)} ms, hero bytes ${heroBytes}`);
  expect(lcp).toBeLessThan(4_000);
});
