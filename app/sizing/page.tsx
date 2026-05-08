import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sizing Guide — Spaceworm",
  description: "Spaceworm size chart. Find your fit across all garment categories.",
};

const TOPS = [
  { size: "XS", chest: "86–91", waist: "71–76", shoulder: "42", length: "68" },
  { size: "S",  chest: "91–96", waist: "76–81", shoulder: "43", length: "70" },
  { size: "M",  chest: "96–101", waist: "81–86", shoulder: "44", length: "72" },
  { size: "L",  chest: "101–106", waist: "86–91", shoulder: "46", length: "74" },
  { size: "XL", chest: "106–111", waist: "91–96", shoulder: "47", length: "76" },
  { size: "XXL", chest: "111–116", waist: "96–101", shoulder: "48", length: "78" },
];

const BOTTOMS = [
  { size: "XS", waist: "66–71", hips: "89–94", inseam: "78", rise: "27" },
  { size: "S",  waist: "71–76", hips: "94–99", inseam: "79", rise: "28" },
  { size: "M",  waist: "76–81", hips: "99–104", inseam: "80", rise: "29" },
  { size: "L",  waist: "81–86", hips: "104–109", inseam: "81", rise: "30" },
  { size: "XL", waist: "86–91", hips: "109–114", inseam: "82", rise: "31" },
  { size: "XXL", waist: "91–96", hips: "114–119", inseam: "83", rise: "32" },
];

function SizeTable({
  heading,
  columns,
  rows,
}: {
  heading: string;
  columns: { key: string; label: string }[];
  rows: Record<string, string>[];
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
        {heading}
      </h2>
      <div className="overflow-x-auto border border-zinc-200">
        <table className="w-full min-w-[480px]">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {rows.map((row) => (
              <tr key={row.size} className="hover:bg-zinc-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-3.5 text-sm ${
                      col.key === "size"
                        ? "font-black uppercase tracking-widest text-black"
                        : "text-zinc-500"
                    }`}
                  >
                    {row[col.key]}
                    {col.key !== "size" && (
                      <span className="ml-0.5 text-[10px] text-zinc-300"> cm</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function SizingPage() {
  return (
    <>
      <Header />
      <main className="pt-14">
        <div className="mx-auto max-w-screen-md px-4 py-12 md:px-8 md:py-16">
          {/* Header */}
          <div className="mb-12 border-b border-zinc-100 pb-8">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
              Spaceworm
            </p>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black md:text-5xl">
              Sizing Guide
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              All measurements are in centimetres and refer to body measurements, not garment measurements. If you are between sizes, size up. For relaxed or oversized styles, consider your usual size.
            </p>
          </div>

          <SizeTable
            heading="Tops & Outerwear"
            columns={[
              { key: "size", label: "Size" },
              { key: "chest", label: "Chest" },
              { key: "waist", label: "Waist" },
              { key: "shoulder", label: "Shoulder" },
              { key: "length", label: "Length" },
            ]}
            rows={TOPS}
          />

          <SizeTable
            heading="Bottoms"
            columns={[
              { key: "size", label: "Size" },
              { key: "waist", label: "Waist" },
              { key: "hips", label: "Hips" },
              { key: "inseam", label: "Inseam" },
              { key: "rise", label: "Rise" },
            ]}
            rows={BOTTOMS}
          />

          {/* Notes */}
          <div className="border-t border-zinc-100 pt-8">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Notes
            </p>
            <ul className="flex flex-col gap-3 text-sm leading-relaxed text-zinc-500">
              <li>— Accessories (caps, bags) are one size unless otherwise stated.</li>
              <li>— All Spaceworm garments are true to size unless the product description states otherwise.</li>
              <li>— Measurements may vary ±2 cm between production batches.</li>
              <li>— Questions? Email <a href="mailto:hello@spaceworm.co" className="font-semibold text-black hover:underline">hello@spaceworm.co</a></li>
            </ul>
          </div>
        </div>
      </main>
      <Footer variant="compact" />
    </>
  );
}
