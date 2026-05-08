export type Gender = "Men" | "Women" | "Unisex";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // USD
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  category: string;
  gender: Gender;
  tag?: string;
};

const NGN_RATE = 1500;

export function toNGN(usd: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(usd * NGN_RATE);
}

export const products: Product[] = [
  {
    id: "1",
    slug: "void-cargo-pant",
    name: "Void Cargo Pant",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Ash", hex: "#a1a1aa" },
    ],
    description:
      "Six-pocket utility cargo constructed from heavyweight ripstop. Dropped waistband, articulated knees, and a relaxed straight leg with zip ankles.",
    category: "Bottoms",
    gender: "Unisex",
    tag: "New",
  },
  {
    id: "2",
    slug: "wormhole-oversized-tee",
    name: "Wormhole Oversized Tee",
    price: 65,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
    ],
    description:
      "230gsm boxy-cut tee with a dropped shoulder and garment-dyed finish. Features a subtle embroidered Spaceworm wordmark at the chest.",
    category: "Tops",
    gender: "Unisex",
  },
  {
    id: "3",
    slug: "orbit-track-jacket",
    name: "Orbit Track Jacket",
    price: 195,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Slate", hex: "#3f3f46" },
    ],
    description:
      "Silky polyester track jacket with contrast-stitch paneling. Full-zip, rib-knit cuffs and collar, two side pockets, one chest pocket.",
    category: "Outerwear",
    gender: "Men",
    tag: "Limited",
  },
  {
    id: "4",
    slug: "signal-hoodie",
    name: "Signal Hoodie",
    price: 145,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Cream", hex: "#fafaf9" },
    ],
    description:
      "550gsm heavyweight fleece hoodie with a kangaroo pocket and triple-stitched seams. Relaxed fit with a structured hood and metal drawcord tips.",
    category: "Tops",
    gender: "Unisex",
  },
  {
    id: "5",
    slug: "event-horizon-shorts",
    name: "Event Horizon Shorts",
    price: 85,
    images: [
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80",
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Ash", hex: "#a1a1aa" },
    ],
    description:
      "8-inch inseam nylon shorts with a secure zip pocket and mesh liner. Lightweight and fast-drying.",
    category: "Bottoms",
    gender: "Men",
  },
  {
    id: "6",
    slug: "transit-longsleeve",
    name: "Transit Longsleeve",
    price: 80,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" },
    ],
    description:
      "Midweight jersey longsleeve with a raw hem finish. Designed to layer or wear alone — the foundation piece.",
    category: "Tops",
    gender: "Women",
    tag: "New",
  },
  {
    id: "7",
    slug: "sector-seven-cap",
    name: "Sector Seven Cap",
    price: 55,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Cream", hex: "#fafaf9" },
    ],
    description:
      "6-panel structured cap in heavy canvas. Tonal embroidery, metal buckle strap, and a pre-curved brim.",
    category: "Accessories",
    gender: "Unisex",
  },
  {
    id: "8",
    slug: "deep-field-puffer",
    name: "Deep Field Puffer",
    price: 280,
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80",
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
    ],
    description:
      "Quilted puffer in matte ripstop with 700-fill recycled down. Cropped silhouette, stand collar, and concealed zip throughout.",
    category: "Outerwear",
    gender: "Women",
    tag: "Limited",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return products.slice(0, limit);
  return products
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit)
    .concat(products.filter((p) => p.slug !== slug && p.category !== current.category))
    .slice(0, limit);
}

// ─── Drops ───────────────────────────────────────────────────────────────────

export type DropStatus = "upcoming" | "live" | "sold-out";

export type Drop = {
  id: string;
  number: string;
  title: string;
  date: string; // ISO date string
  status: DropStatus;
  description: string;
  products: Product[];
};

export const drops: Drop[] = [
  {
    id: "drop-003",
    number: "003",
    title: "No Signal",
    date: "2026-06-14",
    status: "upcoming",
    description:
      "A six-piece capsule built around the concept of disconnection. Heavyweight ripstop, matte hardware, zero logos. Drops 14 June, 10:00 WAT.",
    products: products.filter((p) => ["void-cargo-pant", "orbit-track-jacket"].includes(p.slug)),
  },
  {
    id: "drop-002",
    number: "002",
    title: "Hollow",
    date: "2026-04-01",
    status: "live",
    description:
      "Eight pieces. All black. All limited. Built for the space between streetwear and technical wear. Available now while stock lasts.",
    products: products.filter((p) =>
      ["signal-hoodie", "wormhole-oversized-tee", "deep-field-puffer", "sector-seven-cap"].includes(p.slug)
    ),
  },
  {
    id: "drop-001",
    number: "001",
    title: "Void",
    date: "2026-01-15",
    status: "sold-out",
    description: "The first drop. Four pieces. Sold out in 38 minutes. Thank you.",
    products: [],
  },
];

export function getDropById(id: string): Drop | undefined {
  return drops.find((d) => d.id === id);
}

// ─── Events ──────────────────────────────────────────────────────────────────

export type EventStatus = "upcoming" | "past";

export type SpacewormEvent = {
  id: string;
  title: string;
  date: string; // ISO date string
  endDate?: string;
  location: string;
  venue: string;
  status: EventStatus;
  description: string;
};

export const events: SpacewormEvent[] = [
  {
    id: "evt-003",
    title: "No Signal — Pop-Up",
    date: "2026-06-14",
    endDate: "2026-06-15",
    location: "Lagos",
    venue: "Alára, Victoria Island",
    status: "upcoming",
    description:
      "Two days only. Shop the full No Signal capsule before it goes online. DJ sets, free alterations, first 50 customers receive an exclusive tote.",
  },
  {
    id: "evt-002",
    title: "Spaceworm × The Trunk Show",
    date: "2026-04-26",
    endDate: "2026-04-27",
    location: "Abuja",
    venue: "Jabi Lake Mall, Ground Floor",
    status: "upcoming",
    description:
      "A two-day trunk show featuring the full Hollow collection alongside archive pieces. Sizing consultations on-site. Walk-ins welcome.",
  },
  {
    id: "evt-001",
    title: "Void — Launch Night",
    date: "2026-01-15",
    location: "Lagos",
    venue: "Bogobiri House, Ikoyi",
    status: "past",
    description:
      "The inaugural Spaceworm event. 200 guests, four pieces, sold out in-person before the online drop. Thank you to everyone who pulled up.",
  },
];

export function getEventById(id: string): SpacewormEvent | undefined {
  return events.find((e) => e.id === id);
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  number: string;
  customer: string;
  date: string; // ISO date string
  items: number;
  total: number; // USD
  status: OrderStatus;
};

export const orders: Order[] = [
  {
    id: "ord-003",
    number: "003",
    customer: "Adaeze O.",
    date: "2026-04-12",
    items: 2,
    total: 210,
    status: "pending",
  },
  {
    id: "ord-002",
    number: "002",
    customer: "Emeka N.",
    date: "2026-04-08",
    items: 1,
    total: 145,
    status: "fulfilled",
  },
  {
    id: "ord-001",
    number: "001",
    customer: "Tunde B.",
    date: "2026-04-01",
    items: 3,
    total: 395,
    status: "fulfilled",
  },
];
