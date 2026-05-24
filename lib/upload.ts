const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

type UploadResult = { url: string; path: string };

/**
 * Upload a file directly to Supabase Storage via a signed URL.
 * 1. Asks our API for a signed upload URL (tiny JSON — no file through Vercel).
 * 2. PUTs the file straight to Supabase (bypasses Vercel's 4.5 MB limit).
 * 3. Returns the public URL.
 */
export async function uploadFile(
  file: File,
  bucket: string
): Promise<UploadResult> {
  // Client-side validation
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File too large (max 20 MB)");
  }

  // 1. Get signed URL from our API (small JSON request)
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket,
      filename: file.name,
      contentType: file.type,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to get upload URL");
  }

  // 2. Upload directly to Supabase Storage
  const uploadRes = await fetch(data.signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Upload failed: ${errText}`);
  }

  return { url: data.publicUrl, path: data.path };
}

/**
 * Public upload for customer-supplied customization images.
 * Hits the unauthenticated /api/upload-customization endpoint.
 */
export async function uploadCustomizationFile(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File too large (max 20 MB)");
  }

  const res = await fetch("/api/upload-customization", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to get upload URL");

  const uploadRes = await fetch(data.signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Upload failed: ${errText}`);
  }

  return { url: data.publicUrl, path: data.path };
}
