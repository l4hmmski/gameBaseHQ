import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function proxy(
  request: NextRequest,
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabasePublishableKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !supabaseUrl ||
    !supabasePublishableKey
  ) {
    return response;
  }

  const supabase =
    createServerClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet,
            headers,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );
              },
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );

            Object.entries(
              headers,
            ).forEach(
              ([key, value]) => {
                response.headers.set(
                  key,
                  value,
                );
              },
            );
          },
        },
      },
    );

  /*
    Verify the user's token.
  */

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

  const protectedRoute =
    pathname.startsWith(
      "/library",
    ) ||
    pathname.startsWith(
      "/profile",
    );

  /*
    Logged-out user trying to access
    a private page.
  */

  if (
    protectedRoute &&
    !user
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname =
      "/login";

    return NextResponse.redirect(
      url,
    );
  }

  /*
    Logged-in user doesn't need to see
    login/signup again.
  */

  if (
    user &&
    (
      pathname === "/login" ||
      pathname === "/signup"
    )
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname =
      "/library";

    return NextResponse.redirect(
      url,
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};