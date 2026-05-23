import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("drops")
    .select("*, drop_products(product_id)")
    .order("date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = await createServiceClient();
  const { productIds, ...fields } = await request.json();

  const { data: drop, error } = await supabase
    .from("drops")
    .insert({
      number: fields.number,
      title: fields.title,
      date: fields.date,
      status: fields.status,
      description: fields.description || null,
      image_url: fields.image_url || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (productIds?.length) {
    const { error: joinError } = await supabase.from("drop_products").insert(
      productIds.map((pid: string) => ({ drop_id: drop.id, product_id: pid }))
    );
    if (joinError) return NextResponse.json({ error: joinError.message }, { status: 500 });
  }

  return NextResponse.json(drop, { status: 201 });
}
