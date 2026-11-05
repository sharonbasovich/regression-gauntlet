export type Category =
  | "gloves"
  | "apparel"
  | "bags"
  | "lights"
  | "tools"
  | "accessories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // cents
  compareAt?: number; // cents
  rating: number;
  reviews: number;
  colors: string[];
  badge?: "New" | "Bestseller" | "Limited";
  inStock: boolean;
  short: string;
  description: string;
  specs: Record<string, string>;
  hue: number;
}

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: "gloves", label: "Gloves", blurb: "Grip, warmth and protection for every ride." },
  { id: "apparel", label: "Apparel", blurb: "Layers that work from the trail to the office." },
  { id: "bags", label: "Bags", blurb: "Carry systems built for daily commutes." },
  { id: "lights", label: "Lights", blurb: "Be seen. See further." },
  { id: "tools", label: "Tools", blurb: "Trailside fixes without the frustration." },
  { id: "accessories", label: "Accessories", blurb: "The small things that make the ride." },
];

export const PRODUCTS: Product[] = [
  {
    id: "p01", slug: "ridgeline-insulated-gloves", name: "Ridgeline Insulated Gloves", category: "gloves",
    price: 6800, compareAt: 8500, rating: 4.7, reviews: 212, colors: ["Charcoal", "Moss", "Rust"], badge: "Bestseller", inStock: true, hue: 212,
    short: "Windproof, touchscreen-ready gloves rated to -10°C.",
    description: "The Ridgeline keeps your hands warm without turning them into mittens. A windproof softshell back, a goat-leather palm with silicone print and a brushed micro-fleece lining make it our most-worn glove from October through March. Conductive fingertips work with every phone we have tested.",
    specs: { Shell: "3-layer softshell", Palm: "Goat leather", Insulation: "120 g PrimaLoft Gold", Weight: "118 g (pair, M)" },
  },
  {
    id: "p02", slug: "trailhead-summer-gloves", name: "Trailhead Summer Gloves", category: "gloves",
    price: 3400, rating: 4.4, reviews: 98, colors: ["Black", "Sand"], inStock: true, hue: 36,
    short: "Half-finger gloves with gel padding and a terry thumb.",
    description: "A classic half-finger glove with a vented mesh back, a synthetic leather palm and just enough gel under the ulnar nerve to keep long rides comfortable. The pull tabs between the fingers make taking them off at the café easy.",
    specs: { Back: "Four-way stretch mesh", Palm: "Clarino synthetic leather", Padding: "3 mm gel", Weight: "52 g (pair, M)" },
  },
  {
    id: "p03", slug: "stormline-waterproof-gloves", name: "Stormline Waterproof Gloves", category: "gloves",
    price: 9200, rating: 4.6, reviews: 64, colors: ["Black"], badge: "New", inStock: true, hue: 200,
    short: "Fully seam-sealed gloves for wet, cold commutes.",
    description: "A 3-layer waterproof-breathable shell, a long neoprene cuff and a grippy palm. The Stormline is for the days you would rather not ride but have to. Reflective trim on the knuckles and cuff keeps your signals visible.",
    specs: { Waterproofing: "20k mm hydrostatic head", Cuff: "Neoprene gauntlet", Insulation: "80 g synthetic", Weight: "142 g (pair, M)" },
  },
  {
    id: "p04", slug: "cinder-merino-base-layer", name: "Cinder Merino Base Layer", category: "apparel",
    price: 8900, rating: 4.8, reviews: 341, colors: ["Ash", "Ink", "Olive"], badge: "Bestseller", inStock: true, hue: 20,
    short: "150 gsm merino crew that works for a week of commuting.",
    description: "Fine 17.5-micron merino knit with flatlock seams and a slightly dropped hem. It regulates temperature on the climb and the descent, resists odour for days and looks fine under a shirt at the office. Machine washable.",
    specs: { Fabric: "100% merino, 150 gsm", Fit: "Slim", Seams: "Flatlock", Care: "Machine wash cold" },
  },
  {
    id: "p05", slug: "slipstream-packable-shell", name: "Slipstream Packable Shell", category: "apparel",
    price: 15900, compareAt: 18900, rating: 4.5, reviews: 157, colors: ["Signal Orange", "Slate"], inStock: true, hue: 24,
    short: "A 140 g rain shell that packs into its own chest pocket.",
    description: "A 2.5-layer shell that disappears into its chest pocket when the sky clears. Fully taped seams, a dropped tail, a two-way zip and a 360° reflective print. Cut for the riding position, so it is longer in the arms and back than a casual jacket.",
    specs: { Fabric: "2.5-layer ripstop nylon", Waterproofing: "15k / 15k", Packed: "10 × 14 cm", Weight: "140 g (M)" },
  },
  {
    id: "p06", slug: "ember-thermal-jersey", name: "Ember Thermal Jersey", category: "apparel",
    price: 12500, rating: 4.6, reviews: 89, colors: ["Burgundy", "Forest", "Black"], inStock: false, hue: 350,
    short: "Brushed-back thermal jersey for 5–15°C rides.",
    description: "A roubaix-style long sleeve with a brushed interior, three rear pockets and a zipped valuables pocket. The high collar and long cuffs seal out drafts; the slightly relaxed fit layers over the Cinder base layer.",
    specs: { Fabric: "Brushed polyester / elastane", Pockets: "3 + 1 zipped", Fit: "Regular", Weight: "285 g (M)" },
  },
  {
    id: "p07", slug: "courier-18-rolltop-backpack", name: "Courier 18 Rolltop Backpack", category: "bags",
    price: 14500, rating: 4.7, reviews: 203, colors: ["Black", "Olive", "Navy"], badge: "Bestseller", inStock: true, hue: 150,
    short: "18 L waterproof rolltop with a padded 15\" laptop sleeve.",
    description: "A welded, waterproof rolltop with a suspended laptop sleeve, a quick-access front pocket and a sternum strap that actually stays put. The back panel is channelled foam that lets air through on warm commutes.",
    specs: { Volume: "18 L", Laptop: "Up to 15 inch", Fabric: "Welded TPU-coated nylon", Weight: "890 g" },
  },
  {
    id: "p08", slug: "transit-musette", name: "Transit Musette", category: "bags",
    price: 4200, rating: 4.3, reviews: 71, colors: ["Natural", "Black"], inStock: true, hue: 45,
    short: "Lightweight shoulder bag for errands and race-day feeds.",
    description: "A modern take on the race musette: lightweight waxed cotton, a cross-body strap that adjusts with one hand and an internal zipped pocket. Folds flat into a jersey pocket.",
    specs: { Volume: "6 L", Fabric: "Waxed cotton canvas", Strap: "Adjustable 25 mm webbing", Weight: "180 g" },
  },
  {
    id: "p09", slug: "handlebar-roll-4l", name: "Handlebar Roll 4L", category: "bags",
    price: 6900, rating: 4.5, reviews: 56, colors: ["Black", "Sand"], badge: "New", inStock: true, hue: 90,
    short: "Compact bar roll for layers, snacks and a tube.",
    description: "Two straps, one buckle, four litres. The Handlebar Roll mounts to drop or flat bars in under a minute and has a stiffened base so it doesn't sag onto your front tyre. Water-resistant fabric with a roll closure at each end.",
    specs: { Volume: "4 L", Mount: "Two Velcro straps + cable spacer", Fabric: "X-Pac VX21", Weight: "210 g" },
  },
  {
    id: "p10", slug: "beacon-800-front-light", name: "Beacon 800 Front Light", category: "lights",
    price: 7900, rating: 4.6, reviews: 184, colors: ["Black"], inStock: true, hue: 48,
    short: "800-lumen USB-C front light with a cut-off beam.",
    description: "A shaped beam that lights the road without dazzling oncoming traffic, five modes including a daytime flash and a 1.5-hour charge over USB-C. The mount fits 22–35 mm bars and quick-releases with one button.",
    specs: { Output: "800 lm", Runtime: "2 h high / 20 h flash", Charging: "USB-C, 90 min", Weight: "112 g" },
  },
  {
    id: "p11", slug: "ember-rear-light", name: "Ember Rear Light", category: "lights",
    price: 3900, rating: 4.4, reviews: 142, colors: ["Black"], badge: "Bestseller", inStock: true, hue: 0,
    short: "Wide-angle rear light with a brake-sensing mode.",
    description: "A 50-lumen rear light visible from 270°, with an accelerometer that flares brighter when you slow down. IPX6 sealed, clips to seatposts and saddle rails, and charges over USB-C.",
    specs: { Output: "50 lm", Runtime: "5 h steady / 30 h pulse", Visibility: "270°", Weight: "38 g" },
  },
  {
    id: "p12", slug: "fifteen-function-multitool", name: "Fifteen-Function Multitool", category: "tools",
    price: 3600, rating: 4.7, reviews: 318, colors: ["Silver"], inStock: true, hue: 220,
    short: "Hex, Torx, chain breaker and spoke keys in 98 g.",
    description: "Fifteen tools in a forged aluminium body: 2–8 mm hex, T10/T25 Torx, Phillips and flat drivers, a chain breaker, two tyre levers and a quick-link holder. Every bit is hardened chromoly.",
    specs: { Functions: "15", Bits: "Hardened CrV steel", Body: "Forged 6061 aluminium", Weight: "98 g" },
  },
  {
    id: "p13", slug: "frame-pump-mini", name: "Frame Pump Mini", category: "tools",
    price: 4400, rating: 4.2, reviews: 77, colors: ["Black", "Silver"], inStock: true, hue: 190,
    short: "High-pressure mini pump with a hidden flexible hose.",
    description: "A machined aluminium mini pump with a retractable hose so you never rip a valve off the tube. Reaches 100 psi in a realistic number of strokes and ships with a bottle-cage bracket.",
    specs: { "Max pressure": "120 psi", Valves: "Presta / Schrader", Length: "185 mm", Weight: "95 g" },
  },
  {
    id: "p14", slug: "tubeless-repair-kit", name: "Tubeless Repair Kit", category: "tools",
    price: 2200, rating: 4.5, reviews: 129, colors: ["Black"], inStock: true, hue: 170,
    short: "Plugs, reamer and a valve core tool in a bar-end case.",
    description: "Everything for a trailside tubeless fix in a case that hides in your bar end: five bacon strips, a reamer-and-insertion tool and a valve core remover. Refills sold separately.",
    specs: { Plugs: "5 × 3.5 mm", Storage: "Bar-end plug, 20–22 mm", Material: "Aluminium / steel", Weight: "32 g" },
  },
  {
    id: "p15", slug: "merino-cycling-cap", name: "Merino Cycling Cap", category: "accessories",
    price: 2800, rating: 4.6, reviews: 95, colors: ["Ink", "Moss", "Ash"], inStock: true, hue: 260,
    short: "A classic three-panel cap in soft merino.",
    description: "Three panels, a short peak and an elastic back. Under a helmet it keeps rain out of your eyes and sun off your face; off the bike it looks better than most hats.",
    specs: { Fabric: "Merino / nylon", Size: "One size, 54–60 cm", Peak: "Flip-up, stiffened", Weight: "45 g" },
  },
  {
    id: "p16", slug: "insulated-bottle-620", name: "Insulated Bottle 620", category: "accessories",
    price: 1900, rating: 4.3, reviews: 210, colors: ["Clear", "Smoke"], inStock: true, hue: 195,
    short: "Double-wall bottle that keeps drinks cold twice as long.",
    description: "A 620 ml double-wall bottle with a high-flow valve, a squeezable body and a wide mouth for ice. BPA-free and dishwasher safe. Fits standard cages.",
    specs: { Volume: "620 ml", Insulation: "Double-wall, foil-lined", Valve: "Self-sealing", Weight: "112 g" },
  },
  {
    id: "p17", slug: "reflective-ankle-straps", name: "Reflective Ankle Straps", category: "accessories",
    price: 1200, rating: 4.1, reviews: 44, colors: ["Silver", "Signal Orange"], badge: "Limited", inStock: true, hue: 30,
    short: "Keep your trousers out of the chain and your legs visible.",
    description: "A pair of 3M reflective straps with a Velcro closure and an elastic core. Each one wraps around a trouser cuff in a second and is visible from 200 m under headlights.",
    specs: { Reflectivity: "3M Scotchlite", Closure: "Velcro", Length: "40 cm", Weight: "14 g (pair)" },
  },
  {
    id: "p18", slug: "commuter-helmet-mips", name: "Commuter Helmet MIPS", category: "accessories",
    price: 11900, rating: 4.8, reviews: 266, colors: ["Matte Black", "Fog", "Olive"], badge: "Bestseller", inStock: true, hue: 240,
    short: "An urban helmet with MIPS, a rear light mount and 12 vents.",
    description: "In-mould construction, a MIPS liner, a fit system you can adjust with gloves on and a dedicated mount for the Ember Rear Light. Twelve vents keep it wearable in summer; the visor pops off in a second.",
    specs: { Safety: "CPSC, EN 1078, MIPS", Sizes: "S / M / L", Vents: "12", Weight: "350 g (M)" },
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export interface ProductQuery {
  q?: string;
  category?: string;
  sort?: SortKey;
  max?: number; // dollars
  inStock?: boolean;
}

export function searchProducts(query: ProductQuery): Product[] {
  const q = (query.q ?? "").trim().toLowerCase();
  let list = PRODUCTS.filter((p) => {
    if (query.category && p.category !== query.category) return false;
    if (query.inStock && !p.inStock) return false;
    if (query.max !== undefined && p.price > query.max * 100) return false;
    if (q) {
      const hay = `${p.name} ${p.short} ${p.category} ${p.colors.join(" ")}`.toLowerCase();
      if (!q.split(/\s+/).every((term) => hay.includes(term))) return false;
    }
    return true;
  });
  switch (query.sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }
  return list;
}

export function relatedProducts(product: Product, n = 4): Product[] {
  const same = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const rest = PRODUCTS.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, n);
}
