import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServiceClient();
  const body = await request.json();

  const update: Record<string, unknown> = {};
  if (body.status !== undefined) update.status = body.status;
  if (body.shipping_fee !== undefined) update.shipping_fee = Math.round(Number(body.shipping_fee));
  if (body.customer_name !== undefined) update.customer_name = body.customer_name || null;
  if (body.customer_phone !== undefined) update.customer_phone = body.customer_phone || null;
  if (body.shipping_address !== undefined) update.shipping_address = body.shipping_address;

  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
