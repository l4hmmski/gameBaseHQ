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

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

const rateLimitStore =
  new Map<string, RateLimitEntry>();

let cachedToken: CachedToken | null =
  null;

function getClientIp(
  request: NextRequest,
) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for",
    );

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      .trim();
  }

  const realIp =
    request.headers.get(
      "x-real-ip",
    );

  return realIp ?? "unknown";
}

function checkRateLimit(
  ip: string,
) {
  const now = Date.now();

  const existingEntry =
    rateLimitStore.get(ip);

  if (
    !existingEntry ||
    now >= existingEntry.resetAt
  ) {
    const newEntry = {
      count: 1,
      resetAt:
        now +
        RATE_LIMIT_WINDOW_MS,
    };

    rateLimitStore.set(
      ip,
      newEntry,
    );

    return {
      allowed: true,
      remaining:
        RATE_LIMIT - 1,
      resetAt:
        newEntry.resetAt,
    };
  }

  if (
    existingEntry.count >=
    RATE_LIMIT
  ) {
    return {
      allowed: false,
      remaining: 0,
      resetAt:
        existingEntry.resetAt,
    };
  }

  existingEntry.count += 1;

  rateLimitStore.set(
    ip,
    existingEntry,
  );

  return {
    allowed: true,
    remaining:
      RATE_LIMIT -
      existingEntry.count,
    resetAt:
      existingEntry.resetAt,
  };
}

function cleanupExpiredRateLimits() {
  const now = Date.now();

  for (const [
    ip,
    entry,
  ] of rateLimitStore.entries()) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}

function getIgdbCredentials() {
  const clientId =
    process.env.IGDB_CLIENT_ID;

  const clientSecret =
    process.env.IGDB_CLIENT_SECRET;

  if (
    !clientId ||
    !clientSecret
  ) {
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
    Date.now() <
      cachedToken.expiresAt
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
        client_secret:
          clientSecret,
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
        tokenData.expires_in -
          60,
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
  cleanupExpiredRateLimits();

  const ip =
    getClientIp(request);

  const rateLimit =
    checkRateLimit(ip);

  if (!rateLimit.allowed) {
    const retryAfterSeconds =
      Math.max(
        Math.ceil(
          (rateLimit.resetAt -
            Date.now()) /
            1000,
        ),
        1,
      );

    return NextResponse.json(
      {
        error:
          "Too many searches. Please wait a moment and try again.",
        games: [],
      },
      {
        status: 429,

        headers: {
          "Retry-After":
            retryAfterSeconds.toString(),

          "X-RateLimit-Limit":
            RATE_LIMIT.toString(),

          "X-RateLimit-Remaining":
            "0",
        },
      },
    );
  }

  const query =
    request.nextUrl.searchParams
      .get("q")
      ?.trim();

  if (!query) {
    return NextResponse.json(
      {
        games: [],
      },
      {
        headers: {
          "X-RateLimit-Limit":
            RATE_LIMIT.toString(),

          "X-RateLimit-Remaining":
            rateLimit.remaining.toString(),
        },
      },
    );
  }

  if (query.length < 2) {
    return NextResponse.json(
      {
        games: [],
      },
      {
        headers: {
          "X-RateLimit-Limit":
            RATE_LIMIT.toString(),

          "X-RateLimit-Remaining":
            rateLimit.remaining.toString(),
        },
      },
    );
  }

  if (query.length > 100) {
    return NextResponse.json(
      {
        error:
          "Search text is too long.",
        games: [],
      },
      {
        status: 400,

        headers: {
          "X-RateLimit-Limit":
            RATE_LIMIT.toString(),

          "X-RateLimit-Remaining":
            rateLimit.remaining.toString(),
        },
      },
    );
  }

  try {
    const { clientId } =
      getIgdbCredentials();

    const accessToken =
      await getAccessToken();

    const safeQuery =
      escapeIgdbSearchText(
        query,
      );

    const igdbResponse =
      await fetch(
        "https://api.igdb.com/v4/games",
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Client-ID":
              clientId,

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

    if (
      !igdbResponse.ok
    ) {
      const responseText =
        await igdbResponse.text();

      throw new Error(
        `IGDB returned ${igdbResponse.status}. ${responseText}`,
      );
    }

    const games =
      (await igdbResponse.json()) as IgdbGame[];

    const formattedGames =
      games.map(
        (game) => {
          const imageId =
            game.cover
              ?.image_id;

          const coverUrl =
            imageId
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
        },
      );

    return NextResponse.json(
      {
        games:
          formattedGames,
      },
      {
        headers: {
          "X-RateLimit-Limit":
            RATE_LIMIT.toString(),

          "X-RateLimit-Remaining":
            rateLimit.remaining.toString(),
        },
      },
    );
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

        headers: {
          "X-RateLimit-Limit":
            RATE_LIMIT.toString(),

          "X-RateLimit-Remaining":
            rateLimit.remaining.toString(),
        },
      },
    );
  }
}