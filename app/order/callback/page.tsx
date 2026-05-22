import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Order Confirmed — Spaceworm",
};

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
