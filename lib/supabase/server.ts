import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

/**
 * Use in Server Components, Server Actions, and Route Handlers.
 * Must be called inside a request context (i.e. inside a component or handler,
 * not at module scope).
 *
 * Usage:
 *   const supabase = await createClient()
 *   const { data } = await supabase.from("products").select()
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore.
            // Auth middleware handles session refresh.
          }
        },
      },
    }
  );
}

/**
 * Service-role client — bypasses RLS entirely.
 * Use ONLY in Route Handlers that need elevated access (e.g. Paystack webhook).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export async function createServiceClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // No-op in Server Components
          }
        },
      },
    }
  );
}
