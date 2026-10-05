"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  track,
} from "@vercel/analytics";

import {
  GameCard,
} from "@/components/game-card";

import {
  GameForm,
} from "@/components/game-form";

import {
  supabase,
} from "@/lib/supabase";

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

export function GameLibrary() {
  const [
    games,
    setGames,
  ] =
    useState<Game[]>([]);

  const [
    search,
    setSearch,
  ] =
    useState("");

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
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function loadGames() {
      const {
        data,
        error:
          loadError,
      } =
        await supabase
          .from(
            "games",
          )
          .select(
            GAME_SELECT,
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
        .from(
          "games",
        )
        .select(
          "id",
        )
        .eq(
          "user_id",
          userData
            .user.id,
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
    } =
      await duplicateQuery
        .limit(
          1,
        )
        .maybeSingle();

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
    } =
      await supabase
        .from(
          "games",
        )
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
            userData
              .user.id,
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
        current,
      ) => [
        data as Game,
        ...current,
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
    const {
      data,
      error:
        updateError,
    } =
      await supabase
        .from(
          "games",
        )
        .update(
          updates,
        )
        .eq(
          "id",
          gameId,
        )
        .select(
          GAME_SELECT,
        )
        .single();

    if (
      updateError
    ) {
      return {
        success:
          false,

        error:
          updateError.code ===
          "23505"
            ? "You already have this game on that platform."
            : "Your changes could not be saved.",
      };
    }

    setGames(
      (
        current,
      ) =>
        current.map(
          (
            game,
          ) =>
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

  /*
    Delete immediately.

    No window.confirm() popup.
  */

  async function deleteGame(
    gameId:
      string,
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
        "The game could not be removed.",
      );

      return;
    }

    setGames(
      (
        current,
      ) =>
        current.filter(
          (
            game,
          ) =>
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

      return [
        ...games.filter(
          (
            game,
          ) => {
            const searchText =
              [
                game.title,

                game.platform,

                game.publisher ??
                  "",

                (
                  game.genres ??
                  []
                ).join(
                  " ",
                ),

                game.notes ??
                  "",
              ]
                .join(
                  " ",
                )
                .toLowerCase();

            const searchMatch =
              searchText.includes(
                cleanSearch,
              );

            const filterMatch =
              filter ===
              "All"
                ? true
                : filter ===
                    "Wishlist"
                  ? game.is_wishlist
                  : game.status ===
                    filter;

            return (
              searchMatch &&
              filterMatch
            );
          },
        ),
      ].sort(
        (
          a,
          b,
        ) => {
          if (
            sortOrder ===
            "title-descending"
          ) {
            return b.title.localeCompare(
              a.title,
            );
          }

          if (
            sortOrder ===
            "platform"
          ) {
            return a.platform.localeCompare(
              b.platform,
            );
          }

          if (
            sortOrder ===
            "user-rating"
          ) {
            return (
              (b.user_rating ??
                0) -
              (a.user_rating ??
                0)
            );
          }

          if (
            sortOrder ===
            "igdb-rating"
          ) {
            return (
              (b.rating ??
                0) -
              (a.rating ??
                0)
            );
          }

          if (
            sortOrder ===
            "steam-playtime"
          ) {
            return (
              (b.steam_playtime_minutes ??
                0) -
              (a.steam_playtime_minutes ??
                0)
            );
          }

          return a.title.localeCompare(
            b.title,
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
                  event
                    .target
                    .value,
                )
              }
              placeholder="Search Your Library"
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 outline-none focus:border-indigo-500"
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
                  event
                    .target
                    .value as FilterOption,
                )
              }
              className="h-11 rounded-xl border border-slate-300 bg-white px-4"
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
                  event
                    .target
                    .value,
                )
              }
              className="h-11 rounded-xl border border-slate-300 bg-white px-4"
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

              <option value="steam-playtime">
                Steam Playtime
              </option>
            </select>
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {
            error
          }
        </p>
      )}

      {isLoading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-600">
            Loading Your Library...
          </p>
        </div>
      )}

      {!isLoading &&
        visibleGames.length >
          0 && (
          <div className="grid items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {visibleGames.map(
              (
                game,
              ) => (
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
        )}

      {!isLoading &&
        visibleGames.length ===
          0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="font-black text-slate-950">
              No Games Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add a game or change your filters.
            </p>
          </div>
        )}
    </section>
  );
}