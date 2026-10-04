"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Game,
  GameStatus,
} from "@/types/game";

type NewGame = Omit<Game, "id">;

type GameFormProps = {
  onAddGame: (
    game: NewGame,
  ) => Promise<void>;
};

type GameSuggestion = {
  id: number;
  title: string;
  coverUrl: string | null;
  year: number | null;
};

type GameSearchResponse = {
  games: GameSuggestion[];
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

export function GameForm({
  onAddGame,
}: GameFormProps) {
  const [title, setTitle] =
    useState("");

  const [platform, setPlatform] =
    useState("");

  const [status, setStatus] =
    useState<GameStatus>("Backlog");

  const [
    selectedCoverUrl,
    setSelectedCoverUrl,
  ] = useState<string | null>(null);

  const [
    suggestions,
    setSuggestions,
  ] =
    useState<GameSuggestion[]>([]);

  const [
    isSearching,
    setIsSearching,
  ] = useState(false);

  const [
    showSuggestions,
    setShowSuggestions,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const searchContainerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  useEffect(() => {
    const cleanTitle =
      title.trim();

    if (cleanTitle.length < 2) {
      return;
    }

    const controller =
      new AbortController();

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setIsSearching(true);

            const response =
              await fetch(
                `/api/game-search?q=${encodeURIComponent(
                  cleanTitle,
                )}`,
                {
                  signal:
                    controller.signal,
                },
              );

            if (!response.ok) {
              setSuggestions([]);
              return;
            }

            const data =
              (await response.json()) as GameSearchResponse;

            setSuggestions(
              data.games ?? [],
            );

            setShowSuggestions(
              true,
            );
          } catch (searchError) {
            if (
              searchError instanceof
                Error &&
              searchError.name ===
                "AbortError"
            ) {
              return;
            }

            console.error(
              "Game search failed:",
              searchError,
            );

            setSuggestions([]);
          } finally {
            setIsSearching(false);
          }
        },
        350,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );

      controller.abort();
    };
  }, [title]);

  function handleTitleChange(
    value: string,
  ) {
    setTitle(value);

    setSelectedCoverUrl(
      null,
    );

    setError("");

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);

      return;
    }

    setShowSuggestions(true);
  }

  function handleSuggestionClick(
    game: GameSuggestion,
  ) {
    setTitle(game.title);

    setSelectedCoverUrl(
      game.coverUrl,
    );

    setSuggestions([]);

    setShowSuggestions(false);

    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle =
      title.trim();

    if (!cleanTitle) {
      setError(
        "Enter or select a game title.",
      );

      return;
    }

    if (!platform) {
      setError(
        "Select a platform.",
      );

      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let coverUrl =
        selectedCoverUrl;

      if (!coverUrl) {
        const response =
          await fetch(
            `/api/game-search?q=${encodeURIComponent(
              cleanTitle,
            )}`,
          );

        if (response.ok) {
          const data =
            (await response.json()) as GameSearchResponse;

          const firstGame =
            data.games?.[0];

          if (firstGame) {
            coverUrl =
              firstGame.coverUrl;
          }
        }
      }

      await onAddGame({
        title: cleanTitle,
        platform,
        status,
        cover_url: coverUrl,
      });

      setTitle("");
      setPlatform("");
      setStatus("Backlog");

      setSelectedCoverUrl(
        null,
      );

      setSuggestions([]);

      setShowSuggestions(
        false,
      );
    } catch (submitError) {
      console.error(
        submitError,
      );

      setError(
        "The game could not be added.",
      );
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          New Game
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Add to Your Library
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start typing a game
          title and select the
          correct game from IGDB.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div
          ref={
            searchContainerRef
          }
          className="relative"
        >
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Game Title

            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(
                  event,
                ) => {
                  handleTitleChange(
                    event.target
                      .value,
                  );
                }}
                onFocus={() => {
                  if (
                    suggestions.length >
                    0
                  ) {
                    setShowSuggestions(
                      true,
                    );
                  }
                }}
                placeholder="Start Typing..."
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-10 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              {isSearching && (
                <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              )}
            </div>
          </label>

          {showSuggestions &&
            title.trim()
              .length >= 2 && (
              <div className="absolute left-0 right-0 top-[76px] z-50 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                {isSearching &&
                  suggestions.length ===
                    0 && (
                    <p className="px-4 py-4 text-sm text-slate-500">
                      Searching
                      IGDB...
                    </p>
                  )}

                {!isSearching &&
                  suggestions.length ===
                    0 && (
                    <p className="px-4 py-4 text-sm text-slate-500">
                      No matching
                      games found.
                    </p>
                  )}

                {suggestions.map(
                  (game) => (
                    <button
                      key={
                        game.id
                      }
                      type="button"
                      onClick={() => {
                        handleSuggestionClick(
                          game,
                        );
                      }}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-100"
                    >
                      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {game.coverUrl ? (
                          <img
                            src={
                              game.coverUrl
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs font-bold text-slate-400">
                            N/A
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-950">
                          {
                            game.title
                          }
                        </p>

                        {game.year && (
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              game.year
                            }
                          </p>
                        )}
                      </div>
                    </button>
                  ),
                )}
              </div>
            )}
        </div>

        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Platform

          <select
            value={platform}
            onChange={(
              event,
            ) => {
              setPlatform(
                event.target
                  .value,
              );
            }}
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="">
              Select Platform
            </option>

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

        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Status

          <select
            value={status}
            onChange={(
              event,
            ) => {
              setStatus(
                event.target
                  .value as GameStatus,
              );
            }}
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
      </div>

      {selectedCoverUrl && (
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <img
            src={
              selectedCoverUrl
            }
            alt={`${title} cover`}
            className="h-20 w-14 rounded-lg object-cover shadow-sm"
          />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
              Selected Game
            </p>

            <p className="mt-1 font-bold text-slate-950">
              {title}
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={
          isSubmitting
        }
        className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting
          ? "Adding Game..."
          : "Add Game"}
      </button>
    </form>
  );
}