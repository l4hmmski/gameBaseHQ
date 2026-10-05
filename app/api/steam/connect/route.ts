import {
  NextResponse,
} from "next/server";

import {
  randomUUID,
} from "crypto";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

export async function GET(
  request: Request,
) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  const origin =
    new URL(
      request.url,
    ).origin;

  if (!user) {
    return NextResponse.redirect(
      `${origin}/login`,
    );
  }

  const state =
    randomUUID();

  const returnTo =
    `${origin}/api/steam/callback?state=${encodeURIComponent(
      state,
    )}`;

  const params =
    new URLSearchParams({
      "openid.ns":
        "http://specs.openid.net/auth/2.0",

      "openid.mode":
        "checkid_setup",

      "openid.return_to":
        returnTo,

      "openid.realm":
        origin,

      "openid.identity":
        "http://specs.openid.net/auth/2.0/identifier_select",

      "openid.claimed_id":
        "http://specs.openid.net/auth/2.0/identifier_select",
    });

  const steamUrl =
    `https://steamcommunity.com/openid/login?${params.toString()}`;

  const response =
    NextResponse.redirect(
      steamUrl,
    );

  response.cookies.set(
    "steam_connect_state",
    state,
    {
      httpOnly:
        true,

      sameSite:
        "lax",

      secure:
        process.env.NODE_ENV ===
        "production",

      path:
        "/",

      maxAge:
        10 * 60,
    },
  );

  return response;
}