"use client";

import Image from "next/image";

import {
  useState,
} from "react";

import type {
  Game,
  GameStatus,
} from "@/types/game";

type GameUpdates = Partial<
  Pick<
    Game,
    | "platform"
    | "status"
    | "user_rating"
    | "is_wishlist"
  >
>;

type UpdateResult = {
  success: boolean;
  error?: string;
};

type Props = {
  game: Game;

  eager?: boolean;

  onDelete: (
    id: string,
  ) => void;

  onUpdate: (
    id: string,
    updates: GameUpdates,
  ) => Promise<UpdateResult>;
};

const platforms = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X|S",
  "Xbox One",
  "Nintendo Switch 2",
  "Nintendo Switch",
  "Steam Deck",
];

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

function hours(
  minutes:
    | number
    | null
    | undefined,
) {
  if (!minutes) {
    return "0h";
  }

  const value =
    minutes / 60;

  return value >= 100
    ? `${Math.round(
        value,
      )}h`
    : `${value.toFixed(
        1,
      )}h`;
}

function formatDate(
  value:
    | string
    | null
    | undefined,
) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day:
        "numeric",

      month:
        "short",

      year:
        "numeric",
    },
  ).format(
    new Date(
      value,
    ),
  );
}

export function GameCard({
  game,
  eager = false,
  onDelete,
  onUpdate,
}: Props) {
  const [
    isEditing,
    setIsEditing,
  ] =
    useState(false);

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  const [
    isSteamOpen,
    setIsSteamOpen,
  ] =
    useState(false);

  const [
    platform,
    setPlatform,
  ] =
    useState(
      game.platform,
    );

  const [
    status,
    setStatus,
  ] =
    useState<GameStatus>(
      game.status,
    );

  const [
    userRating,
    setUserRating,
  ] =
    useState<
      number | null
    >(
      game.user_rating,
    );

  const [
    wishlist,
    setWishlist,
  ] =
    useState(
      game.is_wishlist,
    );

  const [
    error,
    setError,
  ] =
    useState("");

  async function save() {
    setError("");

    setIsSaving(
      true,
    );

    const result =
      await onUpdate(
        game.id,
        {
          platform,

          status,

          user_rating:
            userRating,

          is_wishlist:
            wishlist,
        },
      );

    setIsSaving(
      false,
    );

    if (
      !result.success
    ) {
      setError(
        result.error ??
          "Could not save changes.",
      );

      return;
    }

    setIsEditing(
      false,
    );
  }

  async function rate(
    value: number,
  ) {
    await onUpdate(
      game.id,
      {
        user_rating:
          value,
      },
    );
  }

  const steamGame =
    Boolean(
      game.steam_app_id,
    );

  const lastPlayed =
    formatDate(
      game.steam_last_played_at,
    );

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* COVER */}

      <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
        {game.cover_url ? (
          <Image
            src={
              game.cover_url
            }
            alt={`${game.title} cover`}
            fill
            loading={
              eager
                ? "eager"
                : "lazy"
            }
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center font-black text-white">
            {
              game.title
            }
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* STEAM BADGE */}

        {steamGame && (
          <span className="absolute left-2 top-2 rounded-full bg-slate-950/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">
            Steam
          </span>
        )}

        {/* DELETE */}

        <button
          type="button"
          onClick={() =>
            onDelete(
              game.id,
            )
          }
          aria-label={`Delete ${game.title}`}
          title="Delete Game"
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/60 text-lg font-bold leading-none text-white shadow-sm backdrop-blur transition hover:bg-red-600"
        >
          ×
        </button>

        {/* STATUS */}

        <span
          className={`absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[game.status]}`}
        >
          {
            game.status
          }
        </span>

        {/* WISHLIST BADGE ONLY */}

        {game.is_wishlist && (
          <span className="absolute bottom-2 right-2 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-violet-800">
            Wishlist
          </span>
        )}
      </div>

      {/* BODY */}

      <div className="flex flex-col p-3.5">
        {/* PLATFORM */}

        <div className="h-4">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-600">
            {
              game.platform
            }
          </p>
        </div>

        {/* TITLE */}

        <div className="mt-1.5 h-11">
          <h2 className="line-clamp-2 text-base font-black leading-snug text-slate-950">
            {
              game.title
            }
          </h2>
        </div>

        {/* PUBLISHER + RELEASE */}

        <div className="mt-2 h-10">
          <p className="truncate text-xs font-semibold text-slate-600">
            {game.publisher ??
              "Unknown Publisher"}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            {game.release_date
              ? `Released ${formatDate(
                  game.release_date,
                )}`
              : "Release Date Unknown"}
          </p>
        </div>

        {/* GENRE */}

        <div className="mt-2 h-8">
          <p className="line-clamp-2 text-xs leading-4 text-slate-500">
            {game.genres &&
            game.genres.length >
              0
              ? game.genres.join(
                  " • ",
                )
              : "Genre Unknown"}
          </p>
        </div>

        {/* RATINGS */}

        <div className="mt-3 grid h-[58px] grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-[9px] font-black uppercase text-slate-400">
              IGDB
            </p>

            <p className="mt-0.5 text-sm font-black">
              {game.rating !==
              null
                ? `${Math.round(
                    game.rating,
                  )}/100`
                : "—"}
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-2">
            <p className="text-[9px] font-black uppercase text-amber-600">
              Your Rating
            </p>

            <p className="mt-0.5 text-sm font-black">
              {game.user_rating !==
              null
                ? `${game.user_rating}/5`
                : "—"}
            </p>
          </div>
        </div>

        {/* STEAM ACTIVITY */}

        {steamGame ? (
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() =>
                setIsSteamOpen(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
              aria-expanded={
                isSteamOpen
              }
              className="flex min-h-[52px] w-full items-center justify-between bg-slate-950 px-3 py-2.5 text-left text-white transition hover:bg-slate-900"
            >
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Steam Activity
                </p>

                <p className="mt-0.5 text-xs font-semibold text-white">
                  {hours(
                    game.steam_playtime_minutes,
                  )}{" "}
                  Total Playtime
                </p>
              </div>

              <span
                className={`text-lg font-bold transition-transform ${
                  isSteamOpen
                    ? "rotate-180"
                    : ""
                }`}
              >
                ⌄
              </span>
            </button>

            {isSteamOpen && (
              <div className="bg-slate-950 px-3 pb-3 text-white">
                <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3">
                  <div>
                    <p className="text-lg font-black">
                      {hours(
                        game.steam_playtime_minutes,
                      )}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Total
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-black">
                      {hours(
                        game.steam_playtime_2weeks,
                      )}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Last 2 Weeks
                    </p>
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-800 pt-2">
                  <p className="text-[10px] text-slate-400">
                    Last Played{" "}
                    {lastPlayed ??
                      "—"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="mt-3 h-[54px]"
          />
        )}

        {/* YOUR RATING */}

        {!isEditing && (
          <div className="mt-3">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
              Your Rating
            </p>

            <div className="mt-1 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(
                (
                  star,
                ) => (
                  <button
                    key={
                      star
                    }
                    type="button"
                    onClick={() =>
                      void rate(
                        star,
                      )
                    }
                    aria-label={`Rate ${game.title} ${star} out of 5`}
                    className={`text-lg leading-none transition hover:scale-110 ${
                      star <=
                      (game.user_rating ??
                        0)
                        ? "text-amber-400"
                        : "text-slate-300"
                    }`}
                  >
                    ★
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* EDIT MODE */}

        {isEditing && (
          <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
            <label className="grid gap-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
              Platform

              <select
                value={
                  platform
                }
                onChange={(
                  event,
                ) =>
                  setPlatform(
                    event
                      .target
                      .value,
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium normal-case text-slate-800"
              >
                {platforms.map(
                  (
                    item,
                  ) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {
                        item
                      }
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="grid gap-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
              Status

              <select
                value={
                  status
                }
                onChange={(
                  event,
                ) =>
                  setStatus(
                    event
                      .target
                      .value as GameStatus,
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium normal-case text-slate-800"
              >
                <option value="Backlog">
                  Backlog
                </option>

                <option value="Playing">
                  Playing
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </label>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                Your Rating
              </p>

              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map(
                  (
                    star,
                  ) => (
                    <button
                      key={
                        star
                      }
                      type="button"
                      onClick={() =>
                        setUserRating(
                          star,
                        )
                      }
                      aria-label={`Set ${game.title} rating to ${star} out of 5`}
                      className={`text-xl ${
                        star <=
                        (userRating ??
                          0)
                          ? "text-amber-400"
                          : "text-slate-300"
                      }`}
                    >
                      ★
                    </button>
                  ),
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold">
              <input
                type="checkbox"
                checked={
                  wishlist
                }
                onChange={(
                  event,
                ) =>
                  setWishlist(
                    event
                      .target
                      .checked,
                  )
                }
              />

              Wishlist
            </label>

            {error && (
              <p className="text-xs font-semibold text-red-600">
                {
                  error
                }
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  isSaving
                }
                onClick={() =>
                  void save()
                }
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white disabled:bg-indigo-300"
              >
                {isSaving
                  ? "Saving..."
                  : "Save"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsEditing(
                    false,
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => {
              setPlatform(
                game.platform,
              );

              setStatus(
                game.status,
              );

              setUserRating(
                game.user_rating,
              );

              setWishlist(
                game.is_wishlist,
              );

              setError("");

              setIsEditing(
                true,
              );
            }}
            className="text-xs font-bold text-indigo-600 transition hover:text-indigo-800"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(
                game.id,
              )
            }
            className="text-xs font-bold text-red-600 transition hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}