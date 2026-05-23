import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-14">
        <section className="border-b border-zinc-100 px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-screen-xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
              Legal
            </p>
            <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-black md:text-6xl">
              Terms &amp; Conditions
            </h1>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-screen-xl">
            <div className="mx-auto max-w-2xl space-y-10">
              {[
                {
                  heading: "Shipping",
                  body: "Free standard shipping on orders over ₦150,000 within Nigeria. Estimated delivery is 3–5 business days. International orders ship in 7–14 business days. Spaceworm is not responsible for delays caused by customs or third-party carriers.",
                },
                {
                  heading: "Returns",
                  body: "Returns are accepted within 14 days of delivery. Items must be unworn, unwashed, and returned with all original tags attached. Sale items and limited drops are final sale. To initiate a return, contact hello@spaceworm.co with your order number.",
                },
                {
                  heading: "Sizing",
                  body: "All size guides on product pages reflect measurements in centimetres. If you are between sizes, we recommend sizing up. Garment measurements may vary slightly by style — check individual product pages for specifics.",
                },
                {
                  heading: "General Terms",
                  body: "Full terms of sale will be published before the store accepts live payments. These placeholder terms are provided for reference only and do not constitute a binding agreement.",
                },
              ].map((section) => (
                <div key={section.heading} className="border-t border-zinc-100 pt-8">
                  <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-black">
                    {section.heading}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-500">{section.body}</p>
                </div>
              ))}

              <div className="border-t border-zinc-100 pt-8">
                <p className="text-sm leading-relaxed text-zinc-500">
                  Questions? Reach us at{" "}
                  <a href="mailto:hello@spaceworm.co" className="font-semibold text-black underline">
                    hello@spaceworm.co
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer variant="compact" />
      </main>
    </>
  );
}
