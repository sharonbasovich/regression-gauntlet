"""Control PRs: harmless refactors / copy / cosmetic changes used to measure false positives."""

CONTROLS = [
    {
        "id": "01", "slug": "pricing-sum-helper",
        "title": "Refactor cart totals helper",
        "body": "Pull the two reduce calls in `computeTotals` into a tiny `sum` helper. Pure refactor, no behaviour change.",
        "kind": "refactor",
        "edits": [
            ("lib/pricing.ts",
             "  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);\n  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);",
             "  const subtotal = sum(items, (i) => i.unitPrice * i.quantity);\n  const itemCount = sum(items, (i) => i.quantity);"),
            ("lib/pricing.ts",
             "export interface Totals {",
             "function sum<T>(list: T[], pick: (item: T) => number): number {\n  return list.reduce((acc, item) => acc + pick(item), 0);\n}\n\nexport interface Totals {"),
        ],
    },
    {
        "id": "02", "slug": "about-copy",
        "title": "About page: mention where we ship from",
        "body": "Small copy addition to the About page intro.",
        "kind": "copy",
        "edits": [("app/about/page.tsx", "__APPEND_FIRST_PARAGRAPH__", " We ship every order from our workshop in Montréal.")],
    },
    {
        "id": "03", "slug": "extract-nav-config",
        "title": "Move primary navigation config to lib/nav.ts",
        "body": "The `NAV` array lived inside the Header component. Move it to `lib/nav.ts` so the footer and sitemap can reuse it later.",
        "kind": "refactor",
        "edits": [("components/Header.tsx", "__EXTRACT_NAV__", "")],
    },
    {
        "id": "04", "slug": "card-radius",
        "title": "Slightly rounder cards",
        "body": "Design nudge: cards go from `rounded-xl` to `rounded-2xl` to match the new buttons in the design system.",
        "kind": "cosmetic",
        "edits": [
            ("app/globals.css",
             "    @apply rounded-xl border border-line bg-white shadow-sm;",
             "    @apply rounded-2xl border border-line bg-white shadow-sm;"),
        ],
    },
    {
        "id": "05", "slug": "extract-checkout-field",
        "title": "Checkout: extract Field component",
        "body": "Move the `Field` input wrapper out of `CheckoutForm.tsx` into its own file so it can be reused by the settings form.",
        "kind": "refactor",
        "edits": [("app/checkout/CheckoutForm.tsx", "__EXTRACT_FIELD__", "")],
    },
]
