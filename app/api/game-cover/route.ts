import {
  NextRequest,
  NextResponse,
} from "next/server";

type CheapSharkGame = {
  gameID: string;
  external: string;
  thumb: string;
};

export async function GET(
  request: NextRequest,
) {
  const title =
    request.nextUrl.searchParams
      .get("title")
      ?.trim();

  if (!title) {
    return NextResponse.json(
      {
        error: "A game title is required.",
      },
      {
        status: 400,
      },
    );
  }

  const url = new URL(
    "https://www.cheapshark.com/api/1.0/games",
  );

  url.searchParams.set(
    "title",
    title,
  );

  url.searchParams.set(
    "limit",
    "1",
  );

  try {
    const response = await fetch(
      url,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `CheapShark returned ${response.status}`,
      );
    }

    const games =
      (await response.json()) as CheapSharkGame[];

    const coverUrl =
      games[0]?.thumb ?? null;

    return NextResponse.json({
      coverUrl,
    });
  } catch (error) {
    console.error(
      "Could not fetch game cover:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "The game cover could not be fetched.",
      },
      {
        status: 502,
      },
    );
  }
}