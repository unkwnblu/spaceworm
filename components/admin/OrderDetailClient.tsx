"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminStatusBadge, { type Status } from "./AdminStatusBadge";

type OrderItem = {
  id: string;
  product_name: string;
  product_image: string | null;
  size: string;
  color: string | null;
  quantity: number;
  unit_price: number;
};

type ShippingAddress = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
};

type Order = {
  id: string;
  number: string;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: ShippingAddress | null;
  shipping_fee: number;
  status: string;
  total: number;
  paystack_reference: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ORDER_STATUSES: Status[] = ["pending", "fulfilled", "cancelled"];

export default function OrderDetailClient({ order: initial }: { order: Order }) {
  const router = useRouter();
  const [order, setOrder] = useState(initial);
  const [saving, setSaving] = useState(false);

  const subtotal = order.order_items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  async function updateStatus(status: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrder((prev) => ({ ...prev, ...data }));
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  const addr = order.shipping_address as ShippingAddress | null;

  return (
    <div className="space-y-8">
      {/* Top summary row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
              #{order.number}
            </h2>
            <AdminStatusBadge status={order.status as Status} />
          </div>
          <p className="text-[10px] text-zinc-400">
            Placed {formatDate(order.created_at)}
          </p>
          {order.updated_at !== order.created_at && (
            <p className="text-[10px] text-zinc-400">
              Updated {formatDate(order.updated_at)}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {ORDER_STATUSES.filter((s) => s !== order.status).map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              disabled={saving}
              className="border border-zinc-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:border-black hover:text-black disabled:opacity-50"
            >
              Mark {s}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items — takes 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Items ({order.order_items.length})
          </h3>
          <div className="border border-zinc-200 bg-white divide-y divide-zinc-100">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="h-16 w-16 object-cover bg-zinc-100"
                  />
                ) : (
                  <div className="h-16 w-16 bg-zinc-100" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-black truncate">
                    {item.product_name}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Size: {item.size}
                    {item.color && <> · Color: {item.color}</>}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-zinc-700">
                    {fmt(item.unit_price)} × {item.quantity}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {fmt(item.unit_price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border border-zinc-200 bg-white p-4 space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Shipping</span>
              <span>{order.shipping_fee ? fmt(order.shipping_fee) : "—"}</span>
            </div>
            <div className="border-t border-zinc-100 pt-2 flex justify-between text-xs font-bold text-black">
              <span>Total</span>
              <span>{fmt(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar — customer + shipping */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="border border-zinc-200 bg-white p-5 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Customer
            </h3>
            <div className="space-y-1">
              <p className="text-xs font-bold text-black">
                {order.customer_name || "—"}
              </p>
              <p className="text-xs text-zinc-500">{order.customer_email}</p>
              {order.customer_phone && (
                <p className="text-xs text-zinc-500">{order.customer_phone}</p>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className="border border-zinc-200 bg-white p-5 space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Shipping Address
            </h3>
            {addr && (addr.address || addr.city || addr.state) ? (
              <div className="space-y-0.5 text-xs text-zinc-600">
                {addr.address && <p>{addr.address}</p>}
                {(addr.city || addr.state) && (
                  <p>
                    {[addr.city, addr.state].filter(Boolean).join(", ")}
                  </p>
                )}
                {addr.country && <p>{addr.country}</p>}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">No address provided</p>
            )}
          </div>

          {/* Payment reference */}
          {order.paystack_reference && (
            <div className="border border-zinc-200 bg-white p-5 space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Payment
              </h3>
              <p className="text-xs font-mono text-zinc-500 break-all">
                {order.paystack_reference}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
