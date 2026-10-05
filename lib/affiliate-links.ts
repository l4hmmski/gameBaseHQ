type AffiliateGame = {
  title: string;
  platform?: string | null;
};

function buildAmazonSearchQuery(
  game: AffiliateGame,
) {
  const parts = [
    game.title,
  ];

  if (
    game.platform &&
    game.platform !== "PC"
  ) {
    parts.push(
      game.platform,
    );
  }

  return parts.join(" ");
}

export function getAmazonAffiliateUrl(
  game: AffiliateGame,
) {
  const tag =
    process.env
      .NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG;

  const query =
    buildAmazonSearchQuery(
      game,
    );

  const params =
    new URLSearchParams({
      k: query,
    });

  if (tag) {
    params.set(
      "tag",
      tag,
    );
  }

  return `https://www.amazon.com.au/s?${params.toString()}`;
}