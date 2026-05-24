import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * POST /api/admin/verify-order
 * Body: { reference: string }
 *
 * Manually verify a Paystack transaction and create the order if it doesn't exist.
 * Admin-only endpoint for recovering missed webhooks.
 */
export async function POST(request: Request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const { reference } = (await request.json()) as { reference: string };

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    // 1. Verify with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
        cache: "no-store",
      }
    );

    const result = await paystackRes.json();

    if (!result.status || result.data?.status !== "success") {
      return NextResponse.json({
        error: "Payment not verified",
        paystackStatus: result.status,
        paystackDataStatus: result.data?.status,
        message: result.message,
      }, { status: 400 });
    }

    const { amount, customer, metadata } = result.data;

    // 2. Check existing
    const supabase = await createServiceClient();
    const { data: existing } = await supabase
      .from("orders")
      .select("id, number")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        message: "Order already exists",
        order: existing,
      });
    }

    // 3. Create order
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const orderNumber = `SW-${String((count ?? 0) + 1).padStart(3, "0")}`;

    const info = metadata?.customerInfo;
    const shippingFee = metadata?.shippingNGN ?? 0;

    const customerName = info
      ? `${info.firstName} ${info.lastName}`.trim()
      : [customer.first_name, customer.last_name].filter(Boolean).join(" ") || null;

    const shippingAddress = info
      ? { address: info.address, city: info.city, state: info.state, country: info.country }
      : null;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        number: orderNumber,
        customer_email: info?.email ?? customer.email,
        customer_name: customerName,
        customer_phone: info?.phone ?? null,
        shipping_address: shippingAddress,
        shipping_fee: shippingFee,
        status: "pending",
        total: Math.round(amount / 100),
        paystack_reference: reference,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({
        error: "Failed to create order",
        details: orderError.message,
        code: orderError.code,
      }, { status: 500 });
    }

    // 4. Insert items
    const items = metadata?.items ?? [];
    if (items.length > 0) {
      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((item: { productId?: string; name: string; image?: string; size: string; color?: string; quantity: number; unitPriceNGN: number; customization?: { name: string; number: string; imageUrl: string; cost: number } | null }) => ({
          order_id: order.id,
          product_id: item.productId ?? null,
          product_name: item.name,
          product_image: item.image ?? null,
          size: item.size,
          color: item.color ?? null,
          quantity: item.quantity,
          unit_price: item.unitPriceNGN,
          customization: item.customization ?? null,
        }))
      );
      if (itemsError) {
        return NextResponse.json({
          error: "Order created but items failed",
          order,
          itemsError: itemsError.message,
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      message: "Order created successfully",
      order,
      itemCount: items.length,
    });
  } catch (err) {
    return NextResponse.json({
      error: "Internal error",
      details: String(err),
    }, { status: 500 });
  }
}
