"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatNGN } from "@/lib/database.types";
import { getShipping } from "@/lib/shipping";
import type { CheckoutItem, CustomerInfo } from "@/app/api/checkout/route";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

type DeliveryMethod = "delivery" | "pickup";

function validate(form: CustomerInfo, method: DeliveryMethod) {
  const errors: Partial<Record<keyof CustomerInfo, string>> = {};
  const isNigeria = form.country.trim().toLowerCase() === "nigeria";
  if (!form.firstName.trim())  errors.firstName = "Required";
  if (!form.lastName.trim())   errors.lastName  = "Required";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email";
  if (!form.phone.trim())      errors.phone   = "Required";
  if (method === "delivery") {
    if (!form.address.trim())    errors.address = "Required";
    if (!form.city.trim())       errors.city    = "Required";
    if (isNigeria && !form.state.trim()) errors.state = "Required";
  }
  return errors;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();

  const [form, setForm] = useState<CustomerInfo>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", country: "Nigeria",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (items.length === 0) router.replace("/all");
  }, [items, router]);

  const isPickup = deliveryMethod === "pickup";
  const isNigeria = form.country.trim().toLowerCase() === "nigeria";
  const isInternational = form.country.trim() !== "" && !isNigeria;

  const itemsTotalNGN = totalPrice;
  const shipping = useMemo(() => isPickup ? { rateNGN: 0, tierName: "Pickup", eta: "Collect in store" } : getShipping(form.state, form.country), [form.state, form.country, isPickup]);
  const grandTotalNGN = itemsTotalNGN + (shipping?.rateNGN ?? 0);

  function set(field: keyof CustomerInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const errs = validate(form, deliveryMethod);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    if (!isPickup && !shipping) {
      setErrors((prev) => ({ ...prev, state: "Select a valid state to calculate shipping" }));
      return;
    }

    const checkoutItems: CheckoutItem[] = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      image: item.product.images[0] ?? "",
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPriceNGN: item.product.price + (item.customization?.cost ?? 0),
      customization: item.customization ?? null,
    }));

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo: isPickup ? { ...form, address: "Pickup", city: "Pickup", state: "" } : form,
          items: checkoutItems,
          itemsTotalNGN,
          shippingNGN: isPickup ? 0 : (shipping?.rateNGN ?? 0),
          deliveryMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.authorization_url) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.href = data.authorization_url;
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Styles ───────────────────────────────────────────────────────────────────
  const inputClass = (field: keyof CustomerInfo) =>
    `w-full border px-4 py-3 text-sm outline-none transition-colors focus:border-black ${
      errors[field] ? "border-red-400" : "border-zinc-200"
    }`;
  const labelClass = "block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1.5";
  const sectionLabel = "mb-5 border-b border-zinc-100 pb-3 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400";

  return (
    <>
      <Header />
      <main className="pt-14">
        <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">

          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 transition-colors hover:text-black"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </Link>

          <h1 className="mb-10 text-3xl font-black uppercase tracking-tight text-black md:text-4xl">
            Checkout
          </h1>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">

            {/* ── Form ─────────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Contact */}
              <p className={sectionLabel}>Contact</p>
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                    className={inputClass("firstName")} autoComplete="given-name" />
                  {errors.firstName && <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                    className={inputClass("lastName")} autoComplete="family-name" />
                  {errors.lastName && <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.lastName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    className={inputClass("email")} autoComplete="email" />
                  {errors.email && <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    className={inputClass("phone")} autoComplete="tel" placeholder="+234 800 000 0000" />
                  {errors.phone && <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.phone}</p>}
                </div>
              </div>

              {/* Delivery Method */}
              <p className={sectionLabel}>Delivery Method</p>
              <div className="mb-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`border px-4 py-3.5 text-left transition-colors ${
                    deliveryMethod === "delivery"
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                  }`}
                >
                  <span className="block text-xs font-black uppercase tracking-[0.2em]">Delivery</span>
                  <span className="mt-1 block text-[10px] opacity-70">Ship to your address</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`border px-4 py-3.5 text-left transition-colors ${
                    deliveryMethod === "pickup"
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                  }`}
                >
                  <span className="block text-xs font-black uppercase tracking-[0.2em]">Pickup</span>
                  <span className="mt-1 block text-[10px] opacity-70">Collect in store — free</span>
                </button>
              </div>

              {isPickup && (
                <div className="mb-10 border border-zinc-100 bg-zinc-50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Pickup Location</p>
                  <p className="mt-2 text-sm font-semibold text-black">Lagos, Nigeria</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    You will receive pickup details via email after placing your order.
                  </p>
                </div>
              )}

              {/* Delivery Address */}
              {!isPickup && (
              <>
              <p className={sectionLabel}>Delivery Address</p>
              <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)}
                    className={inputClass("address")} autoComplete="street-address"
                    placeholder="House number, street name" />
                  {errors.address && <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.address}</p>}
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)}
                    className={inputClass("city")} autoComplete="address-level2" />
                  {errors.city && <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>
                    {isNigeria ? "State" : "State / Province"}
                    {isInternational && <span className="ml-1 normal-case tracking-normal text-zinc-300">(optional)</span>}
                  </label>
                  {isNigeria ? (
                    <select value={form.state} onChange={(e) => set("state", e.target.value)}
                      className={`${inputClass("state")} bg-white`}>
                      <option value="">Select state…</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={form.state} onChange={(e) => set("state", e.target.value)}
                      className={inputClass("state")} placeholder="e.g. Greater London" />
                  )}
                  {errors.state && <p className="mt-1 text-[10px] font-semibold text-red-500">{errors.state}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Country</label>
                  <input type="text" value={form.country}
                    onChange={(e) => { set("country", e.target.value); set("state", ""); }}
                    className={inputClass("country")} autoComplete="country-name" />
                </div>
              </div>
              </>
              )}

              {serverError && (
                <p className="mb-4 text-[10px] font-semibold text-red-500">{serverError}</p>
              )}
              <button type="submit" disabled={loading || (!isPickup && !shipping)}
                className="w-full bg-black py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400 sm:w-auto sm:px-16">
                {loading ? "Processing…" : "Continue to Payment"}
              </button>
              {!isPickup && !shipping && isNigeria && (
                <p className="mt-2 text-[10px] text-zinc-400">Select your state to calculate shipping and enable checkout.</p>
              )}
              {!isPickup && !shipping && !isNigeria && !form.country.trim() && (
                <p className="mt-2 text-[10px] text-zinc-400">Enter your country to calculate shipping.</p>
              )}
              <p className="mt-3 text-[10px] text-zinc-400">
                You will be redirected to Paystack to complete your payment securely.
              </p>
            </form>

            {/* ── Order Summary ─────────────────────────────────────────────── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className={sectionLabel}>Order Summary</p>

              <ul className="mb-6 divide-y divide-zinc-100">
                {items.map((item, idx) => {
                  const unit = item.product.price + (item.customization?.cost ?? 0);
                  return (
                    <li key={`${item.product.id}-${item.size}-${item.color}-${idx}`} className="flex gap-4 py-4">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-zinc-100">
                        {item.product.images[0] && (
                          <Image src={item.product.images[0]} alt={item.product.name} fill
                            className="object-cover" sizes="64px" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide">{item.product.name}</p>
                          <p className="mt-0.5 text-[10px] text-zinc-500">{item.size} / {item.color}</p>
                          {item.customization && (
                            <p className="mt-1 text-[10px] text-zinc-400">
                              Custom · {[item.customization.name, item.customization.number && `#${item.customization.number}`, item.customization.imageUrl && "image"].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400">Qty {item.quantity}</span>
                          <span className="text-xs font-bold">{formatNGN(unit * item.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Totals */}
              <div className="space-y-3 border-t border-zinc-200 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-semibold">{fmt(itemsTotalNGN)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">
                    {isPickup ? "Shipping" : "Shipping"}
                    {shipping && (
                      <span className="ml-1.5 text-[10px] text-zinc-400">
                        ({shipping.tierName} · {shipping.eta})
                      </span>
                    )}
                  </span>
                  {isPickup ? (
                    <span className="font-semibold text-zinc-400">Free</span>
                  ) : shipping ? (
                    <span className="font-semibold">{fmt(shipping.rateNGN)}</span>
                  ) : (
                    <span className="text-[10px] text-zinc-400">Select state</span>
                  )}
                </div>

                {(isPickup || shipping) && (
                  <div className="flex items-center justify-between border-t border-zinc-200 pt-3">
                    <span className="text-xs font-black uppercase tracking-widest">Total</span>
                    <span className="text-base font-black">{fmt(grandTotalNGN)}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
        <Footer variant="compact" />
      </main>
    </>
  );
}
