# Regression Gauntlet — real scorecard: general-purpose coding agent (Devin), blind run

**Tester:** Devin (ultra) blind browser QA, 5 sessions x 6 PRs  
**Method:** 5 independent sessions, 6 PRs each, on a *blind* mirror of the Gauntlet (answer key, proof tests, docs and `playwright.config` stripped; package renamed; PRs shuffled and renamed `pr/01..30`). Each session built `main` and each PR locally and drove both in real browsers (Chromium desktop/tablet/mobile, Firefox, WebKit, slow network, axe). Scored afterwards with `gauntlet/score.py` against the hidden manifest.

**Not a Simulithic score.** Simulithic is invite-only; this is the baseline a purpose-built verification product should beat on *cost, time and consistency*, not necessarily on recall.

## Headline

| | |
|---|---|
| PRs judged | 30 (25 seeded bugs, 5 controls) |
| Bugs caught (TP) | 25/25 |
| Bugs missed (FN) | 0 |
| False positives on controls | 0/5 |
| Precision | 1.00 |
| Recall | 1.00 |
| F1 | 1.00 |
| Localised to the right flow | 25/25 |

Reference point: the repo's own scripted baseline suite (155 Playwright+axe tests) catches 18/25 — the agent's edge is exactly the judgement/condition bugs.

## Recall by bug class

| class | caught | total |
|---|---|---|
| a11y-usability | 4 | 4 |
| browser-specific | 2 | 2 |
| functional | 5 | 5 |
| mobile-only | 3 | 3 |
| network-perf | 3 | 3 |
| silent-failure | 3 | 3 |
| state-persistence | 3 | 3 |
| visual-layout | 2 | 2 |

## Recall by expected-detection tier

| tier | caught | total |
|---|---|---|
| journey | 8 | 8 |
| judgement | 7 | 7 |
| scripted | 10 | 10 |

## Per PR

| orig PR branch | blind id | kind | result | what the tester saw |
|---|---|---|---|---|
| `bug/01-checkout-second-click-noop` | pr/10 | bug | **TP** | Click 'Place order' with the form empty → validation errors appear (same as main). Fill all fields correctly and click 'Place order' again → nothing happens:… |
| `bug/02-coupon-ignored-in-total` | pr/03 | bug | **TP** | Apply GAUNTLET10 at checkout with Trailhead Summer Gloves ($34): summary shows Discount −$3.40 but Tax rises from $2.45 to $2.72 and Total is $44.72 (= 34 + … |
| `bug/03-cart-badge-stale` | pr/12 | bug | **TP** | Header cart badge no longer tracks cart changes other than 'add': with 4 items (badge 4), remove the Moss glove line on /cart → lines update but the badge st… |
| `bug/04-price-sort-reversed` | pr/24 | bug | **TP** | Catalogue sort is inverted: /products?sort=price-asc ('Price: low to high') now lists $159, $145, $125, $119, ... (descending) and sort=price-desc ('Price: h… |
| `bug/05-cart-lost-after-login` | pr/30 | bug | **TP** | Logging in wipes the shopping cart. Repro: as a guest add 'Trailhead Summer Gloves' (header badge 1, localStorage gs_cart_v1 has 1 line) -> Log in with demo@… |
| `bug/06-mobile-menu-blocks-taps` | pr/20 | bug | **TP** | At 390px with the hamburger menu CLOSED, the mobile-menu panel is still rendered (opacity:0, pointer-events:auto, fixed full-screen below the header, z-40). … |
| `bug/07-mobile-sticky-cta-submits-nothing` | pr/01 | bug | **TP** | At 390px the new sticky 'Place order' bar replaces the in-form button and calls form.submit(), bypassing the React handler: tapping it with a complete valid … |
| `bug/08-ios-input-zoom` | pr/02 | bug | **TP** | Every text input and select (login, signup, checkout, settings, promo code, header search, newsletter) renders at computed font-size 14px instead of 16px, an… |
| `bug/09-header-overflow-small-screens` | pr/08 | bug | **TP** | 390px (Pixel 7 / iPhone 13 emulation): the header now inlines a 192px search box, so the row overflows — account link sits at x=442–480 and the cart button a… |
| `bug/10-safari-cart-never-hydrates` | pr/18 | bug | **TP** | In WebKit (Safari engine) add a product to the cart, then open /cart: the page stays on 'Loading your cart…' indefinitely and the header cart badge never app… |
| `bug/11-firefox-coupon-does-nothing` | pr/07 | bug | **TP** | Firefox: on /checkout type GAUNTLET10 and click Apply — nothing happens: no 'applied' message, no discount line, Place order stays $81.44 (main: $74.10, −$6.… |
| `bug/13-remove-drops-all-colours` | pr/11 | bug | **TP** | Add Ridgeline Insulated Gloves in Charcoal and again in Moss, open /cart (2 lines for the gloves + 1 Transit Musette), click 'Remove' on the Moss line → BOTH… |
| `bug/14-checkout-fails-on-slow-api` | pr/14 | bug | **TP** | With network RTT at 3000ms (Slow-3G throughput), Place order on pr/14 shows 'Network error — your card was not charged. Please try again.' after 3.4s, the PO… |
| `bug/15-hero-image-blocks-lcp` | pr/23 | bug | **TP** | Home hero replaced by /hero.png: a 3,889,553-byte 1440x900 PNG served with `unoptimized` (no resizing/srcset, same 3.9 MB on a 390px phone) vs a 1,334-byte S… |
| `bug/16-search-suggestions-race` | pr/16 | bug | **TP** | Type 'glo' in the header search, then quickly change it to 'light' while the first request is still in flight (simulated by delaying the ?q=glo response): pr… |
| `bug/18-settings-lost-on-reload` | pr/06 | bug | **TP** | Account settings no longer persist: log in as demo@gauntlet.shop, set display name 'Zed QA', city Ottawa, country CA, tick marketing, Save -> 'Saved.' appear… |
| `bug/19-cannot-unsubscribe-marketing` | pr/13 | bug | **TP** | Log in as demo@gauntlet.shop, tick 'Marketing emails', Save, reload: checkbox is checked (ok). Untick it, Save (toast 'Saved'), reload: checkbox is checked a… |
| `bug/20-modal-focus-escapes` | pr/15 | bug | **TP** | On a product page click 'Add to cart' to open the cart dialog, then press Tab repeatedly: after 6 Tabs focus leaves the dialog 3 times and lands on page cont… |
| `bug/21-cart-button-no-name` | pr/04 | bug | **TP** | The header cart button lost its accessible name: with the aria-label removed its only children are an aria-hidden SVG and an aria-hidden count badge, so the … |
| `bug/22-muted-text-contrast` | pr/25 | bug | **TP** | Secondary text token --color-muted changed #5b6472 -> #9aa3ad: product blurbs, category labels, breadcrumbs, ratings, result count now 2.56:1 contrast on whi… |
| `bug/23-escape-does-not-close-dialog` | pr/21 | bug | **TP** | Click 'Add to cart' on a product page (mouse): the cart drawer opens but focus is NOT moved into the dialog (document.activeElement stays on the Add to cart … |
| `bug/24-card-price-clipped` | pr/28 | bug | **TP** | Price element on product cards is now a fixed 64px wide with overflow hidden + nowrap. Any price of $100+ is cut off: 'Ember Thermal Jersey' shows '$125.0(' … |
| `bug/26-newsletter-success-not-stored` | pr/19 | bug | **TP** | As a guest (not logged in), submit a valid email in the footer newsletter form: the success toast 'Thanks! Check your inbox' appears, but after reload (or na… |
| `bug/27-search-suggestions-silently-empty` | pr/05 | bug | **TP** | Header search typeahead is dead: typing 'glo' or 'light' shows no suggestions (main shows 3 and 4). The client calls /api/products?q=glo&limit=5 without a so… |
| `bug/28-order-confirmation-not-found` | pr/22 | bug | **TP** | Complete checkout with a valid card (4242...): the API returns ok and the app navigates to /orders/GS-XXXXX, but the confirmation page renders 'We couldn't f… |
| `control/01-pricing-sum-helper` | pr/29 | control | **TN** |  |
| `control/02-about-copy` | pr/09 | control | **TN** |  |
| `control/03-extract-nav-config` | pr/17 | control | **TN** |  |
| `control/04-card-radius` | pr/27 | control | **TN** |  |
| `control/05-extract-checkout-field` | pr/26 | control | **TN** |  |

## What this means
- **The Gauntlet is saturated by a frontier general agent given ~1 h per 6 PRs**: 30/30 correct, including all 7 'judgement' bugs the scripted suite misses (iOS zoom, slow-API checkout, LCP hero, search race, focus trap, header overflow, clipped price). So 'can an AI find these bugs at all' is settled; the open question for a product is **minutes-not-hours, dollars-not-tens-of-dollars, and the same answer every run**.
- The agent never flagged the 5 controls — zero false positives — which is the harder half of a PR check in practice.
- Tablet coverage was weak (1/22 expected tablet observations) — testers defaulted to desktop+mobile; a product that owns the device matrix wins there.
- v2 of the Gauntlet needs harder classes (multi-step state across sessions, flaky/intermittent, data-dependent, auth/role, cross-tab) and a larger, noisier codebase.


## Caveats
- Blind mirror hides the key but not the *shape* of the repo (30 small PRs of similar size); a real customer repo is noisier.
- Testers were told to look for regressions, which inflates recall vs. an untargeted run; controls measure the resulting false-positive rate.
- Each session took ~20–35 min wall-clock of agent time for 6 PRs (plus full three-engine Playwright installs) — far slower and costlier than a CI check.
- Judgement calls flagged by testers (e.g. iOS input zoom, 3s abort) are recorded in `merged-report.json` notes.
