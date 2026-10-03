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
    useState("PlayStation 5");

  const [status, setStatus] =
    useState<GameStatus>("Backlog");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    setIsSubmitting(true);

    await onAddGame({
      title: cleanTitle,
      platform,
      status,
    });

    setTitle("");
    setPlatform("PlayStation 5");
    setStatus("Backlog");
    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        mb-10 grid gap-5 rounded-xl
        border border-gray-300
        bg-white p-6 text-gray-950
        shadow-sm md:grid-cols-2
      "
    >
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-black">
          Add a game
        </h2>

        <p className="mt-1 text-gray-800">
          Add a game to your Supabase database.
        </p>
      </div>

      <label className="space-y-2">
        <span className="block font-semibold text-black">
          Game title
        </span>

        <input
          required
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="The Last of Us"
          className="
            w-full rounded-lg border
            border-gray-400 bg-white
            px-4 py-3 text-black
            placeholder:text-gray-500
            outline-none
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </label>

      <label className="space-y-2">
        <span className="block font-semibold text-black">
          Platform
        </span>

        <select
          value={platform}
          onChange={(event) =>
            setPlatform(event.target.value)
          }
          className="
            w-full rounded-lg border
            border-gray-400 bg-white
            px-4 py-3 text-black
            outline-none
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        >
          <option>PlayStation 5</option>
          <option>Xbox Series X</option>
          <option>Nintendo Switch</option>
          <option>PC</option>
        </select>
      </label>

      <label className="space-y-2">
        <span className="block font-semibold text-black">
          Status
        </span>

        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as GameStatus,
            )
          }
          className="
            w-full rounded-lg border
            border-gray-400 bg-white
            px-4 py-3 text-black
            outline-none
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
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

      <div className="flex items-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full rounded-lg
            bg-blue-700 px-5 py-3
            font-semibold text-white
            hover:bg-blue-800
            disabled:cursor-not-allowed
            disabled:bg-blue-300
          "
        >
          {isSubmitting
            ? "Saving..."
            : "Add game"}
        </button>
      </div>
    </form>
  );
}