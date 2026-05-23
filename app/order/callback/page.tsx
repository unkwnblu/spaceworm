import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createServiceClient } from "@/lib/supabase/server";
import type { CheckoutItem, CustomerInfo } from "@/app/api/checkout/route";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export const dynamic = "force-dynamic";

function formatNGN(naira: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(naira);
}

async function verifyPayment(reference: string) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );
  return res.json();
}

/**
 * Fallback order creation — if the webhook hasn't created the order yet,
 * create it here from the verified Paystack transaction data.
 */
async function ensureOrderExists(result: {
  data: {
    reference: string;
    amount: number;
    customer: { email: string; first_name?: string; last_name?: string };
    metadata?: {
      customerInfo?: CustomerInfo;
      shippingNGN?: number;
      items?: CheckoutItem[];
      deliveryMethod?: string;
    };
  };
}) {
  try {
    const supabase = await createServiceClient();
    const { reference, amount, customer, metadata } = result.data;
    const shippingFee = metadata?.shippingNGN ?? 0;

    // Check if order already exists (webhook may have created it)
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (existing) return; // Webhook already handled it

    // Generate order number
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const orderNumber = `SW-${String((count ?? 0) + 1).padStart(3, "0")}`;

    // Build order data
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
        total: Math.round(amount / 100),
        paystack_reference: reference,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
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
        }))
      );
      if (itemsError) throw itemsError;
    }

    console.log(`[callback] Order ${orderNumber} created for ${customer.email}`);
  } catch (err) {
    console.error("[callback] Error creating order:", err);
  }
}

export default async function OrderCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref;

  if (!reference) redirect("/");

  const result = await verifyPayment(reference);
  const success =
    result.status === true && result.data?.status === "success";

  // If payment verified, ensure order exists (fallback if webhook missed)
  if (success) {
    await ensureOrderExists(result);
  }

  const amountNGN: number = result.data?.amount
    ? Math.round(result.data.amount / 100)
    : 0;
  const email: string = result.data?.customer?.email ?? "";

  return (
    <>
      <Header />
      <main className="pt-14">
        <section className="mx-auto flex min-h-[85vh] max-w-screen-xl flex-col items-center justify-center px-4 py-24 text-center">
          {success ? (
            <>
              {/* Success */}
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                Order Confirmed
              </p>
              <h1 className="mb-6 max-w-lg text-5xl font-black uppercase leading-tight tracking-tight text-black md:text-6xl">
                Thank you.
              </h1>
              <p className="mb-2 max-w-md text-sm leading-relaxed text-zinc-500">
                Your payment of{" "}
                <span className="font-semibold text-black">
                  {formatNGN(amountNGN)}
                </span>{" "}
                was successful.
                {email && (
                  <>
                    {" "}
                    A confirmation will be sent to{" "}
                    <span className="font-semibold text-black">{email}</span>.
                  </>
                )}
              </p>
              <p className="mb-12 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-300">
                Ref: {reference}
              </p>
              <div className="flex gap-4">
                <Link
                  href="/all"
                  className="bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="border border-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-50"
                >
                  Home
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Failure */}
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                Payment Failed
              </p>
              <h1 className="mb-6 text-5xl font-black uppercase leading-tight tracking-tight text-black md:text-6xl">
                Something
                <br />
                went wrong.
              </h1>
              <p className="mb-12 max-w-md text-sm leading-relaxed text-zinc-500">
                Your payment could not be completed. You have not been charged.
                Please try again or contact us at{" "}
                <a
                  href="mailto:hello@spaceworm.co"
                  className="font-semibold text-black underline"
                >
                  hello@spaceworm.co
                </a>
                .
              </p>
              <div className="flex gap-4">
                <Link
                  href="/"
                  className="bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
                >
                  Back to Home
                </Link>
                <a
                  href="mailto:hello@spaceworm.co"
                  className="border border-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-50"
                >
                  Contact Us
                </a>
              </div>
            </>
          )}
        </section>

        <Footer variant="compact" />
      </main>
    </>
  );
}
