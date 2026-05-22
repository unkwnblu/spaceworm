import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

/**
 * Use in "use client" components.
 * Creates one Supabase client per render (the SSR package handles deduplication).
 *
 * Usage:
 *   const supabase = createClient()
 *   const { data } = await supabase.from("products").select()
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
