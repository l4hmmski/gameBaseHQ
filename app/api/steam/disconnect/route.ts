import {
  NextResponse,
} from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

export async function POST() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error:
          "You must be logged in.",
      },
      {
        status:
          401,
      },
    );
  }

  const {
    error,
  } =
    await supabase
      .from(
        "profiles",
      )
      .update({
        steam_id:
          null,

        steam_persona_name:
          null,

        steam_profile_url:
          null,

        steam_last_synced_at:
          null,
      })
      .eq(
        "id",
        user.id,
      );

  if (error) {
    return NextResponse.json(
      {
        error:
          "Steam could not be disconnected.",
      },
      {
        status:
          500,
      },
    );
  }

  return NextResponse.json({
    success:
      true,
  });
}