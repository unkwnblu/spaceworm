import { NextResponse } from "next/server";

export interface CheckoutItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceNGN: number; // whole naira (includes customization cost if any)
  customization?: {
    name: string;
    number: string;
    imageUrl: string;
    cost: number;
  } | null;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export async function POST(request: Request) {
  try {
    const { customerInfo, items, itemsTotalNGN, shippingNGN } = (await request.json()) as {
      customerInfo: CustomerInfo;
      items: CheckoutItem[];
      itemsTotalNGN: number;
      shippingNGN: number;
    };

    const totalNGN = itemsTotalNGN + shippingNGN;

    if (
      !customerInfo?.email ||
      !customerInfo?.firstName ||
      !customerInfo?.address ||
      !items?.length ||
      !itemsTotalNGN ||
      shippingNGN == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerInfo.email,
          amount: totalNGN * 100, // naira → kobo
          currency: "NGN",
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          phone: customerInfo.phone,
          callback_url: `${siteUrl}/order/callback`,
          metadata: {
            cancel_action: siteUrl,
            customerInfo,
            shippingNGN,
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "customer_name",
                value: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
              },
              {
                display_name: "Phone",
                variable_name: "phone",
                value: customerInfo.phone,
              },
              {
                display_name: "Delivery Address",
                variable_name: "delivery_address",
                value: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}, ${customerInfo.country}`,
              },
              {
                display_name: "Items",
                variable_name: "items",
                value: items
                  .map((i) => `${i.quantity}× ${i.name} (${i.size})`)
                  .join(", "),
              },
            ],
            items,
          },
        }),
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message ?? "Paystack error." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
