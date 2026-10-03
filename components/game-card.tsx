import { Game } from "@/types/game";

type GameCardProps = {
  game: Game;
  onDelete: (id: string) => void;
};

export function GameCard({
  game,
  onDelete,
}: GameCardProps) {
  return (
    <article
      className="
        flex flex-col rounded-xl
        border border-gray-300
        bg-white p-6 text-gray-950
        shadow-sm transition
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <div className="flex-1">
        <h2 className="text-xl font-bold text-black">
          {game.title}
        </h2>

        <div className="mt-4 space-y-2">
          <p className="text-gray-800">
            <span className="font-semibold text-black">
              Platform:
            </span>{" "}
            {game.platform}
          </p>

          <p className="text-gray-800">
            <span className="font-semibold text-black">
              Status:
            </span>{" "}
            {game.status}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(game.id)}
        className="
          mt-6 rounded-lg border
          border-red-300 px-4 py-2
          font-semibold text-red-700
          hover:bg-red-50
        "
      >
        Delete
      </button>
    </article>
  );
}