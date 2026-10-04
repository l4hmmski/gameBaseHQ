"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  track,
} from "@vercel/analytics";

import { GameCard } from "@/components/game-card";
import { GameForm } from "@/components/game-form";
import { LibraryStats } from "@/components/library-stats";

import { supabase } from "@/lib/supabase";

import type {
  Game,
  GameStatus,
} from "@/types/game";

type NewGame =
  Omit<Game, "id">;

type AddGameResult = {
  success: boolean;
  error?: string;
};

type UpdateGameResult = {
  success: boolean;
  error?: string;
};

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

type FilterOption =
  | "All"
  | "Wishlist"
  | GameStatus;

export function GameLibrary() {
  const [
    games,
    setGames,
  ] =
    useState<Game[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] =
    useState<FilterOption>(
      "All",
    );

  const [
    sortOrder,
    setSortOrder,
  ] =
    useState(
      "title-ascending",
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    async function loadGames() {
      const {
        data,
        error:
          loadError,
      } = await supabase
        .from("games")
        .select(
          "id, igdb_id, title, platform, status, cover_url, publisher, release_date, genres, rating, user_rating, notes, is_wishlist",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        );

      if (
        loadError
      ) {
        console.error(
          loadError,
        );

        setError(
          "Your games could not be loaded.",
        );

        setIsLoading(
          false,
        );

        return;
      }

      setGames(
        (data ??
          []) as Game[],
      );

      setIsLoading(
        false,
      );
    }

    void loadGames();
  }, []);

  async function addGame(
    newGame:
      NewGame,
  ): Promise<AddGameResult> {
    setError("");

    const {
      data:
        userData,
      error:
        userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !userData.user
    ) {
      return {
        success:
          false,

        error:
          "You must be logged in to add a game.",
      };
    }

    let duplicateQuery =
      supabase
        .from("games")
        .select("id")
        .eq(
          "user_id",
          userData.user.id,
        )
        .eq(
          "platform",
          newGame.platform,
        );

    if (
      newGame.igdb_id !==
      null
    ) {
      duplicateQuery =
        duplicateQuery.eq(
          "igdb_id",
          newGame.igdb_id,
        );
    } else {
      duplicateQuery =
        duplicateQuery.eq(
          "title",
          newGame.title,
        );
    }

    const {
      data:
        duplicateGame,

      error:
        duplicateError,
    } =
      await duplicateQuery
        .limit(1)
        .maybeSingle();

    if (
      duplicateError
    ) {
      console.error(
        "Duplicate check failed:",
        duplicateError,
      );

      return {
        success:
          false,

        error:
          "The game could not be checked before saving.",
      };
    }

    if (
      duplicateGame
    ) {
      return {
        success:
          false,

        error:
          `${newGame.title} is already in your library on ${newGame.platform}.`,
      };
    }

    const {
      data,
      error:
        insertError,
    } = await supabase
      .from("games")
      .insert({
        igdb_id:
          newGame.igdb_id,

        title:
          newGame.title,

        platform:
          newGame.platform,

        status:
          newGame.status,

        cover_url:
          newGame.cover_url,

        publisher:
          newGame.publisher,

        release_date:
          newGame.release_date,

        genres:
          newGame.genres,

        rating:
          newGame.rating,

        user_rating:
          newGame.user_rating,

        notes:
          newGame.notes,

        is_wishlist:
          newGame.is_wishlist,

        user_id:
          userData.user.id,
      })
      .select(
        "id, igdb_id, title, platform, status, cover_url, publisher, release_date, genres, rating, user_rating, notes, is_wishlist",
      )
      .single();

    if (
      insertError
    ) {
      console.error(
        insertError,
      );

      if (
        insertError.code ===
        "23505"
      ) {
        return {
          success:
            false,

          error:
            `${newGame.title} is already in your library on ${newGame.platform}.`,
        };
      }

      return {
        success:
          false,

        error:
          "The game could not be saved.",
      };
    }

    setGames(
      (
        currentGames,
      ) => [
        data as Game,
        ...currentGames,
      ],
    );

    track(
      "Game Added",
      {
        platform:
          newGame.platform,

        wishlist:
          newGame.is_wishlist,
      },
    );

    return {
      success:
        true,
    };
  }

  async function updateGame(
    gameId:
      string,

    updates:
      GameUpdates,
  ): Promise<UpdateGameResult> {
    setError("");

    const {
      data,
      error:
        updateError,
    } = await supabase
      .from("games")
      .update(
        updates,
      )
      .eq(
        "id",
        gameId,
      )
      .select(
        "id, igdb_id, title, platform, status, cover_url, publisher, release_date, genres, rating, user_rating, notes, is_wishlist",
      )
      .single();

    if (
      updateError
    ) {
      console.error(
        "Game update failed:",
        updateError,
      );

      if (
        updateError.code ===
        "23505"
      ) {
        return {
          success:
            false,

          error:
            "You already have this game on that platform.",
        };
      }

      return {
        success:
          false,

        error:
          "Your changes could not be saved.",
      };
    }

    setGames(
      (
        currentGames,
      ) =>
        currentGames.map(
          (game) =>
            game.id ===
            gameId
              ? (data as Game)
              : game,
        ),
    );

    return {
      success:
        true,
    };
  }

  async function deleteGame(
    gameId:
      string,
  ) {
    setError("");

    const confirmed =
      window.confirm(
        "Remove this game from your library?",
      );

    if (!confirmed) {
      return;
    }

    const {
      error:
        deleteError,
    } =
      await supabase
        .from("games")
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
        "The game could not be removed.",
      );

      return;
    }

    setGames(
      (
        currentGames,
      ) =>
        currentGames.filter(
          (game) =>
            game.id !==
            gameId,
        ),
    );
  }

  const visibleGames =
    useMemo(() => {
      const cleanSearch =
        search
          .trim()
          .toLowerCase();

      const filteredGames =
        games.filter(
          (game) => {
            const publisher =
              game.publisher ??
              "";

            const genreText =
              (
                game.genres ??
                []
              ).join(
                " ",
              );

            const notes =
              game.notes ??
              "";

            const matchesSearch =
              game.title
                .toLowerCase()
                .includes(
                  cleanSearch,
                ) ||
              game.platform
                .toLowerCase()
                .includes(
                  cleanSearch,
                ) ||
              publisher
                .toLowerCase()
                .includes(
                  cleanSearch,
                ) ||
              genreText
                .toLowerCase()
                .includes(
                  cleanSearch,
                ) ||
              notes
                .toLowerCase()
                .includes(
                  cleanSearch,
                );

            let matchesFilter =
              true;

            if (
              filter ===
              "Wishlist"
            ) {
              matchesFilter =
                game.is_wishlist;
            } else if (
              filter !==
              "All"
            ) {
              matchesFilter =
                game.status ===
                filter;
            }

            return (
              matchesSearch &&
              matchesFilter
            );
          },
        );

      return [
        ...filteredGames,
      ].sort(
        (
          gameA,
          gameB,
        ) => {
          if (
            sortOrder ===
            "title-descending"
          ) {
            return gameB.title.localeCompare(
              gameA.title,
            );
          }

          if (
            sortOrder ===
            "platform"
          ) {
            return gameA.platform.localeCompare(
              gameB.platform,
            );
          }

          if (
            sortOrder ===
            "user-rating"
          ) {
            return (
              (gameB.user_rating ??
                0) -
              (gameA.user_rating ??
                0)
            );
          }

          if (
            sortOrder ===
            "igdb-rating"
          ) {
            return (
              (gameB.rating ??
                0) -
              (gameA.rating ??
                0)
            );
          }

          return gameA.title.localeCompare(
            gameB.title,
          );
        },
      );
    }, [
      games,
      search,
      filter,
      sortOrder,
    ]);

  return (
    <section className="space-y-8">
      <LibraryStats
        games={
          games
        }
      />

      <GameForm
        onAddGame={
          addGame
        }
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Search Library

            <input
              type="search"
              value={
                search
              }
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search games, publishers, genres or notes"
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Filter

            <select
              value={
                filter
              }
              onChange={(
                event,
              ) =>
                setFilter(
                  event.target
                    .value as FilterOption,
                )
              }
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none"
            >
              <option value="All">
                All Games
              </option>

              <option value="Wishlist">
                Wishlist
              </option>

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

          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Sort By

            <select
              value={
                sortOrder
              }
              onChange={(
                event,
              ) =>
                setSortOrder(
                  event.target
                    .value,
                )
              }
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none"
            >
              <option value="title-ascending">
                Title A–Z
              </option>

              <option value="title-descending">
                Title Z–A
              </option>

              <option value="platform">
                Platform
              </option>

              <option value="user-rating">
                Your Rating
              </option>

              <option value="igdb-rating">
                IGDB Rating
              </option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Your Collection
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            {
              visibleGames.length
            }

            {visibleGames.length ===
            1
              ? " Game"
              : " Games"}
          </h2>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-700">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="font-semibold text-slate-700">
            Loading Your Games...
          </p>
        </div>
      ) : visibleGames.length >
        0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleGames.map(
            (game) => (
              <GameCard
                key={
                  game.id
                }
                game={
                  game
                }
                onDelete={
                  deleteGame
                }
                onUpdate={
                  updateGame
                }
              />
            ),
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-xl font-bold text-slate-950">
            No Games Found
          </h2>

          <p className="mt-2 text-slate-600">
            Add a game or change your search filters.
          </p>
        </div>
      )}
    </section>
  );
}