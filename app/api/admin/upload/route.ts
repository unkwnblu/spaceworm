import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

const ALLOWED_BUCKETS = new Set(["event-images", "product-images", "drop-images"]);

/**
 * POST /api/admin/upload
 * Body: { bucket: string, filename: string, contentType: string }
 *
 * Returns a signed upload URL so the browser can upload directly to Supabase
 * Storage — bypasses Vercel's 4.5 MB body limit on the free plan.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { bucket, filename, contentType } = await request.json();

  if (!bucket || !ALLOWED_BUCKETS.has(bucket)) {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }
  if (!filename || !contentType) {
    return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = await createServiceClient();

  const { data: signedData, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !signedData) {
    return NextResponse.json({ error: error?.message ?? "Failed to create upload URL" }, { status: 500 });
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    signedUrl: signedData.signedUrl,
    token: signedData.token,
    path,
    publicUrl: publicData.publicUrl,
  });
}
