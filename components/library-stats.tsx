import type {
  Game,
} from "@/types/game";

type Props = {
  games: Game[];
};

export function LibraryStats({
  games,
}: Props) {
  const completed =
    games.filter(
      (game) =>
        game.status ===
        "Completed",
    ).length;

  const playing =
    games.filter(
      (game) =>
        game.status ===
        "Playing",
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

  const rated =
    games.filter(
      (
        game,
      ): game is Game & {
        user_rating:
          number;
      } =>
        game.user_rating !==
        null,
    );

  const average =
    rated.length >
    0
      ? rated.reduce(
          (
            total,
            game,
          ) =>
            total +
            game.user_rating,
          0,
        ) /
        rated.length
      : null;

  const steamMinutes =
    games.reduce(
      (
        total,
        game,
      ) =>
        total +
        (game.steam_playtime_minutes ??
          0),
      0,
    );

  const steamHours =
    Math.round(
      steamMinutes /
        60,
    );

  const stats = [
    {
      label:
        "Total Games",

      value:
        games.length,
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
        "Avg Rating",

      value:
        average !==
        null
          ? `${average.toFixed(
              1,
            )}/5`
          : "—",
    },

    {
      label:
        "Steam Hours",

      value:
        steamHours >
        0
          ? steamHours.toLocaleString(
              "en-AU",
            )
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {stats.map(
          (stat) => (
            <div
              key={
                stat.label
              }
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {
                  stat.label
                }
              </p>

              <p className="mt-2 text-2xl font-black text-slate-950">
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