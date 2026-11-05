# Answer key — do not read before scoring

The truth for every seeded PR. PR descriptions are deliberately written as ordinary dev PRs and never mention the regression.

Base commit: `ef498d09fffa8e75bea4fd17c0871eebc7dae996`. Branch = PR head. `files` is the full list of files touched by the PR.

## Bugs

### BUG-01 — Guard checkout submit against double-clicks

- Branch: `bug/01-checkout-second-click-noop` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/1
- Class: **functional** · severity: high · expected detection: journey
- Flows: checkout · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `app/checkout/CheckoutForm.tsx`
- Repro: On checkout, click Place order with an empty form (validation errors), fill the form correctly, click Place order again: nothing happens.
- Proof: `gauntlet/proofs/01-checkout-second-click-noop.spec.ts` on project `desktop-1440` (verified)

### BUG-02 — Compute tax on the pre-discount subtotal; extract percentOff helper

- Branch: `bug/02-coupon-ignored-in-total` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/2
- Class: **functional** · severity: high · expected detection: journey
- Flows: checkout · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `lib/pricing.ts`
- Repro: Apply GAUNTLET10 at checkout: the discount line shows -10% but the order total does not go down.
- Proof: `gauntlet/proofs/02-coupon-ignored-in-total.spec.ts` on project `desktop-1440` (verified)

### BUG-03 — Track cart count in state instead of reducing on every render

- Branch: `bug/03-cart-badge-stale` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/3
- Class: **functional** · severity: medium · expected detection: journey
- Flows: cart · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `components/CartProvider.tsx`
- Repro: Add an item, open /cart, remove it (or change its quantity): the header badge keeps the old number.
- Proof: `gauntlet/proofs/03-cart-badge-stale.spec.ts` on project `desktop-1440` (verified)

### BUG-04 — Share the price comparator between sort modes

- Branch: `bug/04-price-sort-reversed` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/4
- Class: **functional** · severity: medium · expected detection: scripted
- Flows: search-filter · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `lib/products.ts`
- Repro: Sort the catalog by "Price: low to high": the most expensive products are listed first (and vice versa).
- Proof: `gauntlet/proofs/04-price-sort-reversed.spec.ts` on project `desktop-1440` (verified)

### BUG-05 — Login: load the account cart and hard-navigate after sign-in

- Branch: `bug/05-cart-lost-after-login` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/5
- Class: **state-persistence** · severity: high · expected detection: journey
- Flows: auth, cart, checkout · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `components/AuthForm.tsx`
- Repro: Add an item to the cart, log in (e.g. from checkout): the cart is empty after the redirect.
- Proof: `gauntlet/proofs/05-cart-lost-after-login.spec.ts` on project `desktop-1440` (verified)

### BUG-06 — Fade the mobile menu in and out

- Branch: `bug/06-mobile-menu-blocks-taps` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/6
- Class: **mobile-only** · severity: critical · expected detection: scripted
- Flows: browse, product, cart, checkout, mobile-nav · devices: mobile · browsers: all · network: any
- Files: `components/Header.tsx`
- Repro: On a viewport narrower than 768px nothing below the header can be tapped (e.g. Add to cart) because the invisible menu panel sits on top of the page.
- Proof: `gauntlet/proofs/06-mobile-menu-blocks-taps.spec.ts` on project `mobile-390` (verified)

### BUG-07 — Sticky checkout CTA on mobile

- Branch: `bug/07-mobile-sticky-cta-submits-nothing` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/7
- Class: **mobile-only** · severity: critical · expected detection: scripted
- Flows: checkout · devices: mobile · browsers: all · network: any
- Files: `app/checkout/CheckoutForm.tsx`
- Repro: On a phone-width viewport, tap Place order in the sticky bar: the page reloads with the form values in the URL and no order is placed.
- Proof: `gauntlet/proofs/07-mobile-sticky-cta-submits-nothing.spec.ts` on project `mobile-390` (verified)

### BUG-08 — Tighten form control typography

- Branch: `bug/08-ios-input-zoom` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/8
- Class: **mobile-only** · severity: low · expected detection: judgement
- Flows: checkout, auth, settings, newsletter · devices: mobile · browsers: ios-safari · network: any
- Files: `app/globals.css`
- Repro: On iOS Safari, focusing any text input zooms the page in (font-size below 16px) and leaves it zoomed after blur.
- Proof: `gauntlet/proofs/08-ios-input-zoom.spec.ts` on project `mobile-390` (verified)

### BUG-09 — Show the header search on every breakpoint

- Branch: `bug/09-header-overflow-small-screens` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/9
- Class: **visual-layout** · severity: medium · expected detection: judgement
- Flows: browse, mobile-nav, search-filter · devices: mobile, tablet · browsers: all · network: any
- Files: `components/Header.tsx`
- Repro: At 390px (and 834px) the header is wider than the viewport: the page scrolls horizontally and the cart/account icons are pushed off-screen.
- Proof: `gauntlet/proofs/09-header-overflow-small-screens.spec.ts` on project `mobile-390` (verified)

### BUG-10 — Defer cart hydration until the browser is idle

- Branch: `bug/10-safari-cart-never-hydrates` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/10
- Class: **browser-specific** · severity: high · expected detection: scripted
- Flows: cart, checkout · devices: desktop, tablet, mobile · browsers: safari, webkit · network: any
- Files: `components/CartProvider.tsx`
- Repro: In Safari/WebKit the cart never hydrates: the header badge never appears, the cart is empty after a reload and the checkout button stays disabled.
- Proof: `gauntlet/proofs/10-safari-cart-never-hydrates.spec.ts` on project `webkit-1440` (verified)

### BUG-11 — Scroll the order summary into view after applying a promo code

- Branch: `bug/11-firefox-coupon-does-nothing` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/11
- Class: **browser-specific** · severity: medium · expected detection: scripted
- Flows: checkout · devices: desktop, tablet, mobile · browsers: firefox · network: any
- Files: `app/checkout/CheckoutForm.tsx`
- Repro: In Firefox, clicking Apply with a valid promo code does nothing (no message, no discount) because `scrollIntoViewIfNeeded` is not implemented there.
- Proof: `gauntlet/proofs/11-firefox-coupon-does-nothing.spec.ts` on project `firefox-1440` (verified)

### BUG-13 — Simplify the cart remove API

- Branch: `bug/13-remove-drops-all-colours` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/12
- Class: **functional** · severity: medium · expected detection: journey
- Flows: cart · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `components/CartProvider.tsx`, `app/cart/CartView.tsx`
- Repro: Add the same product in two colours, open /cart and remove one of them: both lines disappear.
- Proof: `gauntlet/proofs/13-remove-drops-all-colours.spec.ts` on project `desktop-1440` (verified)

### BUG-14 — Fail fast when the payment request hangs

- Branch: `bug/14-checkout-fails-on-slow-api` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/13
- Class: **network-perf** · severity: high · expected detection: judgement
- Flows: checkout · devices: desktop, tablet, mobile · browsers: all · network: slow (checkout API round-trip > 3 s, e.g. throttled 3G)
- Files: `app/checkout/CheckoutForm.tsx`
- Repro: With the checkout API taking more than ~2.5 s (slow network or busy processor), Place order always ends in "Network error — your card was not charged" although the order would have gone through.
- Proof: `gauntlet/proofs/14-checkout-fails-on-slow-api.spec.ts` on project `desktop-1440` (verified)

### BUG-15 — Replace the illustrated hero with photographic artwork

- Branch: `bug/15-hero-image-blocks-lcp` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/14
- Class: **network-perf** · severity: medium · expected detection: judgement
- Flows: browse · devices: desktop, tablet, mobile · browsers: all · network: slow (3G / 1.5 Mbps); also visible on fast networks via Lighthouse
- Files: `app/page.tsx`, `public/hero.png`
- Repro: The home page now downloads a ~3.9 MB uncompressed PNG above the fold; on a throttled connection LCP goes from < 1 s to > 10 s.
- Proof: `gauntlet/proofs/15-hero-image-blocks-lcp.spec.ts` on project `desktop-1440` (verified)

### BUG-16 — Simplify the search suggestion fetch

- Branch: `bug/16-search-suggestions-race` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/15
- Class: **network-perf** · severity: medium · expected detection: judgement
- Flows: search-filter · devices: desktop, tablet, mobile · browsers: all · network: slow / variable latency (responses arrive out of order)
- Files: `components/SearchBox.tsx`
- Repro: Type quickly in the header search on a slow connection: suggestions for an earlier, shorter query replace the ones for what you actually typed.
- Proof: `gauntlet/proofs/16-search-suggestions-race.spec.ts` on project `desktop-1440` (verified)

### BUG-18 — Narrow the profile cookie path

- Branch: `bug/18-settings-lost-on-reload` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/16
- Class: **state-persistence** · severity: high · expected detection: journey
- Flows: settings · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `app/api/account/settings/route.ts`
- Repro: Change a setting and save (toast says saved, API returns 200), reload /account: the old value is back.
- Proof: `gauntlet/proofs/18-settings-lost-on-reload.spec.ts` on project `desktop-1440` (verified)

### BUG-19 — Settings API: treat unset fields as unchanged

- Branch: `bug/19-cannot-unsubscribe-marketing` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/17
- Class: **state-persistence** · severity: medium · expected detection: journey
- Flows: settings · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `app/api/account/settings/route.ts`
- Repro: Turn marketing emails on and save, then turn them off and save (success toast): after a reload the box is checked again. Opting out silently never persists.
- Proof: `gauntlet/proofs/19-cannot-unsubscribe-marketing.spec.ts` on project `desktop-1440` (verified)

### BUG-20 — Modal: drop the manual Tab loop

- Branch: `bug/20-modal-focus-escapes` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/18
- Class: **a11y-usability** · severity: medium · expected detection: judgement
- Flows: cart · devices: desktop, tablet · browsers: all · network: any
- Files: `components/Modal.tsx`
- Repro: Open the cart drawer and press Tab repeatedly: focus leaves the dialog and lands on the page behind it.
- Proof: `gauntlet/proofs/20-modal-focus-escapes.spec.ts` on project `desktop-1440` (verified)

### BUG-21 — Header: remove the hand-maintained aria-label on the cart button

- Branch: `bug/21-cart-button-no-name` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/19
- Class: **a11y-usability** · severity: medium · expected detection: scripted
- Flows: cart, browse · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `components/Header.tsx`
- Repro: The header cart button has no accessible name (axe: button-name, serious); screen readers announce "button".
- Proof: `gauntlet/proofs/21-cart-button-no-name.spec.ts` on project `desktop-1440` (verified)

### BUG-22 — Lighten secondary text per the brand refresh

- Branch: `bug/22-muted-text-contrast` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/20
- Class: **a11y-usability** · severity: medium · expected detection: scripted
- Flows: browse, product, cart, checkout · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `app/globals.css`
- Repro: Secondary text (category labels, descriptions, hints) drops to ~2.5:1 contrast on white (axe: color-contrast, serious).
- Proof: `gauntlet/proofs/22-muted-text-contrast.spec.ts` on project `desktop-1440` (verified)

### BUG-23 — Modal: scope keyboard handling to the dialog and stop stealing focus on open

- Branch: `bug/23-escape-does-not-close-dialog` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/21
- Class: **a11y-usability** · severity: medium · expected detection: scripted
- Flows: cart · devices: desktop, tablet · browsers: all · network: any
- Files: `components/Modal.tsx`
- Repro: Open the cart drawer with the keyboard and press Escape: it stays open (focus is still on the header button, outside the dialog).
- Proof: `gauntlet/proofs/23-escape-does-not-close-dialog.spec.ts` on project `desktop-1440` (verified)

### BUG-24 — Fixed-width price column on product cards

- Branch: `bug/24-card-price-clipped` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/22
- Class: **visual-layout** · severity: low · expected detection: judgement
- Flows: browse, search-filter · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `components/ProductCard.tsx`
- Repro: On product cards with a compare-at price the struck-through price is clipped mid-digit (e.g. "$68.00 $8").
- Proof: `gauntlet/proofs/24-card-price-clipped.spec.ts` on project `desktop-1440` (verified)

### BUG-26 — Newsletter: tie the stored preference to the account session

- Branch: `bug/26-newsletter-success-not-stored` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/23
- Class: **silent-failure** · severity: medium · expected detection: journey
- Flows: newsletter · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `app/api/newsletter/route.ts`
- Repro: Subscribe as a guest: "Thanks!" is shown, but after a reload the form is back and nothing was stored.
- Proof: `gauntlet/proofs/26-newsletter-success-not-stored.spec.ts` on project `desktop-1440` (verified)

### BUG-27 — Products API: case-insensitive sort param and defensive error handling

- Branch: `bug/27-search-suggestions-silently-empty` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/24
- Class: **silent-failure** · severity: medium · expected detection: scripted
- Flows: search-filter · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `app/api/products/route.ts`
- Repro: Header search never shows suggestions: every request without a `sort` param throws inside the handler and is swallowed into `{ products: [] }` with HTTP 200.
- Proof: `gauntlet/proofs/27-search-suggestions-silently-empty.spec.ts` on project `desktop-1440` (verified)

### BUG-28 — Trim the orders cookie

- Branch: `bug/28-order-confirmation-not-found` — PR: https://github.com/sharonbasovich/regression-gauntlet/pull/25
- Class: **silent-failure** · severity: critical · expected detection: scripted
- Flows: checkout · devices: desktop, tablet, mobile · browsers: all · network: any
- Files: `lib/orders.ts`
- Repro: Payment succeeds (API 200, cart cleared) but the confirmation page says "We couldn't find that order" and the order history on /account is empty.
- Proof: `gauntlet/proofs/28-order-confirmation-not-found.spec.ts` on project `desktop-1440` (verified)

## Controls (no regression)

- CTL-01 `control/01-pricing-sum-helper` — refactor: Refactor cart totals helper — https://github.com/sharonbasovich/regression-gauntlet/pull/26
- CTL-02 `control/02-about-copy` — copy: About page: mention where we ship from — https://github.com/sharonbasovich/regression-gauntlet/pull/27
- CTL-03 `control/03-extract-nav-config` — refactor: Move primary navigation config to lib/nav.ts — https://github.com/sharonbasovich/regression-gauntlet/pull/28
- CTL-04 `control/04-card-radius` — cosmetic: Slightly rounder cards — https://github.com/sharonbasovich/regression-gauntlet/pull/29
- CTL-05 `control/05-extract-checkout-field` — refactor: Checkout: extract Field component — https://github.com/sharonbasovich/regression-gauntlet/pull/30
