import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// TODO: Add auth check — only admin users should reach these routes

export async function GET() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServiceClient();
  const body = await request.json();

  const slug = (body.name as string)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data, error } = await supabase
    .from("products")
    .insert({
      slug,
      name: body.name,
      price: Math.round(Number(body.price)),
      category: body.category,
      gender: body.gender,
      sizes: body.sizes,
      colors: body.colors,
      description: body.description || null,
      tag: body.tag || null,
      images: body.images ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
