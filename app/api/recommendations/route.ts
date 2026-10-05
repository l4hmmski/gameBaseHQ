import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
};

type WishlistGame = {
  igdb_id:
    | number
    | null;

  title: string;

  genres:
    | string[]
    | null;

  publisher:
    | string
    | null;

  release_date:
    | string
    | null;
};

type ExistingGame = {
  igdb_id:
    | number
    | null;
};

type IgdbGenre = {
  id: number;
  name: string;
};

type IgdbCompany = {
  name?: string;
};

type IgdbInvolvedCompany = {
  developer?: boolean;
  publisher?: boolean;

  company?: IgdbCompany;
};

type IgdbGame = {
  id: number;

  name: string;

  first_release_date?: number;

  rating?: number;

  total_rating?: number;

  total_rating_count?: number;

  cover?: {
    image_id?: string;
  };

  genres?: {
    id?: number;
    name?: string;
  }[];

  involved_companies?: IgdbInvolvedCompany[];
};

type ScoredGame = {
  game: IgdbGame;
  score: number;
};

let cachedToken:
  | {
      accessToken: string;
      expiresAt: number;
    }
  | null = null;

const TITLE_STOP_WORDS =
  new Set([
    "the",
    "of",
    "and",
    "a",
    "an",
    "in",
    "for",
    "to",
    "with",
    "edition",
    "complete",
    "deluxe",
    "ultimate",
    "remastered",
    "remake",
    "game",
    "goty",
    "year",
    "collection",
    "definitive",
    "directors",
    "cut",
  ]);

const RECOMMENDATIONS_PER_BATCH =
  24;

const UNIQUE_REFRESH_BATCHES =
  3;

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

function normaliseText(
  value: string,
) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-z0-9\s]/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function getTitleWords(
  title: string,
) {
  return normaliseText(
    title,
  )
    .split(" ")
    .filter(
      (word) =>
        word.length >= 3 &&
        !TITLE_STOP_WORDS.has(
          word,
        ),
    );
}

function getTitleScore(
  candidateTitle: string,
  wishlistGames:
    WishlistGame[],
) {
  const candidateWords =
    new Set(
      getTitleWords(
        candidateTitle,
      ),
    );

  let bestScore =
    0;

  for (
    const wishlistGame
    of wishlistGames
  ) {
    const wishlistWords =
      getTitleWords(
        wishlistGame.title,
      );

    const matchingWords =
      wishlistWords.filter(
        (word) =>
          candidateWords.has(
            word,
          ),
      );

    if (
      matchingWords.length >=
      2
    ) {
      bestScore =
        Math.max(
          bestScore,
          12,
        );
    } else if (
      matchingWords.length ===
        1 &&
      matchingWords[0].length >=
        7
    ) {
      bestScore =
        Math.max(
          bestScore,
          6,
        );
    }
  }

  return bestScore;
}

function getYearFromUnix(
  timestamp:
    number | undefined,
) {
  if (!timestamp) {
    return null;
  }

  return new Date(
    timestamp *
      1000,
  ).getUTCFullYear();
}

function getRecencyScore(
  releaseYear:
    number | null,
) {
  if (!releaseYear) {
    return 0;
  }

  if (
    releaseYear >=
    2025
  ) {
    return 24;
  }

  if (
    releaseYear >=
    2023
  ) {
    return 20;
  }

  if (
    releaseYear >=
    2021
  ) {
    return 16;
  }

  if (
    releaseYear >=
    2020
  ) {
    return 12;
  }

  return -10;
}

/*
  Deterministic pseudo-random order.

  We don't want Math.random() because
  the same request could reshuffle
  during rendering/debugging.

  Refresh number changes the ordering.
*/

function getShuffleValue(
  gameId: number,
  refresh: number,
) {
  const value =
    Math.sin(
      gameId *
        12.9898 +
        refresh *
          78.233,
    ) *
    43758.5453;

  return (
    value -
    Math.floor(
      value,
    )
  );
}

export async function GET(
  request: NextRequest,
) {
  const refreshParam =
    request.nextUrl
      .searchParams
      .get(
        "refresh",
      );

  const refresh =
    Math.max(
      Number.parseInt(
        refreshParam ??
          "0",
        10,
      ) || 0,
      0,
    );

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
        status: 401,
      },
    );
  }

  /*
    WISHLIST PROFILE
  */

  const {
    data:
      wishlistData,

    error:
      wishlistError,
  } =
    await supabase
      .from(
        "games",
      )
      .select(
        `
          igdb_id,
          title,
          genres,
          publisher,
          release_date
        `,
      )
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "is_wishlist",
        true,
      );

  if (
    wishlistError
  ) {
    console.error(
      "Wishlist load failed:",
      wishlistError,
    );

    return NextResponse.json(
      {
        error:
          "Your wishlist could not be loaded.",
      },
      {
        status: 500,
      },
    );
  }

  const wishlistGames =
    (
      wishlistData ??
      []
    ) as WishlistGame[];

  if (
    wishlistGames.length ===
    0
  ) {
    return NextResponse.json({
      recommendations:
        [],
    });
  }

  /*
    EXCLUDE EVERYTHING ALREADY
    IN THE ACCOUNT
  */

  const {
    data:
      existingData,

    error:
      existingError,
  } =
    await supabase
      .from(
        "games",
      )
      .select(
        "igdb_id",
      )
      .eq(
        "user_id",
        user.id,
      );

  if (
    existingError
  ) {
    console.error(
      "Existing library load failed:",
      existingError,
    );

    return NextResponse.json(
      {
        error:
          "Your library could not be loaded.",
      },
      {
        status: 500,
      },
    );
  }

  const existingGames =
    (
      existingData ??
      []
    ) as ExistingGame[];

  const existingIds =
    new Set(
      existingGames
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

  /*
    GENRE PROFILE
  */

  const genreFrequency =
    new Map<
      string,
      number
    >();

  for (
    const game
    of wishlistGames
  ) {
    for (
      const genre
      of game.genres ??
        []
    ) {
      genreFrequency.set(
        genre,
        (
          genreFrequency.get(
            genre,
          ) ??
          0
        ) +
          1,
      );
    }
  }

  const favouriteGenres =
    [
      ...genreFrequency.entries(),
    ]
      .sort(
        (
          a,
          b,
        ) =>
          b[1] -
          a[1],
      )
      .slice(
        0,
        8,
      );

  /*
    PUBLISHER PROFILE
  */

  const publisherFrequency =
    new Map<
      string,
      number
    >();

  for (
    const game
    of wishlistGames
  ) {
    if (
      !game.publisher
    ) {
      continue;
    }

    const publisher =
      normaliseText(
        game.publisher,
      );

    publisherFrequency.set(
      publisher,
      (
        publisherFrequency.get(
          publisher,
        ) ??
        0
      ) +
        1,
    );
  }

  if (
    favouriteGenres.length ===
    0
  ) {
    return NextResponse.json({
      recommendations:
        [],
    });
  }

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

  /*
    RESOLVE GENRES
  */

  const genreResponse =
    await fetch(
      "https://api.igdb.com/v4/genres",
      {
        method:
          "POST",

        headers,

        body: `
          fields id, name;
          limit 100;
        `,

        cache:
          "no-store",
      },
    );

  if (
    !genreResponse.ok
  ) {
    console.error(
      "IGDB genres failed:",
      await genreResponse.text(),
    );

    return NextResponse.json({
      recommendations:
        [],
    });
  }

  const igdbGenres =
    (await genreResponse.json()) as IgdbGenre[];

  const wantedGenreNames =
    new Set(
      favouriteGenres.map(
        ([genre]) =>
          genre.toLowerCase(),
      ),
    );

  const matchingGenreIds =
    igdbGenres
      .filter(
        (genre) =>
          wantedGenreNames.has(
            genre.name.toLowerCase(),
          ),
      )
      .map(
        (genre) =>
          genre.id,
      );

  if (
    matchingGenreIds.length ===
    0
  ) {
    return NextResponse.json({
      recommendations:
        [],
    });
  }

  /*
    MODERN-GAME CANDIDATE POOL

    You already changed this to 2020.
  */

  const minimumReleaseDate =
    Math.floor(
      new Date(
        "2020-01-01T00:00:00Z",
      ).getTime() /
        1000,
    );

  const candidateResponse =
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
            rating,
            total_rating,
            total_rating_count,
            genres.id,
            genres.name,
            involved_companies.publisher,
            involved_companies.developer,
            involved_companies.company.name;

          where
            genres = (${matchingGenreIds.join(
              ",",
            )})
            & cover != null
            & first_release_date >= ${minimumReleaseDate}
            & total_rating_count > 5;

          sort total_rating_count desc;

          limit 500;
        `,

        cache:
          "no-store",
      },
    );

  if (
    !candidateResponse.ok
  ) {
    console.error(
      "IGDB candidate request failed:",
      await candidateResponse.text(),
    );

    return NextResponse.json({
      recommendations:
        [],
    });
  }

  const candidates =
    (await candidateResponse.json()) as IgdbGame[];

  const scoredGames:
    ScoredGame[] =
    [];

  for (
    const candidate
    of candidates
  ) {
    if (
      existingIds.has(
        candidate.id,
      )
    ) {
      continue;
    }

    const candidateGenres =
      candidate.genres
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

    /*
      GENRE SCORE
      Max 40
    */

    let genreScore =
      0;

    for (
      const genre
      of candidateGenres
    ) {
      const frequency =
        genreFrequency.get(
          genre,
        );

      if (
        frequency
      ) {
        genreScore +=
          frequency *
          10;
      }
    }

    genreScore =
      Math.min(
        genreScore,
        40,
      );

    if (
      genreScore <
      10
    ) {
      continue;
    }

    /*
      PUBLISHER SCORE
      Max 15
    */

    const publishers =
      candidate
        .involved_companies
        ?.filter(
          (company) =>
            company.publisher &&
            company.company
              ?.name,
        )
        .map(
          (company) =>
            normaliseText(
              company.company
                ?.name ??
                "",
            ),
        )
        .filter(
          Boolean,
        ) ??
      [];

    let publisherScore =
      0;

    for (
      const publisher
      of publishers
    ) {
      const frequency =
        publisherFrequency.get(
          publisher,
        );

      if (
        frequency
      ) {
        publisherScore +=
          frequency *
          8;
      }
    }

    publisherScore =
      Math.min(
        publisherScore,
        15,
      );

    /*
      DEVELOPER/PUBLISHER OVERLAP
      Max 8
    */

    const developers =
      candidate
        .involved_companies
        ?.filter(
          (company) =>
            company.developer &&
            company.company
              ?.name,
        )
        .map(
          (company) =>
            normaliseText(
              company.company
                ?.name ??
                "",
            ),
        )
        .filter(
          Boolean,
        ) ??
      [];

    let developerScore =
      0;

    for (
      const developer
      of developers
    ) {
      if (
        publisherFrequency.has(
          developer,
        )
      ) {
        developerScore +=
          8;
      }
    }

    developerScore =
      Math.min(
        developerScore,
        8,
      );

    /*
      RECENCY
      Max 24
    */

    const releaseYear =
      getYearFromUnix(
        candidate.first_release_date,
      );

    const recencyScore =
      getRecencyScore(
        releaseYear,
      );

    /*
      QUALITY
      Max 10
    */

    const rawRating =
      candidate.total_rating ??
      candidate.rating ??
      0;

    const qualityScore =
      Math.min(
        (
          rawRating /
          100
        ) *
          10,
        10,
      );

    /*
      TITLE / FRANCHISE
      Max 12
    */

    const titleScore =
      getTitleScore(
        candidate.name,
        wishlistGames,
      );

    /*
      FINAL QUALITY SCORE

      IMPORTANT:
      No refresh/random score here.

      This gives us one stable,
      quality-ranked master pool.
    */

    const finalScore =
      genreScore +
      publisherScore +
      developerScore +
      recencyScore +
      qualityScore +
      titleScore;

    scoredGames.push({
      game:
        candidate,

      score:
        finalScore,
    });
  }

  /*
    First sort purely by recommendation
    quality.
  */

  scoredGames.sort(
    (
      a,
      b,
    ) =>
      b.score -
      a.score,
  );

  /*
    Keep a strong pool, rather than
    all 500 candidates.

    120 gives plenty of variety without
    dropping into very weak suggestions.
  */

  const qualityPool =
    scoredGames.slice(
      0,
      120,
    );

  let selectedGames:
    ScoredGame[] =
    [];

  /*
    REFRESH 0
    Games 1–24

    REFRESH 1
    Games 25–48

    REFRESH 2
    Games 49–72

    These first three sets have
    ZERO duplication.
  */

  if (
    refresh <
    UNIQUE_REFRESH_BATCHES
  ) {
    const start =
      refresh *
      RECOMMENDATIONS_PER_BATCH;

    const end =
      start +
      RECOMMENDATIONS_PER_BATCH;

    selectedGames =
      qualityPool.slice(
        start,
        end,
      );
  } else {
    /*
      Refresh 3+

      We've already shown up to 72 unique
      games, so previous recommendations
      can begin returning.

      We shuffle the top 120 and then
      select 24.

      Higher-quality games still get a
      small advantage because we only
      shuffle within the strong pool.
    */

    const shuffled =
      [...qualityPool].sort(
        (
          a,
          b,
        ) => {
          const valueA =
            getShuffleValue(
              a.game.id,
              refresh,
            );

          const valueB =
            getShuffleValue(
              b.game.id,
              refresh,
            );

          /*
            Mostly shuffle, but preserve
            a little quality preference.
          */

          const weightedA =
            valueA *
              0.8 +
            (
              a.score /
              100
            ) *
              0.2;

          const weightedB =
            valueB *
              0.8 +
            (
              b.score /
              100
            ) *
              0.2;

          return (
            weightedB -
            weightedA
          );
        },
      );

    selectedGames =
      shuffled.slice(
        0,
        RECOMMENDATIONS_PER_BATCH,
      );
  }

  /*
    If the pool doesn't contain enough
    entries for one of the first batches,
    fill the remaining slots from the
    quality pool.

    This matters for users with very
    narrow wishlist tastes.
  */

  if (
    selectedGames.length <
    RECOMMENDATIONS_PER_BATCH
  ) {
    const selectedIds =
      new Set(
        selectedGames.map(
          (item) =>
            item.game.id,
        ),
      );

    for (
      const candidate
      of qualityPool
    ) {
      if (
        selectedGames.length >=
        RECOMMENDATIONS_PER_BATCH
      ) {
        break;
      }

      if (
        selectedIds.has(
          candidate.game.id,
        )
      ) {
        continue;
      }

      selectedGames.push(
        candidate,
      );

      selectedIds.add(
        candidate.game.id,
      );
    }
  }

  const recommendations =
    selectedGames.map(
      ({
        game,
      }) => {
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

    refresh,

    /*
      Useful later if you want to show
      "Set 2 of 3" in the UI.
    */

    uniqueBatch:
      refresh <
      UNIQUE_REFRESH_BATCHES,

    uniqueBatchNumber:
      refresh <
      UNIQUE_REFRESH_BATCHES
        ? refresh +
          1
        : null,
  });
}