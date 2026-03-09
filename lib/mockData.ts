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
