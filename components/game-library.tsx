"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { GameCard } from "@/components/game-card";
import { GameForm } from "@/components/game-form";
import { supabase } from "@/lib/supabase";

import type {
  Game,
  GameStatus,
} from "@/types/game";

type NewGame =
  Omit<
    Game,
    "id"
  >;

type StatusFilter =
  | "All"
  | GameStatus;

export function GameLibrary() {
  const [
    games,
    setGames,
  ] =
    useState<
      Game[]
    >([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
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
  ] = useState("");

  useEffect(() => {
    async function loadGames() {
      const {
        data,
        error:
          loadError,
      } = await supabase
        .from(
          "games",
        )
        .select(
          "id, title, platform, status, cover_url, publisher, release_date, genres, rating",
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
  ) {
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
      setError(
        "You must be logged in to add a game.",
      );

      return;
    }

    const {
      data,
      error:
        insertError,
    } = await supabase
      .from(
        "games",
      )
      .insert({
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

        user_id:
          userData
            .user.id,
      })
      .select(
        "id, title, platform, status, cover_url, publisher, release_date, genres, rating",
      )
      .single();

    if (
      insertError
    ) {
      console.error(
        insertError,
      );

      setError(
        "The game could not be saved.",
      );

      return;
    }

    setGames(
      (
        currentGames,
      ) => [
        data as Game,
        ...currentGames,
      ],
    );
  }

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
        currentGames,
      ) =>
        currentGames.filter(
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

      const filteredGames =
        games.filter(
          (
            game,
          ) => {
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
                );

            const matchesStatus =
              statusFilter ===
                "All" ||
              game.status ===
                statusFilter;

            return (
              matchesSearch &&
              matchesStatus
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

          return gameA.title.localeCompare(
            gameB.title,
          );
        },
      );
    }, [
      games,
      search,
      statusFilter,
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
              placeholder="Search by title, platform, publisher or genre"
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Status

            <select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                setStatusFilter(
                  event
                    .target
                    .value as StatusFilter,
                )
              }
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none"
            >
              <option value="All">
                All
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
            </select>
          </label>
        </div>
      </div>

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

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-700">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          Loading Your Games...
        </div>
      ) : visibleGames.length >
        0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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