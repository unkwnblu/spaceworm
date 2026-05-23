import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import UsersClient from "@/components/admin/UsersClient";

export default async function UsersPage() {
  const supabase = await createServiceClient();
  const { data: users } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: true });

  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  return (
    <>
      <AdminHeader title="Users" />
      <UsersClient users={users ?? []} currentEmail={user?.email ?? ""} />
    </>
  );
}
