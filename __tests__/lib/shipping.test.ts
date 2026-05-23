import { describe, it, expect } from "vitest";
import { getShipping, SHIPPING_TIERS, INTERNATIONAL_SHIPPING } from "@/lib/shipping";

describe("getShipping", () => {
  it("returns null when country is empty", () => {
    expect(getShipping("Lagos", "")).toBeNull();
    expect(getShipping("Lagos", "  ")).toBeNull();
  });

  it("returns null for Nigeria when state is empty", () => {
    expect(getShipping("", "Nigeria")).toBeNull();
    expect(getShipping("  ", "Nigeria")).toBeNull();
  });

  it("returns Lagos tier for Lagos state", () => {
    const result = getShipping("Lagos", "Nigeria");
    expect(result).not.toBeNull();
    expect(result!.tierName).toBe("Lagos");
    expect(result!.rateNGN).toBe(4500);
  });

  it("returns South-West tier for Ogun", () => {
    const result = getShipping("Ogun", "Nigeria");
    expect(result).not.toBeNull();
    expect(result!.tierName).toBe("South-West");
    expect(result!.rateNGN).toBe(10000);
  });

  it("returns North tier for Kano", () => {
    const result = getShipping("Kano", "Nigeria");
    expect(result).not.toBeNull();
    expect(result!.tierName).toBe("North-West & North-East");
    expect(result!.rateNGN).toBe(15000);
  });

  it("returns null for unknown Nigerian state", () => {
    expect(getShipping("Atlantis", "Nigeria")).toBeNull();
  });

  it("returns international shipping for non-Nigeria countries", () => {
    const result = getShipping("", "United Kingdom");
    expect(result).not.toBeNull();
    expect(result!.tierName).toBe("International");
    expect(result!.rateNGN).toBe(INTERNATIONAL_SHIPPING.rateNGN);
  });

  it("is case-insensitive for Nigeria", () => {
    const result = getShipping("Lagos", "nigeria");
    expect(result).not.toBeNull();
    expect(result!.tierName).toBe("Lagos");
  });

  it("covers all 37 states across tiers", () => {
    const allStates = SHIPPING_TIERS.flatMap((t) => t.states);
    expect(allStates.length).toBe(37);
    for (const state of allStates) {
      expect(getShipping(state, "Nigeria")).not.toBeNull();
    }
  });
});
