"use client";

import { useState } from "react";

import { GameCard } from "@/components/game-card";
import { GameForm } from "@/components/game-form";
import { Game } from "@/types/game";

const startingGames: Game[] = [
  {
    id: "1",
    title: "The Witcher 3",
    platform: "PlayStation 5",
    status: "Completed",
  },
  {
    id: "2",
    title: "Cyberpunk 2077",
    platform: "PC",
    status: "Playing",
  },
  {
    id: "3",
    title: "The Legend of Zelda",
    platform: "Nintendo Switch",
    status: "Backlog",
  },
  {
    id: "4",
    title: "Red Dead Redemption 2",
    platform: "Xbox Series X",
    status: "Completed",
  },
];

type NewGame = Omit<Game, "id">;

export function GameLibrary() {
  const [games, setGames] =
    useState<Game[]>(startingGames);

  const [search, setSearch] =
    useState("");

  const [
    platformFilter,
    setPlatformFilter,
  ] = useState("All");

  const [sortOrder, setSortOrder] =
    useState("title-ascending");

  function addGame(
    newGame: NewGame,
  ) {
    const game: Game = {
      id: crypto.randomUUID(),
      ...newGame,
    };

    setGames((currentGames) => [
      ...currentGames,
      game,
    ]);
  }

  function deleteGame(
    gameId: string,
  ) {
    setGames((currentGames) =>
      currentGames.filter(
        (game) =>
          game.id !== gameId,
      ),
    );
  }

  const visibleGames = games
    .filter((game) =>
      game.title
        .toLowerCase()
        .includes(
          search.toLowerCase(),
        ),
    )
    .filter(
      (game) =>
        platformFilter === "All" ||
        game.platform ===
          platformFilter,
    )
    .sort((firstGame, secondGame) => {
      if (
        sortOrder ===
        "title-descending"
      ) {
        return secondGame.title.localeCompare(
          firstGame.title,
        );
      }

      if (
        sortOrder ===
        "platform"
      ) {
        return firstGame.platform.localeCompare(
          secondGame.platform,
        );
      }

      return firstGame.title.localeCompare(
        secondGame.title,
      );
    });

  return (
    <>
      <GameForm
        onAddGame={addGame}
      />

      <section
        className="
          mb-8 grid gap-4 rounded-xl
          border border-gray-200
          bg-white p-5 shadow-sm
          md:grid-cols-3 text-gray-400
        "
      >
        <label className="space-y-2">
          <span className="block text-sm font-semibold text-black">
            Search
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search games..."
            className="
              w-full rounded-lg border
              border-gray-300 px-4 py-2
              outline-none
              focus:border-blue-500
            "
          />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-black">
            Platform
          </span>

          <select
            value={platformFilter}
            onChange={(event) =>
              setPlatformFilter(
                event.target.value,
              )
            }
            className="
              w-full rounded-lg border
              border-gray-300 px-4 py-2
              outline-none
              focus:border-blue-500
            "
          >
            <option value="All">
              All platforms
            </option>

            <option value="PlayStation 5">
              PlayStation 5
            </option>

            <option value="Xbox Series X">
              Xbox Series X
            </option>

            <option value="Nintendo Switch">
              Nintendo Switch
            </option>

            <option value="PC">
              PC
            </option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-black">
            Sort
          </span>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value,
              )
            }
            className="
              w-full rounded-lg border
              border-gray-300 px-4 py-2
              outline-none
              focus:border-blue-500
            "
          >
            <option value="title-ascending">
              Title: A–Z
            </option>

            <option value="title-descending">
              Title: Z–A
            </option>

            <option value="platform">
              Platform: A–Z
            </option>
          </select>
        </label>
      </section>

      <p className="mb-5 text-white">
        Showing {visibleGames.length} of{" "}
        {games.length} games
      </p>

      {visibleGames.length > 0 ? (
        <section
          className="
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {visibleGames.map(
            (game) => (
              <GameCard
                key={game.id}
                game={game}
                onDelete={
                  deleteGame
                }
              />
            ),
          )}
        </section>
      ) : (
        <section
          className="
            rounded-xl border
            border-dashed
            border-gray-300
            bg-white p-12
            text-center
          "
        >
          <h2 className="text-xl font-bold">
            No games found
          </h2>

          <p className="mt-2 text-gray-600">
            Change your filters or add
            another game.
          </p>
        </section>
      )}
    </>
  );
}