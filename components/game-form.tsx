"use client";

import {
  FormEvent,
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

export function GameForm({
  onAddGame,
}: GameFormProps) {
  const [title, setTitle] =
    useState("");

  const [platform, setPlatform] =
    useState("");

  const [status, setStatus] =
    useState<GameStatus>("Backlog");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanPlatform =
      platform.trim();

    if (
      !cleanTitle ||
      !cleanPlatform
    ) {
      setError(
        "Enter a game title and platform.",
      );

      return;
    }

    setIsSubmitting(true);
    setError("");

    let coverUrl: string | null =
      null;

    try {
      const response = await fetch(
        `/api/game-cover?title=${encodeURIComponent(
          cleanTitle,
        )}`,
      );

      if (response.ok) {
        const data =
          (await response.json()) as {
            coverUrl: string | null;
          };

        coverUrl = data.coverUrl;
      }

      await onAddGame({
        title: cleanTitle,
        platform: cleanPlatform,
        status,
        cover_url: coverUrl,
      });

      setTitle("");
      setPlatform("");
      setStatus("Backlog");
    } catch (submitError) {
      console.error(
        submitError,
      );

      setError(
        "The game could not be added.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          New game
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Add to your library
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter the game details.
          We&apos;ll automatically look
          for its cover.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Game title

          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(
                event.target.value,
              );
            }}
            placeholder="The Witcher 3"
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Platform

          <input
            type="text"
            value={platform}
            onChange={(event) => {
              setPlatform(
                event.target.value,
              );
            }}
            placeholder="PlayStation 5"
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Status

          <select
            value={status}
            onChange={(event) => {
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

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting
          ? "Finding cover..."
          : "Add game"}
      </button>
    </form>
  );
}