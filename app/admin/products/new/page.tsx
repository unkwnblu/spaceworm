import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <AdminHeader title="New Product" breadcrumb="Products" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            ← Back to Products
          </Link>
        </div>
        <ProductForm mode="create" />
      </main>
    </>
  );
}
