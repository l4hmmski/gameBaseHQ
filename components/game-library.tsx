"use client";

import {
  useEffect,
  useState,
} from "react";

import { GameCard } from "@/components/game-card";
import { GameForm } from "@/components/game-form";
import { supabase } from "@/lib/supabase";
import { Game } from "@/types/game";

type NewGame = Omit<Game, "id">;

export function GameLibrary() {
  const [games, setGames] =
    useState<Game[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    platformFilter,
    setPlatformFilter,
  ] = useState("All");

  const [sortOrder, setSortOrder] =
    useState("title-ascending");

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function loadGames() {
      setIsLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage(
          "You must be logged in to view games.",
        );

        setIsLoading(false);
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("games")
        .select(`
          id,
          title,
          platform,
          status
        `)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setGames((data ?? []) as Game[]);
      setIsLoading(false);
    }

    loadGames();
  }, []);

  async function addGame(
    newGame: NewGame,
  ) {
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage(
        "You must be logged in to add games.",
      );

      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from("games")
      .insert({
        title: newGame.title,
        platform: newGame.platform,
        status: newGame.status,
        user_id: user.id,
      })
      .select(`
        id,
        title,
        platform,
        status
      `)
      .single();

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setGames((currentGames) => [
      data as Game,
      ...currentGames,
    ]);
  }

  async function deleteGame(
    gameId: string,
  ) {
    setErrorMessage("");

    const { error } =
      await supabase
        .from("games")
        .delete()
        .eq("id", gameId);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setGames((currentGames) =>
      currentGames.filter(
        (game) => game.id !== gameId,
      ),
    );
  }

  const visibleGames = [...games]
    .filter((game) =>
      game.title
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .filter(
      (game) =>
        platformFilter === "All" ||
        game.platform === platformFilter,
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

      if (sortOrder === "platform") {
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
      <GameForm onAddGame={addGame} />

      {errorMessage && (
        <div
          className="
            mb-6 rounded-lg border
            border-red-300 bg-red-50
            p-4 text-red-900
          "
        >
          <p className="font-bold">
            Something went wrong
          </p>

          <p className="mt-1 text-sm">
            {errorMessage}
          </p>
        </div>
      )}

      <section
        className="
          mb-8 grid gap-4
          rounded-xl border
          border-gray-300 bg-white
          p-5 text-gray-950
          shadow-sm md:grid-cols-3
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
              setSearch(event.target.value)
            }
            placeholder="Search games..."
            className="
              w-full rounded-lg border
              border-gray-400 bg-white
              px-4 py-2 text-black
              placeholder:text-gray-500
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
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
              border-gray-400 bg-white
              px-4 py-2 text-black
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
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
              border-gray-400 bg-white
              px-4 py-2 text-black
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
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

      {isLoading ? (
        <section
          className="
            rounded-xl border
            border-gray-300 bg-white
            p-12 text-center
            text-gray-950
          "
        >
          <p className="font-medium text-gray-800">
            Loading your games...
          </p>
        </section>
      ) : (
        <>
          <p className="mb-5 font-medium text-gray-800">
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
                    onDelete={deleteGame}
                  />
                ),
              )}
            </section>
          ) : (
            <section
              className="
                rounded-xl border
                border-dashed
                border-gray-400
                bg-white p-12
                text-center text-gray-950
              "
            >
              <h2 className="text-xl font-bold text-black">
                Your library is empty
              </h2>

              <p className="mt-2 text-gray-800">
                Add your first game using
                the form above.
              </p>
            </section>
          )}
        </>
      )}
    </>
  );
}