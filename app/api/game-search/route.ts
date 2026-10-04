import {
  NextRequest,
  NextResponse,
} from "next/server";

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type IgdbGame = {
  id: number;
  name: string;

  cover?: {
    image_id?: string;
  };

  first_release_date?: number;
};

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null =
  null;

function getIgdbCredentials() {
  const clientId =
    process.env.IGDB_CLIENT_ID;

  const clientSecret =
    process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "IGDB_CLIENT_ID or IGDB_CLIENT_SECRET is missing from .env.local.",
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
    Date.now() < cachedToken.expiresAt
  ) {
    return cachedToken.accessToken;
  }

  const {
    clientId,
    clientSecret,
  } = getIgdbCredentials();

  const response = await fetch(
    "https://id.twitch.tv/oauth2/token",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type:
          "client_credentials",
      }),

      cache: "no-store",
    },
  );

  if (!response.ok) {
    const responseText =
      await response.text();

    throw new Error(
      `Could not get Twitch access token. Status: ${response.status}. ${responseText}`,
    );
  }

  const tokenData =
    (await response.json()) as TwitchTokenResponse;

  cachedToken = {
    accessToken:
      tokenData.access_token,

    expiresAt:
      Date.now() +
      Math.max(
        tokenData.expires_in - 60,
        0,
      ) *
        1000,
  };

  return cachedToken.accessToken;
}

function escapeIgdbSearchText(
  value: string,
) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

export async function GET(
  request: NextRequest,
) {
  const query =
    request.nextUrl.searchParams
      .get("q")
      ?.trim();

  if (!query) {
    return NextResponse.json({
      games: [],
    });
  }

  if (query.length < 2) {
    return NextResponse.json({
      games: [],
    });
  }

  try {
    const { clientId } =
      getIgdbCredentials();

    const accessToken =
      await getAccessToken();

    const safeQuery =
      escapeIgdbSearchText(query);

    const igdbResponse = await fetch(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",

        headers: {
          Accept:
            "application/json",

          "Client-ID": clientId,

          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "text/plain",
        },

        body: `
          search "${safeQuery}";
          fields id,name,cover.image_id,first_release_date;
          limit 8;
        `,

        cache: "no-store",
      },
    );

    if (!igdbResponse.ok) {
      const responseText =
        await igdbResponse.text();

      throw new Error(
        `IGDB returned ${igdbResponse.status}. ${responseText}`,
      );
    }

    const games =
      (await igdbResponse.json()) as IgdbGame[];

    const formattedGames =
      games.map((game) => {
        const imageId =
          game.cover?.image_id;

        const coverUrl = imageId
          ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${imageId}.jpg`
          : null;

        const year =
          game.first_release_date
            ? new Date(
                game.first_release_date *
                  1000,
              ).getFullYear()
            : null;

        return {
          id: game.id,
          title: game.name,
          coverUrl,
          year,
        };
      });

    return NextResponse.json({
      games: formattedGames,
    });
  } catch (error) {
    console.error(
      "Could not search IGDB:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Game search could not be completed.",
        games: [],
      },

      {
        status: 502,
      },
    );
  }
}