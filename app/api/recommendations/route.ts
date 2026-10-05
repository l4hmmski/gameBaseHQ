import {
  NextResponse,
} from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
};

type LibraryGame = {
  igdb_id:
    | number
    | null;

  user_rating:
    | number
    | null;

  rating:
    | number
    | null;
};

type IgdbSeedGame = {
  id: number;

  similar_games?:
    number[];
};

type IgdbGenre = {
  name?: string;
};

type IgdbCompany = {
  name?: string;
};

type IgdbInvolvedCompany = {
  publisher?: boolean;

  company?: IgdbCompany;
};

type IgdbRecommendedGame = {
  id: number;

  name: string;

  first_release_date?: number;

  total_rating?: number;

  rating?: number;

  cover?: {
    image_id?: string;
  };

  genres?:
    IgdbGenre[];

  involved_companies?:
    IgdbInvolvedCompany[];
};

let cachedToken:
  | {
      accessToken:
        string;

      expiresAt:
        number;
    }
  | null = null;

function getCredentials() {
  const clientId =
    process.env
      .IGDB_CLIENT_ID;

  const clientSecret =
    process.env
      .IGDB_CLIENT_SECRET;

  if (
    !clientId ||
    !clientSecret
  ) {
    throw new Error(
      "IGDB credentials are missing.",
    );
  }

  return {
    clientId,
    clientSecret,
  };
}

async function getAccessToken() {
  if (
    cachedToken &&
    Date.now() <
      cachedToken.expiresAt
  ) {
    return cachedToken.accessToken;
  }

  const {
    clientId,
    clientSecret,
  } =
    getCredentials();

  const response =
    await fetch(
      "https://id.twitch.tv/oauth2/token",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          new URLSearchParams({
            client_id:
              clientId,

            client_secret:
              clientSecret,

            grant_type:
              "client_credentials",
          }),

        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      "Could not authenticate with IGDB.",
    );
  }

  const data =
    (await response.json()) as TwitchTokenResponse;

  cachedToken = {
    accessToken:
      data.access_token,

    expiresAt:
      Date.now() +
      Math.max(
        data.expires_in -
          60,
        0,
      ) *
        1000,
  };

  return cachedToken.accessToken;
}

export async function GET() {
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
    data:
      libraryData,

    error:
      libraryError,
  } =
    await supabase
      .from(
        "games",
      )
      .select(
        "igdb_id, user_rating, rating",
      )
      .eq(
        "user_id",
        user.id,
      )
      .not(
        "igdb_id",
        "is",
        null,
      );

  if (
    libraryError
  ) {
    return NextResponse.json(
      {
        error:
          "Your library could not be loaded.",
      },
      {
        status:
          500,
      },
    );
  }

  const libraryGames =
    (
      libraryData ??
      []
    ) as LibraryGame[];

  if (
    libraryGames.length ===
    0
  ) {
    return NextResponse.json({
      recommendations:
        [],
    });
  }

  /*
    Prefer games that the user
    personally rated highly.

    Games without a personal rating
    fall back to the IGDB rating.
  */

  const seedGames =
    [...libraryGames]
      .sort(
        (
          a,
          b,
        ) => {
          const ratingA =
            a.user_rating !==
            null
              ? a.user_rating *
                20
              : a.rating ??
                0;

          const ratingB =
            b.user_rating !==
            null
              ? b.user_rating *
                20
              : b.rating ??
                0;

          return (
            ratingB -
            ratingA
          );
        },
      )
      .filter(
        (
          game,
        ): game is LibraryGame & {
          igdb_id:
            number;
        } =>
          game.igdb_id !==
          null,
      )
      .slice(
        0,
        5,
      );

  const existingIds =
    new Set(
      libraryGames
        .map(
          (game) =>
            game.igdb_id,
        )
        .filter(
          (
            id,
          ): id is number =>
            id !== null,
        ),
    );

  const {
    clientId,
  } =
    getCredentials();

  const accessToken =
    await getAccessToken();

  const headers = {
    Accept:
      "application/json",

    "Client-ID":
      clientId,

    Authorization:
      `Bearer ${accessToken}`,

    "Content-Type":
      "text/plain",
  };

  const seedIds =
    seedGames
      .map(
        (game) =>
          game.igdb_id,
      )
      .join(",");

  const seedResponse =
    await fetch(
      "https://api.igdb.com/v4/games",
      {
        method:
          "POST",

        headers,

        body: `
          fields id, similar_games;
          where id = (${seedIds});
          limit 10;
        `,

        cache:
          "no-store",
      },
    );

  if (
    !seedResponse.ok
  ) {
    console.error(
      "IGDB recommendation seed request failed:",
      await seedResponse.text(),
    );

    return NextResponse.json(
      {
        recommendations:
          [],
      },
    );
  }

  const seeds =
    (await seedResponse.json()) as IgdbSeedGame[];

  const similarIds =
    [
      ...new Set(
        seeds.flatMap(
          (game) =>
            game.similar_games ??
            [],
        ),
      ),
    ]
      .filter(
        (id) =>
          !existingIds.has(
            id,
          ),
      )
      .slice(
        0,
        40,
      );

  if (
    similarIds.length ===
    0
  ) {
    return NextResponse.json({
      recommendations:
        [],
    });
  }

  const recommendationResponse =
    await fetch(
      "https://api.igdb.com/v4/games",
      {
        method:
          "POST",

        headers,

        body: `
          fields
            id,
            name,
            cover.image_id,
            first_release_date,
            total_rating,
            rating,
            genres.name,
            involved_companies.publisher,
            involved_companies.company.name;

          where id = (${similarIds.join(
            ",",
          )});

          sort total_rating desc;

          limit 12;
        `,

        cache:
          "no-store",
      },
    );

  if (
    !recommendationResponse.ok
  ) {
    console.error(
      "IGDB recommendations failed:",
      await recommendationResponse.text(),
    );

    return NextResponse.json(
      {
        recommendations:
          [],
      },
    );
  }

  const games =
    (await recommendationResponse.json()) as IgdbRecommendedGame[];

  const recommendations =
    games.map(
      (game) => {
        const imageId =
          game.cover
            ?.image_id;

        const publisher =
          game.involved_companies
            ?.find(
              (
                company,
              ) =>
                company.publisher &&
                company.company
                  ?.name,
            )
            ?.company
            ?.name ??
          null;

        const genres =
          game.genres
            ?.map(
              (genre) =>
                genre.name,
            )
            .filter(
              (
                genre,
              ): genre is string =>
                Boolean(
                  genre,
                ),
            ) ??
          [];

        const rawRating =
          game.total_rating ??
          game.rating ??
          null;

        return {
          id:
            game.id,

          title:
            game.name,

          coverUrl:
            imageId
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${imageId}.jpg`
              : null,

          publisher,

          releaseDate:
            game.first_release_date
              ? new Date(
                  game.first_release_date *
                    1000,
                )
                  .toISOString()
                  .slice(
                    0,
                    10,
                  )
              : null,

          genres,

          rating:
            rawRating !==
            null
              ? Math.round(
                  rawRating,
                )
              : null,
        };
      },
    );

  return NextResponse.json({
    recommendations,
  });
}