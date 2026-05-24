import { createHmac } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import type { CheckoutItem, CustomerInfo } from "@/app/api/checkout/route";

// Tell Next.js to give us the raw body (needed for HMAC verification)
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();

  // ── 1. Verify Paystack signature ────────────────────────────────────────────
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expectedHash = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (expectedHash !== signature) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ── 2. Parse event ───────────────────────────────────────────────────────────
  const event = JSON.parse(rawBody) as {
    event: string;
    data: {
      reference: string;
      amount: number; // kobo
      customer: { email: string; first_name?: string; last_name?: string };
      metadata?: { customerInfo?: CustomerInfo; shippingNGN?: number; items?: CheckoutItem[] };
    };
  };

  if (event.event !== "charge.success") {
    // Acknowledge events we don't handle
    return new Response("OK", { status: 200 });
  }

  const { reference, amount, customer, metadata } = event.data;
  const shippingFee = metadata?.shippingNGN ?? 0;

  try {
    const supabase = await createServiceClient();

    // ── 3. Prevent duplicate orders ──────────────────────────────────────────
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (existing) {
      return new Response("OK", { status: 200 }); // already processed
    }

    // ── 4. Generate order number ─────────────────────────────────────────────
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const orderNumber = `SW-${String((count ?? 0) + 1).padStart(3, "0")}`;

    // ── 5. Insert order ──────────────────────────────────────────────────────
    const info = metadata?.customerInfo;

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
        total: Math.round(amount / 100), // kobo → naira (includes shipping)
        paystack_reference: reference,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // ── 6. Insert order items ────────────────────────────────────────────────
    const items = metadata?.items ?? [];
    if (items.length > 0) {
      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((item) => ({
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
      if (itemsError) throw itemsError;
    }

    console.log(`[webhook] Order ${orderNumber} created for ${customer.email}`);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[webhook] Error creating order:", err);
    // Return 200 so Paystack doesn't keep retrying a bad webhook URL —
    // log the error and investigate manually.
    return new Response("OK", { status: 200 });
  }
}
