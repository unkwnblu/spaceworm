import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy — Spaceworm",
};

export default function CookiesPage() {
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
              Cookie Policy
            </h1>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-screen-xl">
            <div className="mx-auto max-w-2xl">
              <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                Spaceworm uses only essential cookies necessary to keep the site functional —
                things like your cart session. We do not use tracking cookies, advertising
                cookies, or third-party analytics at this time.
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                A full cookie policy will be published alongside our privacy policy before
                the store goes live. Questions? Contact us at{" "}
                <a href="mailto:hello@spaceworm.co" className="font-semibold text-black underline">
                  hello@spaceworm.co
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <Footer variant="compact" />
      </main>
    </>
  );
}
