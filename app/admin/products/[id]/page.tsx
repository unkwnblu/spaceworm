"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/mockData";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSaveToast from "@/components/admin/AdminSaveToast";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const product = products.find((p) => p.id === id);
  if (!product) return notFound();

  function handleDelete() {
    setDeleted(true);
    setTimeout(() => router.push("/admin/products"), 1500);
  }

  return (
    <>
      <AdminHeader title={product.name} breadcrumb="Products" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            ← Back to Products
          </Link>
        </div>

        <ProductForm
          initialData={product}
          dangerZone={
            <div className="border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                Danger Zone
              </h2>
              {confirmDelete ? (
                <div className="flex items-center gap-4">
                  <p className="text-xs text-zinc-500">
                    Are you sure? This cannot be undone.
                  </p>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-red-700"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-black"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="border border-red-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 transition-colors hover:border-red-400 hover:text-red-600"
                >
                  Delete Product
                </button>
              )}
            </div>
          }
        />
      </main>

      <AdminSaveToast visible={deleted} message="Deleted (mock)" />
    </>
  );
}
