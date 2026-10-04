"use client";

import {
  useState,
} from "react";

import type {
  Game,
  GameStatus,
} from "@/types/game";

type GameCardProps = {
  game: Game;

  onDelete: (
    id: string,
  ) => void;

  onRate: (
    id: string,
    rating: number,
  ) => Promise<void>;
};

const statusStyles: Record<
  GameStatus,
  string
> = {
  Backlog:
    "bg-amber-100 text-amber-800",

  Playing:
    "bg-blue-100 text-blue-800",

  Completed:
    "bg-emerald-100 text-emerald-800",
};

function formatReleaseDate(
  releaseDate:
    | string
    | null,
) {
  if (
    !releaseDate
  ) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(
      `${releaseDate}T00:00:00`,
    ),
  );
}

export function GameCard({
  game,
  onDelete,
  onRate,
}: GameCardProps) {
  const [
    hoverRating,
    setHoverRating,
  ] =
    useState<number | null>(
      null,
    );

  const [
    isSavingRating,
    setIsSavingRating,
  ] =
    useState(false);

  const genreText =
    game.genres &&
    game.genres.length >
      0
      ? game.genres.join(
          " • ",
        )
      : "Unknown";

  const displayedRating =
    hoverRating ??
    game.user_rating ??
    0;

  async function handleRating(
    rating: number,
  ) {
    setIsSavingRating(
      true,
    );

    await onRate(
      game.id,
      rating,
    );

    setIsSavingRating(
      false,
    );
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-800">
        {game.cover_url ? (
          <img
            src={
              game.cover_url
            }
            alt={`${game.title} cover`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-5 text-center">
            <span className="text-2xl font-black text-white">
              {
                game.title
              }
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        <span
          className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[game.status]}`}
        >
          {
            game.status
          }
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
          {
            game.platform
          }
        </p>

        <h2 className="mt-2 line-clamp-2 text-lg font-black leading-snug tracking-tight text-slate-950">
          {
            game.title
          }
        </h2>

        <div className="mt-3">
          <p className="text-sm font-semibold text-slate-700">
            {game.publisher ??
              "Unknown Publisher"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Released{" "}
            {formatReleaseDate(
              game.release_date,
            )}
          </p>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Genre
          </p>

          <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-700">
            {
              genreText
            }
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              IGDB Rating
            </p>

            <p className="mt-1 text-lg font-black text-slate-950">
              {game.rating !==
              null
                ? `${Math.round(
                    game.rating,
                  )}/100`
                : "N/A"}
            </p>
          </div>

          {game.rating !==
            null && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700">
              {Math.round(
                game.rating,
              )}
            </div>
          )}
        </div>

        {/* USER RATING */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              Your Rating
            </p>

            {game.user_rating && (
              <span className="text-xs font-bold text-slate-500">
                {game.user_rating}/5
              </span>
            )}
          </div>

          <div
            className="mt-2 flex items-center gap-1"
            onMouseLeave={() =>
              setHoverRating(
                null,
              )
            }
          >
            {[1, 2, 3, 4, 5].map(
              (
                star,
              ) => (
                <button
                  key={
                    star
                  }
                  type="button"
                  disabled={
                    isSavingRating
                  }
                  onMouseEnter={() =>
                    setHoverRating(
                      star,
                    )
                  }
                  onClick={() =>
                    void handleRating(
                      star,
                    )
                  }
                  aria-label={`Rate ${game.title} ${star} out of 5`}
                  className="text-2xl leading-none transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span
                    className={
                      star <=
                      displayedRating
                        ? "text-amber-400"
                        : "text-slate-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ),
            )}
          </div>

          {!game.user_rating && (
            <p className="mt-2 text-xs text-slate-400">
              Click a star to rate this game.
            </p>
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() =>
              onDelete(
                game.id,
              )
            }
            className="text-sm font-bold text-red-600 transition hover:text-red-800"
          >
            Remove From Library
          </button>
        </div>
      </div>
    </article>
  );
}