import { describe, it, expect } from "vitest";
import { toDateTimeInput, fromDateTimeInput, formatDropDateTime, formatDropDate } from "@/lib/datetime";

describe("drop datetime (Africa/Lagos, UTC+1)", () => {
  it("round-trips a wall-clock time", () => {
    const iso = fromDateTimeInput("2026-10-01T18:00")!;
    expect(iso).toBe("2026-10-01T17:00:00.000Z"); // 18:00 WAT = 17:00 UTC
    expect(toDateTimeInput(iso)).toBe("2026-10-01T18:00");
  });

  it("treats a legacy bare date as Lagos midnight", () => {
    expect(fromDateTimeInput("2026-10-01")).toBe("2026-09-30T23:00:00.000Z");
  });

  it("renders midnight as 00:00, not 24:00", () => {
    const iso = fromDateTimeInput("2026-10-01T00:00")!;
    expect(toDateTimeInput(iso)).toBe("2026-10-01T00:00");
    expect(formatDropDateTime(iso)).toBe("1 October 2026, 00:00 WAT");
  });

  it("formats in Lagos time even when the process is UTC", () => {
    // 23:30 UTC on 30 Sep is already 00:30 on 1 Oct in Lagos
    expect(formatDropDate("2026-09-30T23:30:00.000Z")).toBe("1 October 2026");
    expect(formatDropDateTime("2026-10-01T17:00:00.000Z")).toBe("1 October 2026, 18:00 WAT");
  });

  it("handles empty and invalid input", () => {
    expect(toDateTimeInput(null)).toBe("");
    expect(toDateTimeInput("not-a-date")).toBe("");
    expect(fromDateTimeInput("")).toBeNull();
  });
});
