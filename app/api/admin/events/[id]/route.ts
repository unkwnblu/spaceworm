import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServiceClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("events")
    .update({
      slug: body.slug ? body.slug.trim() : null,
      title: body.title,
      date: body.date,
      end_date: body.end_date || null,
      location: body.location,
      venue: body.venue,
      status: body.status,
      description: body.description || null,
      details: body.details || null,
      image_url: body.image_url || null,
      ticket_url: body.ticket_url || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServiceClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
