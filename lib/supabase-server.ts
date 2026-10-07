import {
  createServerClient,
} from "@supabase/ssr";

import {
  cookies,
} from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore =
    await cookies();

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL.",
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(
          cookiesToSet,
        ) {
          try {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                cookieStore.set(
                  name,
                  value,
                  options,
                );
              },
            );
          } catch {
            /*
              Setting cookies can fail
              inside a Server Component
              because Server Components
              cannot directly modify
              cookies.

              Route Handlers can modify
              them, which is what our
              auth callback uses.
            */
          }
        },
      },
    },
  );
}