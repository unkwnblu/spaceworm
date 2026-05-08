import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Spaceworm",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-screen-xl">
            <div className="mx-auto max-w-2xl">
              <p className="mb-8 text-sm leading-relaxed text-zinc-500">
                This privacy policy is currently being written. We take your data seriously
                and will publish a full policy before accepting payments or collecting
                personal information beyond what is necessary to browse this site.
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                For any privacy-related questions in the meantime, contact us at{" "}
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
