import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

function getSafeNextPath(
  value:
    string | null,
) {
  if (!value) {
    return "/library";
  }

  /*
    Prevent an attacker from using
    our callback as an open redirect.

    We only allow internal paths.
  */

  if (
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/library";
  }

  return value;
}

export async function GET(
  request: NextRequest,
) {
  const requestUrl =
    new URL(
      request.url,
    );

  const code =
    requestUrl.searchParams.get(
      "code",
    );

  const next =
    getSafeNextPath(
      requestUrl.searchParams.get(
        "next",
      ),
    );

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/login?error=invalid_auth_link",
        request.url,
      ),
    );
  }

  const supabase =
    await createSupabaseServerClient();

  const {
    error,
  } =
    await supabase.auth.exchangeCodeForSession(
      code,
    );

  if (error) {
    console.error(
      "Auth callback failed:",
      error,
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=auth_callback_failed",
        request.url,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(
      next,
      request.url,
    ),
  );
}