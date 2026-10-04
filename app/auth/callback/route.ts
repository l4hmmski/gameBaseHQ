import {
  NextResponse,
} from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

export async function GET(
  request: Request,
) {
  const requestUrl =
    new URL(request.url);

  const code =
    requestUrl.searchParams.get(
      "code",
    );

  const origin =
    requestUrl.origin;

  if (!code) {
    console.error(
      "Google OAuth callback received without a code.",
    );

    return NextResponse.redirect(
      `${origin}/login`,
    );
  }

  const supabase =
    await createSupabaseServerClient();

  const {
    error,
  } =
    await supabase.auth
      .exchangeCodeForSession(
        code,
      );

  if (error) {
    console.error(
      "Google OAuth callback failed:",
      error,
    );

    return NextResponse.redirect(
      `${origin}/login`,
    );
  }

  return NextResponse.redirect(
    `${origin}/library`,
  );
}