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

/**
 * A drop going live is what releases its products to the storefront.
 * Moving a drop *back* to upcoming deliberately does NOT unpublish them — a
 * product can sell standalone or sit in more than one drop, so hiding it again
 * is left as an explicit choice on the product itself.
 */
async function publishDropProducts(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  status: string,
  productIds: string[] | undefined
) {
  if (status !== "live" || !productIds?.length) return null;
  const { error } = await supabase
    .from("products")
    .update({ published: true })
    .in("id", productIds);
  return error;
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

  const publishError = await publishDropProducts(supabase, fields.status, productIds);
  if (publishError) {
    return NextResponse.json({ error: publishError.message }, { status: 500 });
  }

  return NextResponse.json(drop, { status: 201 });
}
