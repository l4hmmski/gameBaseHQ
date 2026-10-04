import type {
  Game,
} from "@/types/game";

type LibraryStatsProps = {
  games: Game[];
};

export function LibraryStats({
  games,
}: LibraryStatsProps) {
  const totalGames =
    games.length;

  const playing =
    games.filter(
      (game) =>
        game.status ===
        "Playing",
    ).length;

  const completed =
    games.filter(
      (game) =>
        game.status ===
        "Completed",
    ).length;

  const backlog =
    games.filter(
      (game) =>
        game.status ===
        "Backlog",
    ).length;

  const wishlist =
    games.filter(
      (game) =>
        game.is_wishlist,
    ).length;

  const ratedGames =
    games.filter(
      (
        game,
      ): game is Game & {
        user_rating: number;
      } =>
        game.user_rating !==
        null,
    );

  const averageRating =
    ratedGames.length >
    0
      ? ratedGames.reduce(
          (
            total,
            game,
          ) =>
            total +
            game.user_rating,
          0,
        ) /
        ratedGames.length
      : null;

  const stats = [
    {
      label:
        "Total Games",

      value:
        totalGames,
    },

    {
      label:
        "Playing",

      value:
        playing,
    },

    {
      label:
        "Completed",

      value:
        completed,
    },

    {
      label:
        "Backlog",

      value:
        backlog,
    },

    {
      label:
        "Wishlist",

      value:
        wishlist,
    },

    {
      label:
        "Average Rating",

      value:
        averageRating !==
        null
          ? `${averageRating.toFixed(
              1,
            )}/5`
          : "—",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          Library Overview
        </p>

        <h2 className="mt-1 text-2xl font-black text-slate-950">
          Your Stats
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map(
          (stat) => (
            <div
              key={
                stat.label
              }
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                {
                  stat.label
                }
              </p>

              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {
                  stat.value
                }
              </p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}