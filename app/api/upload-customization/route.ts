import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/upload-customization
 * Body: { filename: string, contentType: string }
 *
 * Public endpoint (no admin auth) that returns a signed upload URL for the
 * customization-images bucket. Lets customers upload personalisation images
 * directly to Supabase Storage, bypassing Vercel's 4.5 MB body limit.
 */
export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
    if (!ALLOWED.has(contentType)) {
      return NextResponse.json({ error: `Unsupported file type: ${contentType}` }, { status: 400 });
    }

    const ext = String(filename).split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabase = await createServiceClient();
    const { data, error } = await supabase.storage
      .from("customization-images")
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Failed to create upload URL" }, { status: 500 });
    }

    const { data: publicData } = supabase.storage
      .from("customization-images")
      .getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path,
      publicUrl: publicData.publicUrl,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
