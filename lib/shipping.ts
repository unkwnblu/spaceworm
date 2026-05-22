// ─── Shipping tiers — edit these to adjust rates ─────────────────────────────

export interface ShippingTier {
  name: string;
  states: string[];
  rateNGN: number;
  eta: string;
}

export const SHIPPING_TIERS: ShippingTier[] = [
  {
    name: "Lagos",
    states: ["Lagos"],
    rateNGN: 4500,
    eta: "1–2 business days",
  },
  {
    name: "South-West",
    states: ["Ogun", "Oyo", "Osun", "Ekiti", "Ondo"],
    rateNGN: 10000,
    eta: "2–3 business days",
  },
  {
    name: "South-East & South-South",
    states: [
      "Anambra", "Imo", "Abia", "Enugu", "Ebonyi",
      "Rivers", "Delta", "Edo", "Cross River", "Akwa Ibom", "Bayelsa",
    ],
    rateNGN: 10000,
    eta: "3–5 business days",
  },
  {
    name: "North-Central & FCT",
    states: ["FCT - Abuja", "Niger", "Benue", "Kogi", "Kwara", "Nasarawa", "Plateau"],
    rateNGN: 10000,
    eta: "3–5 business days",
  },
  {
    name: "North-West & North-East",
    states: [
      "Kano", "Kaduna", "Katsina", "Sokoto", "Zamfara", "Kebbi", "Jigawa",
      "Yobe", "Borno", "Adamawa", "Taraba", "Gombe", "Bauchi",
    ],
    rateNGN: 15000,
    eta: "4–6 business days",
  },
];

export const INTERNATIONAL_SHIPPING: Pick<ShippingTier, "name" | "rateNGN" | "eta"> = {
  name: "International",
  rateNGN: 25000,
  eta: "7–14 business days",
};

// ─────────────────────────────────────────────────────────────────────────────

export interface ShippingResult {
  rateNGN: number;
  tierName: string;
  eta: string;
}

export function getShipping(state: string, country: string): ShippingResult | null {
  const trimmedCountry = country.trim();
  if (!trimmedCountry) return null;

  if (trimmedCountry.toLowerCase() !== "nigeria") {
    return {
      rateNGN: INTERNATIONAL_SHIPPING.rateNGN,
      tierName: INTERNATIONAL_SHIPPING.name,
      eta: INTERNATIONAL_SHIPPING.eta,
    };
  }

  // Nigeria — state required
  if (!state.trim()) return null;

  const tier = SHIPPING_TIERS.find((t) => t.states.includes(state));
  if (!tier) return null;

  return { rateNGN: tier.rateNGN, tierName: tier.name, eta: tier.eta };
}
