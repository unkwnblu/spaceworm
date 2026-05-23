import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const supabase = await createServiceClient();

  const { data: adminUser, error: fetchError } = await supabase
    .from("admin_users")
    .select("email")
    .eq("id", id)
    .single();

  if (fetchError || !adminUser) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
  }

  if (adminUser.email === auth.user!.email) {
    return NextResponse.json({ error: "You cannot remove yourself." }, { status: 400 });
  }

  const { error } = await supabase.from("admin_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
