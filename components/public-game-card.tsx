import Image from "next/image";

type PublicGame = {
  id: string;

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

  is_wishlist: boolean;
};

type PublicGameCardProps = {
  game:
    PublicGame;
};

function formatReleaseDate(
  releaseDate:
    | string
    | null,
) {
  if (!releaseDate) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(
      `${releaseDate}T00:00:00`,
    ),
  );
}

export function PublicGameCard({
  game,
}: PublicGameCardProps) {
  const genres =
    game.genres?.join(
      " • ",
    ) ??
    "Unknown";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
        {game.cover_url ? (
          <Image
            src={
              game.cover_url
            }
            alt={`${game.title} cover`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-5 text-center">
            <p className="font-black text-slate-600">
              {
                game.title
              }
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900">
            {
              game.status
            }
          </span>

          {game.is_wishlist && (
            <span className="rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white">
              Wishlist
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
          {
            game.platform
          }
        </p>

        <h2 className="mt-2 line-clamp-2 text-lg font-black leading-snug text-slate-950">
          {
            game.title
          }
        </h2>

        <p className="mt-3 text-sm font-semibold text-slate-700">
          {game.publisher ??
            "Unknown Publisher"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Released{" "}
          {formatReleaseDate(
            game.release_date,
          )}
        </p>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600">
          {
            genres
          }
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              IGDB
            </p>

            <p className="mt-1 font-black text-slate-900">
              {game.rating !==
              null
                ? `${Math.round(
                    game.rating,
                  )}/100`
                : "—"}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
              User Rating
            </p>

            <p className="mt-1 font-black text-slate-900">
              {game.user_rating !==
              null
                ? `${game.user_rating}/5`
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export type {
  PublicGame,
};