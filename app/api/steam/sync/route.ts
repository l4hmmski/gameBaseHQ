import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

import {
  getIgdbDataForSteamGames,
  getOwnedSteamGames,
  getRecentlyPlayedSteamGames,
} from "@/lib/steam";

type ExistingGame = {
  id: string;

  user_id: string;

  igdb_id:
    | number
    | null;

  steam_app_id:
    | number
    | null;

  title: string;

  platform: string;

  status: string;

  cover_url:
    | string
    | null;

  publisher:
    | string
    | null;

  release_date:
    | string
    | null;

  genres:
    | string[]
    | null;

  rating:
    | number
    | null;

  user_rating:
    | number
    | null;

  notes:
    | string
    | null;

  is_wishlist:
    boolean;

  steam_playtime_minutes:
    | number
    | null;

  steam_playtime_2weeks:
    | number
    | null;

  steam_last_played_at:
    | string
    | null;

  steam_synced_at:
    | string
    | null;
};

function normaliseTitle(
  title: string,
) {
  return title
    .toLowerCase()
    .replace(
      /[^a-z0-9]/g,
      "",
    );
}

export async function POST() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: {
      user,
    },
    error:
      userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
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
    data:
      profile,

    error:
      profileError,
  } =
    await supabase
      .from(
        "profiles",
      )
      .select(
        "steam_id",
      )
      .eq(
        "id",
        user.id,
      )
      .single();

  if (
    profileError ||
    !profile
      ?.steam_id
  ) {
    return NextResponse.json(
      {
        error:
          "Connect your Steam account first.",
      },
      {
        status:
          400,
      },
    );
  }

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    return NextResponse.json(
      {
        error:
          "Server configuration is incomplete.",
      },
      {
        status:
          500,
      },
    );
  }

  const admin =
    createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession:
            false,

          autoRefreshToken:
            false,
        },
      },
    );

  try {
    const steamGames =
      await getOwnedSteamGames(
        profile.steam_id,
      );

    /*
      Empty response is commonly caused by
      private Steam Game Details.
    */

    if (
      steamGames.length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "Steam returned no games. Make sure your Steam Profile > Privacy Settings > Game details is set to Public.",
        },
        {
          status:
            400,
        },
      );
    }

    const recentGames =
      await getRecentlyPlayedSteamGames(
        profile.steam_id,
      );

    const recentById =
      new Map(
        recentGames.map(
          (game) => [
            game.appid,
            game,
          ],
        ),
      );

    const igdbData =
      await getIgdbDataForSteamGames(
        steamGames,
      );

    const {
      data:
        existingData,

      error:
        existingError,
    } =
      await admin
        .from(
          "games",
        )
        .select(
          `
            id,
            user_id,
            igdb_id,
            steam_app_id,
            title,
            platform,
            status,
            cover_url,
            publisher,
            release_date,
            genres,
            rating,
            user_rating,
            notes,
            is_wishlist,
            steam_playtime_minutes,
            steam_playtime_2weeks,
            steam_last_played_at,
            steam_synced_at
          `,
        )
        .eq(
          "user_id",
          user.id,
        );

    if (
      existingError
    ) {
      throw existingError;
    }

    const existingGames =
      (existingData ??
        []) as ExistingGame[];

    const bySteamId =
      new Map<
        number,
        ExistingGame
      >();

    const byIgdbId =
      new Map<
        number,
        ExistingGame
      >();

    const byTitle =
      new Map<
        string,
        ExistingGame
      >();

    for (
      const game
      of existingGames
    ) {
      if (
        game.steam_app_id
      ) {
        bySteamId.set(
          game.steam_app_id,
          game,
        );
      }

      if (
        game.igdb_id &&
        game.platform ===
          "PC"
      ) {
        byIgdbId.set(
          game.igdb_id,
          game,
        );
      }

      if (
        game.platform ===
        "PC"
      ) {
        byTitle.set(
          normaliseTitle(
            game.title,
          ),
          game,
        );
      }
    }

    const syncedAt =
      new Date()
        .toISOString();

    const updates:
      ExistingGame[] =
      [];

    const inserts: Array<
      Record<
        string,
        unknown
      >
    > = [];

    for (
      const steamGame
      of steamGames
    ) {
      const metadata =
        igdbData.get(
          steamGame.appid,
        );

      const recent =
        recentById.get(
          steamGame.appid,
        );

      let existing =
        bySteamId.get(
          steamGame.appid,
        );

      if (
        !existing &&
        metadata
          ?.igdbId
      ) {
        existing =
          byIgdbId.get(
            metadata.igdbId,
          );
      }

      if (!existing) {
        existing =
          byTitle.get(
            normaliseTitle(
              steamGame.name,
            ),
          );
      }

      const lastPlayed =
        steamGame
          .rtime_last_played &&
        steamGame
          .rtime_last_played >
          0
          ? new Date(
              steamGame
                .rtime_last_played *
                1000,
            ).toISOString()
          : null;

      const twoWeeks =
        recent
          ?.playtime_2weeks ??
        steamGame
          .playtime_2weeks ??
        0;

      if (existing) {
        updates.push({
          ...existing,

          steam_app_id:
            steamGame.appid,

          igdb_id:
            existing
              .igdb_id ??
            metadata
              ?.igdbId ??
            null,

          cover_url:
            existing
              .cover_url ??
            metadata
              ?.coverUrl ??
            null,

          publisher:
            existing
              .publisher ??
            metadata
              ?.publisher ??
            null,

          release_date:
            existing
              .release_date ??
            metadata
              ?.releaseDate ??
            null,

          genres:
            existing
              .genres ??
            metadata
              ?.genres ??
            null,

          rating:
            existing
              .rating ??
            metadata
              ?.rating ??
            null,

          steam_playtime_minutes:
            steamGame
              .playtime_forever ??
            0,

          steam_playtime_2weeks:
            twoWeeks,

          steam_last_played_at:
            lastPlayed,

          steam_synced_at:
            syncedAt,
        });

        continue;
      }

      inserts.push({
        user_id:
          user.id,

        steam_app_id:
          steamGame.appid,

        igdb_id:
          metadata
            ?.igdbId ??
          null,

        title:
          metadata
            ?.title ??
          steamGame.name,

        platform:
          "PC",

        status:
          "Backlog",

        cover_url:
          metadata
            ?.coverUrl ??
          null,

        publisher:
          metadata
            ?.publisher ??
          null,

        release_date:
          metadata
            ?.releaseDate ??
          null,

        genres:
          metadata
            ?.genres ??
          null,

        rating:
          metadata
            ?.rating ??
          null,

        user_rating:
          null,

        notes:
          null,

        is_wishlist:
          false,

        steam_playtime_minutes:
          steamGame
            .playtime_forever ??
          0,

        steam_playtime_2weeks:
          twoWeeks,

        steam_last_played_at:
          lastPlayed,

        steam_synced_at:
          syncedAt,
      });
    }

    if (
      updates.length >
      0
    ) {
      const {
        error:
          updateError,
      } =
        await admin
          .from(
            "games",
          )
          .upsert(
            updates,
            {
              onConflict:
                "id",
            },
          );

      if (
        updateError
      ) {
        throw updateError;
      }
    }

    if (
      inserts.length >
      0
    ) {
      const {
        error:
          insertError,
      } =
        await admin
          .from(
            "games",
          )
          .insert(
            inserts,
          );

      if (
        insertError
      ) {
        throw insertError;
      }
    }

    await admin
      .from(
        "profiles",
      )
      .update({
        steam_last_synced_at:
          syncedAt,
      })
      .eq(
        "id",
        user.id,
      );

    return NextResponse.json({
      success:
        true,

      total:
        steamGames.length,

      imported:
        inserts.length,

      updated:
        updates.length,

      syncedAt,
    });
  } catch (error) {
    console.error(
      "Steam sync failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Steam could not be synced. Please try again.",
      },
      {
        status:
          500,
      },
    );
  }
}