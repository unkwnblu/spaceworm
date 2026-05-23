import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import EventsClient from "@/components/admin/EventsClient";

export const dynamic = "force-dynamic";

export default async function EventsAdminPage() {
  const supabase = await createServiceClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  return (
    <>
      <AdminHeader title="Events" />
      <EventsClient events={events ?? []} />
    </>
  );
}
