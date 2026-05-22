import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <>
      <AdminHeader title="New Event" breadcrumb="Events" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mb-6">
          <Link
            href="/admin/events"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            ← Back to Events
          </Link>
        </div>
        <EventForm mode="create" />
      </main>
    </>
  );
}
