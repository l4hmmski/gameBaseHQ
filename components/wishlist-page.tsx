"use client";

import Image from "next/image";

import {
  useEffect,
  useMemo,
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
};

export function WishlistPage() {
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
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    let cancelled =
      false;

    async function loadPage() {
      const [
        wishlistResult,
        recommendationResult,
      ] =
        await Promise.all([
          supabase
            .from(
              "games",
            )
            .select(
              `
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
              `,
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
            "/api/recommendations",
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
        recommendationResult.ok
      ) {
        const data =
          (await recommendationResult.json()) as RecommendationResponse;

        setRecommendations(
          data.recommendations ??
            [],
        );
      }

      setIsLoading(
        false,
      );
    }

    void loadPage();

    return () => {
      cancelled =
        true;
    };
  }, []);

  async function removeFromWishlist(
    gameId: string,
  ) {
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

  async function addRecommendationToWishlist(
    recommendation:
      Recommendation,
  ) {
    setError("");

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
        existing,
    } =
      await supabase
        .from(
          "games",
        )
        .select(
          "id, is_wishlist",
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

    if (existing) {
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
              true,
          })
          .eq(
            "id",
            existing.id,
          );

      if (
        updateError
      ) {
        setError(
          "The game could not be added to your wishlist.",
        );

        return;
      }

      window.location.reload();

      return;
    }

    const {
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
        });

    if (
      insertError
    ) {
      console.error(
        insertError,
      );

      setError(
        "The game could not be added to your wishlist.",
      );

      return;
    }

    window.location.reload();
  }

  const recommendationList =
    useMemo(
      () =>
        recommendations.slice(
          0,
          6,
        ),
      [
        recommendations,
      ],
    );

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="font-semibold text-slate-600">
          Loading Your Wishlist...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* RECOMMENDATIONS */}

      <section>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
              Recommended For You
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              You Might Like These
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Recommendations are based
              on games already in your
              library and your ratings.
            </p>
          </div>
        </div>

        {recommendationList.length >
        0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {recommendationList.map(
              (
                game,
              ) => (
                <RecommendationCard
                  key={
                    game.id
                  }
                  game={
                    game
                  }
                  onAdd={
                    addRecommendationToWishlist
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-semibold text-slate-600">
              Add and rate more games
              to improve your
              recommendations.
            </p>
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Some purchase links may be
          affiliate links. Game Library
          may earn a commission from
          qualifying purchases at no
          additional cost to you.
        </p>
      </section>

      {/* WISHLIST */}

      <section>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
          Wishlist
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Games You Want
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {
            wishlistGames.length
          }{" "}
          {wishlistGames.length ===
          1
            ? "game"
            : "games"}
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {
              error
            }
          </div>
        )}

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
              Add games from your
              recommendations or your
              library.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function RecommendationCard({
  game,
  onAdd,
}: {
  game:
    Recommendation;

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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[3/4] bg-slate-100">
        {game.coverUrl ? (
          <Image
            src={
              game.coverUrl
            }
            alt={`${game.title} cover`}
            fill
            sizes="200px"
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

      <div className="p-3">
        <h3 className="line-clamp-2 h-10 text-sm font-black leading-5 text-slate-950">
          {
            game.title
          }
        </h3>

        <p className="mt-2 text-xs text-slate-500">
          {game.rating !==
          null
            ? `IGDB ${game.rating}/100`
            : "No Rating"}
        </p>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={() =>
              void onAdd(
                game,
              )
            }
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
          >
            Add to Wishlist
          </button>

          <a
            href={
              amazonUrl
            }
            target="_blank"
            rel="sponsored noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Buy on Amazon
          </a>
        </div>
      </div>
    </article>
  );
}

function WishlistCard({
  game,
  onRemove,
}: {
  game:
    Game;

  onRemove: (
    id:
      string,
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

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
      </div>

      <div className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-600">
          {
            game.platform
          }
        </p>

        <h3 className="mt-1 line-clamp-2 h-11 font-black leading-snug text-slate-950">
          {
            game.title
          }
        </h3>

        <p className="mt-2 text-xs text-slate-500">
          {game.publisher ??
            "Unknown Publisher"}
        </p>

        <div className="mt-4 grid gap-2">
          <a
            href={
              amazonUrl
            }
            target="_blank"
            rel="sponsored noreferrer"
            className="rounded-lg bg-slate-950 px-3 py-2.5 text-center text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Check Price
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