import {
  NextResponse,
} from "next/server";

import {
  cookies,
} from "next/headers";

import {
  track,
} from "@vercel/analytics/server";

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

  /*
    Validate the state value.

    This protects the Steam connection
    flow against forged callback
    requests.
  */

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

  /*
    Steam uses OpenID.

    Copy all of the OpenID callback
    parameters into a new request so
    Steam can verify that the response
    is genuine.
  */

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

  /*
    Steam puts the Steam ID at the end
    of the claimed_id URL.

    Example:

    https://steamcommunity.com/openid/id/7656119...
  */

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
    /*
      Retrieve basic Steam profile
      information before saving the
      connection to Supabase.
    */

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

    /*
      The Steam account has now been
      successfully verified AND saved.

      This is the correct point to record
      a successful Steam connection.

      Do not send:
      - Steam ID
      - Supabase user ID
      - Steam username

      Analytics only needs to know that
      the connection occurred.
    */

    try {
      await track(
        "Steam Connected",
        {
          provider:
            "steam",
        },
      );
    } catch (
      analyticsError
    ) {
      /*
        Analytics should never cause a
        successful Steam connection to
        fail.
      */

      console.error(
        "Steam connection analytics failed:",
        analyticsError,
      );
    }

    const response =
      NextResponse.redirect(
        `${origin}/profile?steam=connected`,
      );

    /*
      Remove the temporary state cookie
      after successful authentication.
    */

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