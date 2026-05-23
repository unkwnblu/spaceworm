import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

const mockCreateClient = vi.mocked(createClient);

function mockSupabase(user: { email: string } | null, adminRow: object | null) {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: adminRow, error: null }),
        }),
      }),
    }),
  } as any);
}

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when no user is authenticated", async () => {
    mockSupabase(null, null);
    const result = await requireAdmin();
    expect(result.error).not.toBeNull();
    expect(result.user).toBeNull();
    const body = await result.error!.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 403 when user is not an admin", async () => {
    mockSupabase({ email: "nonadmin@test.com" }, null);
    const result = await requireAdmin();
    expect(result.error).not.toBeNull();
    expect(result.user).toBeNull();
    const body = await result.error!.json();
    expect(body.error).toBe("Forbidden");
  });

  it("returns user when admin is authenticated", async () => {
    mockSupabase({ email: "admin@test.com" }, { id: "admin-1" });
    const result = await requireAdmin();
    expect(result.error).toBeNull();
    expect(result.user).toEqual({ email: "admin@test.com" });
  });
});
