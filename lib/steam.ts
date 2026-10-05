type SteamGame = {
  appid: number;
  name: string;

  playtime_forever?: number;

  playtime_2weeks?: number;

  rtime_last_played?: number;
};

type SteamOwnedGamesResponse = {
  response?: {
    game_count?: number;
    games?: SteamGame[];
  };
};

type SteamRecentlyPlayedResponse = {
  response?: {
    total_count?: number;
    games?: SteamGame[];
  };
};

export type SteamPlayer = {
  steamid: string;

  personaname: string;

  profileurl: string;

  avatarfull?: string;
};

type SteamPlayerResponse = {
  response?: {
    players?: SteamPlayer[];
  };
};

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
};

type IgdbExternalGame = {
  uid: string;
  game: number;
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

type IgdbGame = {
  id: number;

  name: string;

  first_release_date?: number;

  rating?: number;

  total_rating?: number;

  cover?: {
    image_id?: string;
  };

  genres?: IgdbGenre[];

  involved_companies?: IgdbInvolvedCompany[];
};

export type SteamIgdbGame = {
  steamAppId: number;

  igdbId: number | null;

  title: string;

  coverUrl: string | null;

  publisher: string | null;

  releaseDate: string | null;

  genres: string[];

  rating: number | null;
};

let cachedIgdbToken:
  | {
      accessToken: string;
      expiresAt: number;
    }
  | null = null;

function getSteamApiKey() {
  const key =
    process.env
      .STEAM_WEB_API_KEY;

  if (!key) {
    throw new Error(
      "STEAM_WEB_API_KEY is missing.",
    );
  }

  return key;
}

function getIgdbCredentials() {
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

async function getIgdbAccessToken() {
  if (
    cachedIgdbToken &&
    Date.now() <
      cachedIgdbToken.expiresAt
  ) {
    return cachedIgdbToken.accessToken;
  }

  const {
    clientId,
    clientSecret,
  } =
    getIgdbCredentials();

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

  cachedIgdbToken = {
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

  return cachedIgdbToken.accessToken;
}

export async function getSteamPlayer(
  steamId: string,
) {
  const key =
    getSteamApiKey();

  const url =
    new URL(
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
    );

  url.searchParams.set(
    "key",
    key,
  );

  url.searchParams.set(
    "steamids",
    steamId,
  );

  const response =
    await fetch(
      url,
      {
        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      "Steam profile could not be loaded.",
    );
  }

  const data =
    (await response.json()) as SteamPlayerResponse;

  return (
    data.response
      ?.players?.[0] ??
    null
  );
}

export async function getOwnedSteamGames(
  steamId: string,
) {
  const key =
    getSteamApiKey();

  const url =
    new URL(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
    );

  url.searchParams.set(
    "key",
    key,
  );

  url.searchParams.set(
    "steamid",
    steamId,
  );

  url.searchParams.set(
    "include_appinfo",
    "true",
  );

  url.searchParams.set(
    "include_played_free_games",
    "true",
  );

  url.searchParams.set(
    "format",
    "json",
  );

  const response =
    await fetch(
      url,
      {
        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      "Steam library could not be loaded.",
    );
  }

  const data =
    (await response.json()) as SteamOwnedGamesResponse;

  return (
    data.response
      ?.games ??
    []
  );
}

export async function getRecentlyPlayedSteamGames(
  steamId: string,
) {
  const key =
    getSteamApiKey();

  const url =
    new URL(
      "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/",
    );

  url.searchParams.set(
    "key",
    key,
  );

  url.searchParams.set(
    "steamid",
    steamId,
  );

  url.searchParams.set(
    "count",
    "0",
  );

  url.searchParams.set(
    "format",
    "json",
  );

  const response =
    await fetch(
      url,
      {
        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    return [];
  }

  const data =
    (await response.json()) as SteamRecentlyPlayedResponse;

  return (
    data.response
      ?.games ??
    []
  );
}

function chunkArray<T>(
  values: T[],
  size: number,
) {
  const chunks: T[][] =
    [];

  for (
    let index = 0;
    index <
    values.length;
    index += size
  ) {
    chunks.push(
      values.slice(
        index,
        index +
          size,
      ),
    );
  }

  return chunks;
}

export async function getIgdbDataForSteamGames(
  steamGames:
    SteamGame[],
) {
  if (
    steamGames.length ===
    0
  ) {
    return new Map<
      number,
      SteamIgdbGame
    >();
  }

  const {
    clientId,
  } =
    getIgdbCredentials();

  const accessToken =
    await getIgdbAccessToken();

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

  const externalGames:
    IgdbExternalGame[] =
    [];

  /*
    Steam is external game source 1 in IGDB.
    Query in batches so large Steam libraries
    do not exceed request limits.
  */

  const steamChunks =
    chunkArray(
      steamGames,
      300,
    );

  for (
    const chunk
    of steamChunks
  ) {
    const ids =
      chunk
        .map(
          (game) =>
            `"${game.appid}"`,
        )
        .join(",");

    const response =
      await fetch(
        "https://api.igdb.com/v4/external_games",
        {
          method:
            "POST",

          headers,

          body: `
            fields uid, game;
            where external_game_source = 1
            & uid = (${ids});
            limit 500;
          `,

          cache:
            "no-store",
        },
      );

    if (!response.ok) {
      console.error(
        "IGDB Steam mapping failed:",
        await response.text(),
      );

      continue;
    }

    const result =
      (await response.json()) as IgdbExternalGame[];

    externalGames.push(
      ...result,
    );
  }

  const gameIds =
    [
      ...new Set(
        externalGames.map(
          (game) =>
            game.game,
        ),
      ),
    ];

  const igdbGames:
    IgdbGame[] =
    [];

  const gameChunks =
    chunkArray(
      gameIds,
      300,
    );

  for (
    const chunk
    of gameChunks
  ) {
    if (
      chunk.length ===
      0
    ) {
      continue;
    }

    const ids =
      chunk.join(",");

    const response =
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
              genres.name,
              involved_companies.publisher,
              involved_companies.company.name;

            where id = (${ids});

            limit 500;
          `,

          cache:
            "no-store",
        },
      );

    if (!response.ok) {
      console.error(
        "IGDB Steam game data failed:",
        await response.text(),
      );

      continue;
    }

    const result =
      (await response.json()) as IgdbGame[];

    igdbGames.push(
      ...result,
    );
  }

  const igdbById =
    new Map(
      igdbGames.map(
        (game) => [
          game.id,
          game,
        ],
      ),
    );

  const externalBySteamId =
    new Map(
      externalGames.map(
        (external) => [
          Number(
            external.uid,
          ),
          external.game,
        ],
      ),
    );

  const result =
    new Map<
      number,
      SteamIgdbGame
    >();

  for (
    const steamGame
    of steamGames
  ) {
    const igdbId =
      externalBySteamId.get(
        steamGame.appid,
      );

    const game =
      igdbId
        ? igdbById.get(
            igdbId,
          )
        : undefined;

    const imageId =
      game?.cover
        ?.image_id;

    const publisher =
      game
        ?.involved_companies
        ?.find(
          (company) =>
            company.publisher &&
            company.company
              ?.name,
        )
        ?.company?.name ??
      null;

    const genres =
      game?.genres
        ?.map(
          (genre) =>
            genre.name,
        )
        .filter(
          (
            name,
          ): name is string =>
            Boolean(name),
        ) ??
      [];

    const rawRating =
      game
        ?.total_rating ??
      game
        ?.rating ??
      null;

    result.set(
      steamGame.appid,
      {
        steamAppId:
          steamGame.appid,

        igdbId:
          game?.id ??
          null,

        title:
          game?.name ??
          steamGame.name,

        coverUrl:
          imageId
            ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${imageId}.jpg`
            : null,

        publisher,

        releaseDate:
          game
            ?.first_release_date
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
      },
    );
  }

  return result;
}

export type {
  SteamGame,
};