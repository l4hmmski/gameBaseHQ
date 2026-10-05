import {
  NextResponse,
} from "next/server";

import {
  cookies,
} from "next/headers";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

import {
  getSteamPlayer,
} from "@/lib/steam";

export async function GET(
  request: Request,
) {
  const url =
    new URL(
      request.url,
    );

  const origin =
    url.origin;

  const state =
    url.searchParams.get(
      "state",
    );

  const cookieStore =
    await cookies();

  const expectedState =
    cookieStore.get(
      "steam_connect_state",
    )?.value;

  if (
    !state ||
    !expectedState ||
    state !==
      expectedState
  ) {
    return NextResponse.redirect(
      `${origin}/profile?steam=invalid_state`,
    );
  }

  const supabase =
    await createSupabaseServerClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      `${origin}/login`,
    );
  }

  const verificationParams =
    new URLSearchParams();

  for (
    const [
      key,
      value,
    ] of url.searchParams
  ) {
    if (
      key.startsWith(
        "openid.",
      )
    ) {
      verificationParams.set(
        key,
        value,
      );
    }
  }

  verificationParams.set(
    "openid.mode",
    "check_authentication",
  );

  const verificationResponse =
    await fetch(
      "https://steamcommunity.com/openid/login",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          verificationParams.toString(),

        cache:
          "no-store",
      },
    );

  const verificationText =
    await verificationResponse.text();

  if (
    !verificationText.includes(
      "is_valid:true",
    )
  ) {
    return NextResponse.redirect(
      `${origin}/profile?steam=verification_failed`,
    );
  }

  const claimedId =
    url.searchParams.get(
      "openid.claimed_id",
    );

  const match =
    claimedId?.match(
      /^https:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/,
    );

  const steamId =
    match?.[1];

  if (!steamId) {
    return NextResponse.redirect(
      `${origin}/profile?steam=missing_id`,
    );
  }

  try {
    const player =
      await getSteamPlayer(
        steamId,
      );

    const {
      error,
    } =
      await supabase
        .from(
          "profiles",
        )
        .update({
          steam_id:
            steamId,

          steam_persona_name:
            player
              ?.personaname ??
            null,

          steam_profile_url:
            player
              ?.profileurl ??
            `https://steamcommunity.com/profiles/${steamId}`,
        })
        .eq(
          "id",
          user.id,
        );

    if (error) {
      console.error(
        "Steam connection save failed:",
        error,
      );

      return NextResponse.redirect(
        `${origin}/profile?steam=save_failed`,
      );
    }

    const response =
      NextResponse.redirect(
        `${origin}/profile?steam=connected`,
      );

    response.cookies.delete(
      "steam_connect_state",
    );

    return response;
  } catch (error) {
    console.error(
      "Steam connection failed:",
      error,
    );

    return NextResponse.redirect(
      `${origin}/profile?steam=failed`,
    );
  }
}