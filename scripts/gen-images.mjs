// Generates deterministic SVG artwork for every product plus the hero image.
// Run: node scripts/gen-images.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const src = require("node:fs").readFileSync(new URL("../lib/products.ts", import.meta.url), "utf8");
const products = [...src.matchAll(/slug: "([^"]+)", name: "([^"]+)", category: "([^"]+)",[\s\S]*?hue: (\d+)/g)].map((m) => ({
  slug: m[1], name: m[2], category: m[3], hue: Number(m[4]),
}));

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

const shapes = {
  gloves: (c) => `<path d="M150 330c-30-40-40-120-20-150 12-18 36-14 44 8l6 40v-90c0-18 30-18 30 0v86V86c0-18 30-18 30 0v138V110c0-18 30-18 30 0v134V150c0-16 28-16 28 0v150c0 50-40 90-80 90h-24c-28 0-52-16-64-40z" fill="${c}" opacity=".92"/>`,
  apparel: (c) => `<path d="M160 90l40-24 56 0 40 24 60 40-30 60-38-18v228H168V172l-38 18-30-60z" fill="${c}" opacity=".92"/><path d="M200 66c10 26 46 26 56 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="6"/>`,
  bags: (c) => `<rect x="110" y="120" width="236" height="260" rx="28" fill="${c}" opacity=".92"/><path d="M170 120v-20c0-40 116-40 116 0v20" fill="none" stroke="${c}" stroke-width="18"/><rect x="140" y="260" width="176" height="80" rx="14" fill="#fff" fill-opacity=".35"/>`,
  lights: (c) => `<circle cx="228" cy="228" r="110" fill="${c}" opacity=".92"/><circle cx="228" cy="228" r="60" fill="#fff" fill-opacity=".8"/><g stroke="${c}" stroke-width="10" stroke-linecap="round" opacity=".7"><path d="M228 60v30M228 366v30M60 228h30M366 228h30M109 109l21 21M326 326l21 21M109 347l21-21M326 130l21-21"/></g>`,
  tools: (c) => `<path d="M120 300l150-150-20-20 40-40 60 60-40 40-20-20-150 150z" fill="${c}" opacity=".92"/><circle cx="330" cy="130" r="44" fill="none" stroke="${c}" stroke-width="22"/><rect x="96" y="286" width="60" height="60" rx="12" fill="${c}"/>`,
  accessories: (c) => `<path d="M100 300c0-90 60-170 128-170s128 80 128 170c-40 20-80 30-128 30s-88-10-128-30z" fill="${c}" opacity=".92"/><path d="M100 300c80 0 176 0 256 0" stroke="#fff" stroke-opacity=".5" stroke-width="8"/>`,
};

mkdirSync("public/products", { recursive: true });

for (const p of products) {
  const r = rng([...p.slug].reduce((a, ch) => a + ch.charCodeAt(0), 7));
  const h = p.hue;
  const bg1 = `hsl(${h} 45% 94%)`;
  const bg2 = `hsl(${(h + 30) % 360} 50% 86%)`;
  const ink = `hsl(${h} 38% 32%)`;
  const dots = Array.from({ length: 5 }, () => {
    const x = 40 + r() * 376, y = 40 + r() * 376, rad = 6 + r() * 26;
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(0)}" fill="${ink}" fill-opacity=".10"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 456 456" width="456" height="456" role="img" aria-label="${p.name}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs>
<rect width="456" height="456" fill="url(#g)"/>${dots}${shapes[p.category](ink)}
</svg>`;
  writeFileSync(`public/products/${p.slug}.svg`, svg);
}

const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-label="Rider silhouette at dawn">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a41"/><stop offset=".55" stop-color="#4b6584"/><stop offset="1" stop-color="#f3b562"/></linearGradient>
<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3e50"/><stop offset="1" stop-color="#111a24"/></linearGradient>
</defs>
<rect width="1200" height="900" fill="url(#sky)"/>
<circle cx="880" cy="560" r="130" fill="#ffd27f" fill-opacity=".9"/>
<path d="M0 640c160-60 300-140 480-120s300 120 480 90 240-80 240-80v370H0z" fill="#3b4f66"/>
<path d="M0 700c200-40 360-100 560-80s320 110 640 60v220H0z" fill="url(#ground)"/>
<g fill="#0e141b">
<circle cx="520" cy="690" r="62" fill="none" stroke="#0e141b" stroke-width="10"/>
<circle cx="700" cy="690" r="62" fill="none" stroke="#0e141b" stroke-width="10"/>
<path d="M520 690l60-110h80l40 110M580 580l100-10M610 690l50-100" fill="none" stroke="#0e141b" stroke-width="10" stroke-linecap="round"/>
<path d="M640 560c-20-30 10-70 30-80 30-14 40-50 60-50 10 0 40 30 26 50-10 16-26 30-30 44-6 20 0 40 10 50z"/>
<circle cx="724" cy="420" r="22"/>
</g>
<rect width="1200" height="900" fill="#000" fill-opacity=".08"/>
</svg>`;
writeFileSync("public/hero.svg", hero);
writeFileSync("public/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1b2a41"/><path d="M9 22l5-12h4l5 12h-3.4l-1-2.6h-5.2l-1 2.6zm5.4-5.2h3.2L16 12.4z" fill="#f3b562"/></svg>`);
console.log(`wrote ${products.length} product images + hero`);
