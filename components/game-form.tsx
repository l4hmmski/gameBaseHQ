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
  onAddGame: (game: NewGame) => void;
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

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    onAddGame({
      title: cleanTitle,
      platform,
      status,
    });

    setTitle("");
    setPlatform("PlayStation 5");
    setStatus("Backlog");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        mb-10 grid gap-5 rounded-xl
        border border-gray-200
        bg-white p-6 shadow-sm
        md:grid-cols-2 text-gray-400
      "
    >
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-black">
          Add a game
        </h2>

        <p className="mt-1 text-black">
          Add a game to your temporary
          collection.
        </p>
      </div>

      <label className="space-y-2">
        <span className="block font-semibold text-black ">
          Game title
        </span>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="The Last of Us"
          className="
            w-full rounded-lg border
            border-gray-300 px-4 py-3
            outline-none
            focus:border-blue-500
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
            setPlatform(
              event.target.value,
            )
          }
          className="
            w-full rounded-lg border
            border-gray-300 px-4 py-3
            outline-none
            focus:border-blue-500
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
              event.target
                .value as GameStatus,
            )
          }
          className="
            w-full rounded-lg border
            border-gray-300 px-4 py-3
            outline-none
            focus:border-blue-500
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
          className="
            w-full rounded-lg bg-blue-600
            px-5 py-3 font-semibold
            text-white hover:bg-blue-700
          "
        >
          Add game
        </button>
      </div>
    </form>
  );
}