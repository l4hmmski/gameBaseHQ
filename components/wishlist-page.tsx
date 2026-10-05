"use client";

import Image from "next/image";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getAmazonAffiliateUrl,
} from "@/lib/affiliate-links";

import {
  supabase,
} from "@/lib/supabase";

import type {
  Game,
} from "@/types/game";

type Recommendation = {
  id: number;

  title: string;

  coverUrl:
    | string
    | null;

  publisher:
    | string
    | null;

  releaseDate:
    | string
    | null;

  genres:
    string[];

  rating:
    | number
    | null;
};

type RecommendationResponse = {
  recommendations:
    Recommendation[];

  error?: string;
};

const GAME_SELECT = `
  id,
  igdb_id,
  steam_app_id,
  title,
  platform,
  status,
  cover_url,
  publisher,
  release_date,
  genres,
  rating,
  user_rating,
  notes,
  is_wishlist,
  steam_playtime_minutes,
  steam_playtime_2weeks,
  steam_last_played_at,
  steam_synced_at
`;

export function WishlistPage() {
  const recommendationScroller =
    useRef<HTMLDivElement>(
      null,
    );

  const [
    wishlistGames,
    setWishlistGames,
  ] =
    useState<Game[]>([]);

  const [
    recommendations,
    setRecommendations,
  ] =
    useState<
      Recommendation[]
    >([]);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    refreshNumber,
    setRefreshNumber,
  ] =
    useState(0);

  const [
    addingGameId,
    setAddingGameId,
  ] =
    useState<
      number | null
    >(null);

  useEffect(() => {
    let cancelled =
      false;

    async function loadPage() {
      try {
        const [
          wishlistResult,
          recommendationResponse,
        ] =
          await Promise.all([
            supabase
              .from(
                "games",
              )
              .select(
                GAME_SELECT,
              )
              .eq(
                "is_wishlist",
                true,
              )
              .order(
                "created_at",
                {
                  ascending:
                    false,
                },
              ),

            fetch(
              "/api/recommendations?refresh=0",
              {
                cache:
                  "no-store",
              },
            ),
          ]);

        if (
          cancelled
        ) {
          return;
        }

        if (
          wishlistResult.error
        ) {
          console.error(
            wishlistResult.error,
          );

          setError(
            "Your wishlist could not be loaded.",
          );
        } else {
          setWishlistGames(
            (
              wishlistResult.data ??
              []
            ) as Game[],
          );
        }

        if (
          recommendationResponse.ok
        ) {
          const data =
            (await recommendationResponse.json()) as RecommendationResponse;

          setRecommendations(
            data.recommendations ??
              [],
          );
        }
      } catch (
        loadError
      ) {
        console.error(
          loadError,
        );

        if (
          !cancelled
        ) {
          setError(
            "Your wishlist could not be loaded.",
          );
        }
      } finally {
        if (
          !cancelled
        ) {
          setIsLoading(
            false,
          );
        }
      }
    }

    void loadPage();

    return () => {
      cancelled =
        true;
    };
  }, []);

  function scrollRecommendations(
    direction:
      "left" |
      "right",
  ) {
    const container =
      recommendationScroller.current;

    if (!container) {
      return;
    }

    const distance =
      Math.max(
        container.clientWidth *
          0.8,
        300,
      );

    container.scrollBy({
      left:
        direction ===
        "right"
          ? distance
          : -distance,

      behavior:
        "smooth",
    });
  }

  async function refreshRecommendations() {
    setIsRefreshing(
      true,
    );

    setError("");

    try {
      const nextRefresh =
        refreshNumber +
        1;

      const response =
        await fetch(
          `/api/recommendations?refresh=${nextRefresh}`,
          {
            cache:
              "no-store",
          },
        );

      if (
        !response.ok
      ) {
        setError(
          "Recommendations could not be refreshed.",
        );

        return;
      }

      const data =
        (await response.json()) as RecommendationResponse;

      setRecommendations(
        data.recommendations ??
          [],
      );

      setRefreshNumber(
        nextRefresh,
      );

      recommendationScroller
        .current
        ?.scrollTo({
          left: 0,
          behavior:
            "smooth",
        });
    } catch (
      refreshError
    ) {
      console.error(
        refreshError,
      );

      setError(
        "Recommendations could not be refreshed.",
      );
    } finally {
      setIsRefreshing(
        false,
      );
    }
  }

  async function removeFromWishlist(
    gameId: string,
  ) {
    setError("");

    const {
      error:
        updateError,
    } =
      await supabase
        .from(
          "games",
        )
        .update({
          is_wishlist:
            false,
        })
        .eq(
          "id",
          gameId,
        );

    if (
      updateError
    ) {
      setError(
        "The wishlist could not be updated.",
      );

      return;
    }

    setWishlistGames(
      (
        current,
      ) =>
        current.filter(
          (game) =>
            game.id !==
            gameId,
        ),
    );
  }

  async function deleteWishlistGame(
    gameId: string,
  ) {
    setError("");

    const {
      error:
        deleteError,
    } =
      await supabase
        .from(
          "games",
        )
        .delete()
        .eq(
          "id",
          gameId,
        );

    if (
      deleteError
    ) {
      console.error(
        deleteError,
      );

      setError(
        "The game could not be deleted.",
      );

      return;
    }

    setWishlistGames(
      (
        current,
      ) =>
        current.filter(
          (game) =>
            game.id !==
            gameId,
        ),
    );
  }

  async function addRecommendationToWishlist(
    recommendation:
      Recommendation,
  ) {
    setError("");

    setAddingGameId(
      recommendation.id,
    );

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setError(
          "You must be logged in.",
        );

        return;
      }

      const {
        data:
          existingGame,

        error:
          existingError,
      } =
        await supabase
          .from(
            "games",
          )
          .select(
            GAME_SELECT,
          )
          .eq(
            "user_id",
            user.id,
          )
          .eq(
            "igdb_id",
            recommendation.id,
          )
          .limit(
            1,
          )
          .maybeSingle();

      if (
        existingError
      ) {
        console.error(
          existingError,
        );

        setError(
          "The game could not be added to your wishlist.",
        );

        return;
      }

      if (
        existingGame
      ) {
        if (
          existingGame.is_wishlist
        ) {
          setError(
            `${recommendation.title} is already in your wishlist.`,
          );

          setRecommendations(
            (
              current,
            ) =>
              current.filter(
                (game) =>
                  game.id !==
                  recommendation.id,
              ),
          );

          return;
        }

        const {
          data:
            updatedGame,

          error:
            updateError,
        } =
          await supabase
            .from(
              "games",
            )
            .update({
              is_wishlist:
                true,
            })
            .eq(
              "id",
              existingGame.id,
            )
            .select(
              GAME_SELECT,
            )
            .single();

        if (
          updateError
        ) {
          if (
            updateError.code ===
            "23505"
          ) {
            setError(
              `${recommendation.title} is already in your wishlist.`,
            );

            return;
          }

          console.error(
            updateError,
          );

          setError(
            "The game could not be added to your wishlist.",
          );

          return;
        }

        setWishlistGames(
          (
            current,
          ) => [
            updatedGame as Game,
            ...current.filter(
              (game) =>
                game.id !==
                updatedGame.id,
            ),
          ],
        );

        setRecommendations(
          (
            current,
          ) =>
            current.filter(
              (game) =>
                game.id !==
                recommendation.id,
            ),
        );

        return;
      }

      const {
        data:
          insertedGame,

        error:
          insertError,
      } =
        await supabase
          .from(
            "games",
          )
          .insert({
            user_id:
              user.id,

            igdb_id:
              recommendation.id,

            title:
              recommendation.title,

            platform:
              "PC",

            status:
              "Backlog",

            cover_url:
              recommendation.coverUrl,

            publisher:
              recommendation.publisher,

            release_date:
              recommendation.releaseDate,

            genres:
              recommendation.genres,

            rating:
              recommendation.rating,

            user_rating:
              null,

            is_wishlist:
              true,

            notes:
              null,
          })
          .select(
            GAME_SELECT,
          )
          .single();

      if (
        insertError
      ) {
        if (
          insertError.code ===
          "23505"
        ) {
          setError(
            `${recommendation.title} is already in your wishlist.`,
          );

          return;
        }

        console.error(
          insertError,
        );

        setError(
          "The game could not be added to your wishlist.",
        );

        return;
      }

      setWishlistGames(
        (
          current,
        ) => [
          insertedGame as Game,
          ...current,
        ],
      );

      setRecommendations(
        (
          current,
        ) =>
          current.filter(
            (game) =>
              game.id !==
              recommendation.id,
          ),
      );
    } finally {
      setAddingGameId(
        null,
      );
    }
  }

  if (
    isLoading
  ) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="font-semibold text-slate-600">
          Loading Your Wishlist...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {
            error
          }
        </div>
      )}

      {/* GAMES YOU WANT */}

      <section>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
            Your Wishlist
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Games You Want
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {
              wishlistGames.length
            }{" "}
            {wishlistGames.length ===
            1
              ? "Game"
              : "Games"}
          </p>
        </div>

        {wishlistGames.length >
        0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {wishlistGames.map(
              (
                game,
              ) => (
                <WishlistCard
                  key={
                    game.id
                  }
                  game={
                    game
                  }
                  onRemove={
                    removeFromWishlist
                  }
                  onDelete={
                    deleteWishlistGame
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-xl font-black text-slate-950">
              Your Wishlist Is Empty
            </h3>

            <p className="mt-2 text-slate-500">
              Add games you want to play
              from your library or the
              recommendations below.
            </p>
          </div>
        )}
      </section>

      {/* RECOMMENDATIONS */}

      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
              Recommended For You
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Discover Your Next Game
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Based on the titles,
              genres, publishers and
              release dates of games in
              your wishlist.
            </p>
          </div>

          <button
            type="button"
            disabled={
              isRefreshing
            }
            onClick={() =>
              void refreshRecommendations()
            }
            className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {isRefreshing
              ? "Refreshing..."
              : "↻ Refresh Recommendations"}
          </button>
        </div>

        {recommendations.length >
        0 ? (
          <div className="relative mt-6">
            <button
              type="button"
              aria-label="Scroll Recommendations Left"
              onClick={() =>
                scrollRecommendations(
                  "left",
                )
              }
              className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-2xl font-bold text-slate-700 shadow-lg backdrop-blur transition hover:bg-white"
            >
              ‹
            </button>

            <div
              ref={
                recommendationScroller
              }
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-3"
            >
              {recommendations.map(
                (
                  game,
                ) => (
                  <div
                    key={
                      game.id
                    }
                    className="w-[190px] shrink-0 snap-start sm:w-[205px] lg:w-[215px]"
                  >
                    <RecommendationCard
                      game={
                        game
                      }
                      isAdding={
                        addingGameId ===
                        game.id
                      }
                      onAdd={
                        addRecommendationToWishlist
                      }
                    />
                  </div>
                ),
              )}
            </div>

            <button
              type="button"
              aria-label="Scroll Recommendations Right"
              onClick={() =>
                scrollRecommendations(
                  "right",
                )
              }
              className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-2xl font-bold text-slate-700 shadow-lg backdrop-blur transition hover:bg-white"
            >
              ›
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="font-black text-slate-950">
              Add Wishlist Games First
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Your recommendations are
              generated from the games
              in your wishlist.
            </p>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">
          As an Amazon Associate,
          Game Library may earn from
          qualifying purchases.
        </p>
      </section>
    </div>
  );
}

function RecommendationCard({
  game,
  isAdding,
  onAdd,
}: {
  game:
    Recommendation;

  isAdding:
    boolean;

  onAdd: (
    game:
      Recommendation,
  ) =>
    Promise<void>;
}) {
  const amazonUrl =
    getAmazonAffiliateUrl({
      title:
        game.title,
    });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[3/4] bg-slate-100">
        {game.coverUrl ? (
          <Image
            src={
              game.coverUrl
            }
            alt={`${game.title} cover`}
            fill
            sizes="215px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center font-bold text-slate-500">
            {
              game.title
            }
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="h-11">
          <h3 className="line-clamp-2 font-black leading-snug text-slate-950">
            {
              game.title
            }
          </h3>
        </div>

        <p className="mt-2 truncate text-xs font-semibold text-slate-500">
          {game.publisher ??
            "Unknown Publisher"}
        </p>

        <div className="mt-3 h-8">
          <p className="line-clamp-2 text-xs leading-4 text-slate-500">
            {game.genres.length >
            0
              ? game.genres.join(
                  " • ",
                )
              : "Genre Unknown"}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-3">
          <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
            IGDB
          </p>

          <p className="text-sm font-black text-slate-950">
            {game.rating !==
            null
              ? `${game.rating}/100`
              : "—"}
          </p>
        </div>

        <div className="mt-auto grid gap-2 pt-4">
          <button
            type="button"
            disabled={
              isAdding
            }
            onClick={() =>
              void onAdd(
                game,
              )
            }
            className="rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isAdding
              ? "Adding..."
              : "Add to Wishlist"}
          </button>

          <a
            href={
              amazonUrl
            }
            target="_blank"
            rel="sponsored noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Check Price on Amazon
          </a>
        </div>
      </div>
    </article>
  );
}

function WishlistCard({
  game,
  onRemove,
  onDelete,
}: {
  game:
    Game;

  onRemove: (
    id: string,
  ) =>
    Promise<void>;

  onDelete: (
    id: string,
  ) =>
    Promise<void>;
}) {
  const amazonUrl =
    getAmazonAffiliateUrl({
      title:
        game.title,

      platform:
        game.platform,
    });

  const steamGame =
    Boolean(
      game.steam_app_id,
    );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[3/4] bg-slate-100">
        {game.cover_url ? (
          <Image
            src={
              game.cover_url
            }
            alt={`${game.title} cover`}
            fill
            sizes="250px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center font-bold text-slate-500">
            {
              game.title
            }
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {steamGame && (
          <span className="absolute left-2 top-2 rounded-full bg-slate-950/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">
            Steam
          </span>
        )}

        {/* ONLY DELETE CONTROL */}

        <button
          type="button"
          onClick={() =>
            void onDelete(
              game.id,
            )
          }
          aria-label={`Delete ${game.title}`}
          title="Delete Game"
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/60 text-lg font-bold leading-none text-white shadow-sm backdrop-blur transition hover:bg-red-600"
        >
          ×
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-600">
          {
            game.platform
          }
        </p>

        <div className="mt-1 h-11">
          <h3 className="line-clamp-2 font-black leading-snug text-slate-950">
            {
              game.title
            }
          </h3>
        </div>

        <p className="mt-2 truncate text-xs text-slate-500">
          {game.publisher ??
            "Unknown Publisher"}
        </p>

        <div className="mt-auto grid gap-2 pt-4">
          <a
            href={
              amazonUrl
            }
            target="_blank"
            rel="sponsored noreferrer"
            className="rounded-lg bg-slate-950 px-3 py-2.5 text-center text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Check Price on Amazon
          </a>

          <button
            type="button"
            onClick={() =>
              void onRemove(
                game.id,
              )
            }
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Remove From Wishlist
          </button>
        </div>
      </div>
    </article>
  );
}