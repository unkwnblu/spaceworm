import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const supabase = await createServiceClient();
  const { productIds, ...fields } = await request.json();

  const { data: drop, error } = await supabase
    .from("drops")
    .update({
      number: fields.number,
      title: fields.title,
      date: fields.date,
      status: fields.status,
      description: fields.description || null,
      image_url: fields.image_url || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("drop_products").delete().eq("drop_id", id);
  if (productIds?.length) {
    const { error: joinError } = await supabase.from("drop_products").insert(
      productIds.map((pid: string) => ({ drop_id: id, product_id: pid }))
    );
    if (joinError) return NextResponse.json({ error: joinError.message }, { status: 500 });
  }

  return NextResponse.json(drop);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const supabase = await createServiceClient();
  const { error } = await supabase.from("drops").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
