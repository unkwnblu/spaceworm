import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = await createServiceClient();
  const body = await request.json();

  const slug = (body.slug && body.slug.trim()) || slugify(body.title ?? "");

  const { data, error } = await supabase
    .from("events")
    .insert({
      slug: slug || null,
      title: body.title,
      date: body.date,
      end_date: body.end_date || null,
      location: body.location,
      venue: body.venue,
      status: body.status,
      description: body.description || null,
      details: body.details || null,
      image_url: body.image_url || null,
      gallery: body.gallery ?? [],
      ticket_url: body.ticket_url || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
