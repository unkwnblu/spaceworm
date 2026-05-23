"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DBAdminUser } from "@/lib/database.types";
import AdminTable from "@/components/admin/AdminTable";
import AdminEmptyState from "@/components/admin/AdminEmptyState";

type Props = {
  users: DBAdminUser[];
  currentEmail: string;
};

export default function UsersClient({ users: initial, currentEmail }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<DBAdminUser | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to create user.");
      setSaving(false);
      return;
    }

    setUsers((prev) => [...prev, data]);
    setShowForm(false);
    setName("");
    setEmail("");
    setPassword("");
    setSaving(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirmUser) return;
    setDeletingId(confirmUser.id);
    const res = await fetch(`/api/admin/users/${confirmUser.id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== confirmUser.id));
      router.refresh();
    }
    setDeletingId(null);
    setConfirmUser(null);
  }

  const inputClass =
    "w-full border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-black";
  const labelClass =
    "block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1.5";

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {users.length} admin{users.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-zinc-800"
        >
          {showForm ? "Cancel" : "Add Admin"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 border border-zinc-200 bg-white p-6">
          <p className="mb-4 text-xs font-black uppercase tracking-widest text-black">
            New Admin User
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                placeholder="jane@spaceworm.co"
              />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={inputClass}
                placeholder="Min 6 characters"
              />
            </div>
          </div>
          {error && (
            <p className="mt-3 text-[10px] font-semibold text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="mt-4 bg-black px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-zinc-800 disabled:bg-zinc-400"
          >
            {saving ? "Creating…" : "Create Admin"}
          </button>
        </form>
      )}

      {users.length === 0 ? (
        <AdminEmptyState
          message="No admin users"
          subtext="Add your first admin user to get started."
        />
      ) : (
        <AdminTable columns={["Name", "Email", "Added", ""]}>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3 text-sm font-medium text-black">
                {u.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-sm text-zinc-600">{u.email}</td>
              <td className="px-4 py-3 text-sm text-zinc-500">
                {new Date(u.created_at).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-right">
                {u.email === currentEmail ? (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
                    You
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmUser(u)}
                    className="text-[10px] font-black uppercase tracking-widest text-red-400 transition-colors hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {/* Confirmation modal */}
      {confirmUser && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setConfirmUser(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white p-8">
              <h2 className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-black">
                Remove Admin
              </h2>
              <p className="mb-1 text-sm text-zinc-600">
                Are you sure you want to remove{" "}
                <span className="font-bold text-black">
                  {confirmUser.name ?? confirmUser.email}
                </span>
                ?
              </p>
              <p className="mb-6 text-xs text-zinc-400">
                They will lose access to the admin portal. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deletingId === confirmUser.id}
                  className="flex-1 bg-red-600 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:bg-red-300"
                >
                  {deletingId === confirmUser.id ? "Removing…" : "Yes, Remove"}
                </button>
                <button
                  onClick={() => setConfirmUser(null)}
                  className="flex-1 border border-zinc-200 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:border-black hover:text-black"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
