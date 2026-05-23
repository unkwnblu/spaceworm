import { describe, it, expect } from "vitest";
import { formatNGN } from "@/lib/database.types";

describe("formatNGN", () => {
  it("formats zero", () => {
    expect(formatNGN(0)).toContain("0");
  });

  it("formats a typical price", () => {
    const result = formatNGN(15000);
    expect(result).toContain("15,000");
    expect(result).toContain("₦");
  });

  it("formats large amounts with commas", () => {
    const result = formatNGN(1500000);
    expect(result).toContain("1,500,000");
  });

  it("strips decimal fractions", () => {
    const result = formatNGN(4500);
    expect(result).not.toContain(".");
  });
});
