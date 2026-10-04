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
    | "notes"
    | "is_wishlist"
  >
>;

type UpdateResult = {
  success: boolean;
  error?: string;
};

type GameCardProps = {
  game: Game;

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
  onUpdate,
}: GameCardProps) {
  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    editError,
    setEditError,
  ] = useState("");

  const [
    hoverRating,
    setHoverRating,
  ] =
    useState<number | null>(
      null,
    );

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
    notes,
    setNotes,
  ] =
    useState(
      game.notes ?? "",
    );

  const [
    isWishlist,
    setIsWishlist,
  ] =
    useState(
      game.is_wishlist,
    );

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
    userRating ??
    0;

  function resetDraft() {
    setPlatform(
      game.platform,
    );

    setStatus(
      game.status,
    );

    setUserRating(
      game.user_rating,
    );

    setNotes(
      game.notes ?? "",
    );

    setIsWishlist(
      game.is_wishlist,
    );

    setHoverRating(
      null,
    );

    setEditError("");
  }

  function handleStartEditing() {
    resetDraft();

    setIsEditing(
      true,
    );
  }

  function handleCancel() {
    resetDraft();

    setIsEditing(
      false,
    );
  }

  async function handleSave() {
    setEditError("");

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

          notes:
            notes.trim() ||
            null,

          is_wishlist:
            isWishlist,
        },
      );

    setIsSaving(
      false,
    );

    if (
      !result.success
    ) {
      setEditError(
        result.error ??
          "Your changes could not be saved.",
      );

      return;
    }

    setIsEditing(
      false,
    );
  }

  async function handleQuickRating(
    rating: number,
  ) {
    setEditError("");

    const previousRating =
      game.user_rating;

    setUserRating(
      rating,
    );

    const result =
      await onUpdate(
        game.id,
        {
          user_rating:
            rating,
        },
      );

    if (
      !result.success
    ) {
      setUserRating(
        previousRating,
      );

      setEditError(
        result.error ??
          "Your rating could not be saved.",
      );
    }
  }

  async function handleQuickWishlist() {
    setEditError("");

    const newValue =
      !game.is_wishlist;

    const result =
      await onUpdate(
        game.id,
        {
          is_wishlist:
            newValue,
        },
      );

    if (
      !result.success
    ) {
      setEditError(
        result.error ??
          "Wishlist could not be updated.",
      );
    }
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* COVER */}

      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-800">
        {game.cover_url ? (
          <Image
            src={
              game.cover_url
            }
            alt={`${game.title} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
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

        <button
          type="button"
          onClick={() =>
            void handleQuickWishlist()
          }
          title={
            game.is_wishlist
              ? "Remove From Wishlist"
              : "Add to Wishlist"
          }
          aria-label={
            game.is_wishlist
              ? `Remove ${game.title} from wishlist`
              : `Add ${game.title} to wishlist`
          }
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition ${
            game.is_wishlist
              ? "border-pink-300 bg-pink-500 text-white"
              : "border-white/40 bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <span className="text-xl">
            ♥
          </span>
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
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
          </div>

          {game.is_wishlist && (
            <span className="shrink-0 rounded-full bg-pink-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-pink-700">
              Wishlist
            </span>
          )}
        </div>

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

        {!isEditing && (
          <div className="mt-4 rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Your Rating
              </p>

              {game.user_rating !==
                null && (
                <span className="text-xs font-bold text-slate-500">
                  {
                    game.user_rating
                  }
                  /5
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
                    onMouseEnter={() =>
                      setHoverRating(
                        star,
                      )
                    }
                    onClick={() =>
                      void handleQuickRating(
                        star,
                      )
                    }
                    aria-label={`Rate ${game.title} ${star} out of 5`}
                    className="text-2xl leading-none transition hover:scale-110"
                  >
                    <span
                      className={
                        star <=
                        (hoverRating ??
                          game.user_rating ??
                          0)
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
          </div>
        )}

        {!isEditing &&
          game.notes && (
            <div className="mt-4 rounded-xl bg-indigo-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-500">
                Your Notes
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {
                  game.notes
                }
              </p>
            </div>
          )}

        {isEditing && (
          <div className="mt-4 space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
            <label className="grid gap-2 text-sm font-bold text-slate-800">
              Platform

              <select
                value={
                  platform
                }
                onChange={(
                  event,
                ) =>
                  setPlatform(
                    event.target
                      .value,
                  )
                }
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-indigo-500"
              >
                {platforms.map(
                  (
                    platformOption,
                  ) => (
                    <option
                      key={
                        platformOption
                      }
                      value={
                        platformOption
                      }
                    >
                      {
                        platformOption
                      }
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-800">
              Status

              <select
                value={
                  status
                }
                onChange={(
                  event,
                ) =>
                  setStatus(
                    event.target
                      .value as GameStatus,
                  )
                }
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-indigo-500"
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

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <input
                type="checkbox"
                checked={
                  isWishlist
                }
                onChange={(
                  event,
                ) =>
                  setIsWishlist(
                    event.target
                      .checked,
                  )
                }
                className="h-4 w-4 accent-pink-500"
              />

              <span className="text-sm font-bold text-slate-700">
                Wishlist
              </span>
            </label>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">
                  Your Rating
                </p>

                {userRating !==
                  null && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserRating(
                        null,
                      );

                      setHoverRating(
                        null,
                      );
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div
                className="mt-2 flex gap-1"
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
                      onMouseEnter={() =>
                        setHoverRating(
                          star,
                        )
                      }
                      onClick={() =>
                        setUserRating(
                          star,
                        )
                      }
                      aria-label={`Set rating to ${star} out of 5`}
                      className="text-2xl transition hover:scale-110"
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
            </div>

            <label className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Notes
                </span>

                <span className="text-xs font-semibold text-slate-400">
                  {
                    notes.length
                  }
                  /1000
                </span>
              </div>

              <textarea
                value={
                  notes
                }
                onChange={(
                  event,
                ) =>
                  setNotes(
                    event.target
                      .value,
                  )
                }
                maxLength={
                  1000
                }
                rows={4}
                placeholder="Add your thoughts, progress, reminders or review..."
                className="resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500"
              />
            </label>

            {editError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {
                  editError
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
                  void handleSave()
                }
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                disabled={
                  isSaving
                }
                onClick={
                  handleCancel
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!isEditing &&
          editError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {
                editError
              }
            </p>
          )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => {
              if (
                isEditing
              ) {
                handleCancel();

                return;
              }

              handleStartEditing();
            }}
            className="text-sm font-bold text-indigo-600 transition hover:text-indigo-800"
          >
            {isEditing
              ? "Close Edit"
              : "Edit Game"}
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(
                game.id,
              )
            }
            className="text-sm font-bold text-red-600 transition hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}