import type {
  Game,
  GameStatus,
} from "@/types/game";

type GameCardProps = {
  game: Game;
  onDelete: (id: string) => void;
};

const statusStyles: Record<
  GameStatus,
  string
> = {
  Backlog:
    "bg-amber-100 text-amber-800",
  Playing:
    "bg-blue-100 text-blue-800",
  Completed:
    "bg-emerald-100 text-emerald-800",
};

export function GameCard({
  game,
  onDelete,
}: GameCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-800">
        {game.cover_url ? (
          <img
            src={game.cover_url}
            alt={`${game.title} cover`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <span className="text-3xl font-black text-white">
              {game.title}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        <span
          className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[game.status]}`}
        >
          {game.status}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
          {game.platform}
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
          {game.title}
        </h2>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() =>
              onDelete(game.id)
            }
            className="text-sm font-bold text-red-600 transition hover:text-red-800"
          >
            Remove from library
          </button>
        </div>
      </div>
    </article>
  );
}