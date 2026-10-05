"use client";

import Image from "next/image";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  supabase,
} from "@/lib/supabase";

import type {
  Game,
} from "@/types/game";

const GAME_SELECT = `
  id,
  igdb_id,
  steam_app_id,
  title,
  platform,
  status,
  cover_url,
  publisher,
  release_date,
  genres,
  rating,
  user_rating,
  notes,
  is_wishlist,
  steam_playtime_minutes,
  steam_playtime_2weeks,
  steam_last_played_at,
  steam_synced_at
`;

function hours(
  minutes:
    | number
    | null
    | undefined,
) {
  return (
    (minutes ?? 0) /
    60
  );
}

export function StatsDashboard() {
  const [
    games,
    setGames,
  ] =
    useState<Game[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function loadGames() {
      const {
        data,
        error:
          loadError,
      } =
        await supabase
          .from(
            "games",
          )
          .select(
            GAME_SELECT,
          );

      if (
        loadError
      ) {
        console.error(
          loadError,
        );

        setError(
          "Your statistics could not be loaded.",
        );

        setIsLoading(
          false,
        );

        return;
      }

      setGames(
        (data ??
          []) as Game[],
      );

      setIsLoading(
        false,
      );
    }

    void loadGames();
  }, []);

  const stats =
    useMemo(() => {
      const total =
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
            user_rating:
              number;
          } =>
            game.user_rating !==
            null,
        );

      const averageRating =
        ratedGames.length >
        0
          ? ratedGames.reduce(
              (
                totalRating,
                game,
              ) =>
                totalRating +
                game.user_rating,
              0,
            ) /
            ratedGames.length
          : null;

      const steamMinutes =
        games.reduce(
          (
            totalMinutes,
            game,
          ) =>
            totalMinutes +
            (game.steam_playtime_minutes ??
              0),
          0,
        );

      const steamHours =
        Math.round(
          steamMinutes /
            60,
        );

      return {
        total,
        playing,
        completed,
        backlog,
        wishlist,
        averageRating,
        steamHours,
      };
    }, [games]);

  const platformStats =
    useMemo(() => {
      const counts =
        new Map<
          string,
          number
        >();

      for (
        const game
        of games
      ) {
        counts.set(
          game.platform,
          (counts.get(
            game.platform,
          ) ??
            0) +
            1,
        );
      }

      return Array.from(
        counts.entries(),
      )
        .map(
          ([
            platform,
            count,
          ]) => ({
            platform,
            count,
          }),
        )
        .sort(
          (
            a,
            b,
          ) =>
            b.count -
            a.count,
        );
    }, [games]);

  const topRatedGames =
    useMemo(
      () =>
        games
          .filter(
            (
              game,
            ): game is Game & {
              user_rating:
                number;
            } =>
              game.user_rating !==
              null,
          )
          .sort(
            (
              a,
              b,
            ) =>
              b.user_rating -
              a.user_rating,
          )
          .slice(
            0,
            5,
          ),
      [games],
    );

  const mostPlayedGames =
    useMemo(
      () =>
        games
          .filter(
            (game) =>
              (game.steam_playtime_minutes ??
                0) >
              0,
          )
          .sort(
            (
              a,
              b,
            ) =>
              (b.steam_playtime_minutes ??
                0) -
              (a.steam_playtime_minutes ??
                0),
          )
          .slice(
            0,
            5,
          ),
      [games],
    );

  const recentlyPlayed =
    useMemo(
      () =>
        games
          .filter(
            (
              game,
            ): game is Game & {
              steam_last_played_at:
                string;
            } =>
              Boolean(
                game.steam_last_played_at,
              ),
          )
          .sort(
            (
              a,
              b,
            ) =>
              new Date(
                b.steam_last_played_at,
              ).getTime() -
              new Date(
                a.steam_last_played_at,
              ).getTime(),
          )
          .slice(
            0,
            5,
          ),
      [games],
    );

  const maxPlatformCount =
    platformStats[0]
      ?.count ??
    1;

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="font-semibold text-slate-600">
          Loading Your Stats...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700">
        {
          error
        }
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* MAIN STATS */}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">
        <StatCard
          label="Total Games"
          value={
            stats.total
          }
        />

        <StatCard
          label="Playing"
          value={
            stats.playing
          }
        />

        <StatCard
          label="Completed"
          value={
            stats.completed
          }
        />

        <StatCard
          label="Backlog"
          value={
            stats.backlog
          }
        />

        <StatCard
          label="Wishlist"
          value={
            stats.wishlist
          }
        />

        <StatCard
          label="Avg Rating"
          value={
            stats.averageRating !==
            null
              ? `${stats.averageRating.toFixed(
                  1,
                )}/5`
              : "—"
          }
        />

        <StatCard
          label="Steam Hours"
          value={
            stats.steamHours >
            0
              ? stats.steamHours.toLocaleString(
                  "en-AU",
                )
              : "—"
          }
        />
      </section>

      {/* STATUS + PLATFORM */}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
            Progress
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Library Status
          </h2>

          <div className="mt-6 space-y-5">
            <ProgressRow
              label="Completed"
              value={
                stats.completed
              }
              total={
                stats.total
              }
            />

            <ProgressRow
              label="Playing"
              value={
                stats.playing
              }
              total={
                stats.total
              }
            />

            <ProgressRow
              label="Backlog"
              value={
                stats.backlog
              }
              total={
                stats.total
              }
            />

            <ProgressRow
              label="Wishlist"
              value={
                stats.wishlist
              }
              total={
                stats.total
              }
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
            Collection
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Games by Platform
          </h2>

          <div className="mt-6 space-y-4">
            {platformStats.length >
            0 ? (
              platformStats.map(
                (
                  item,
                ) => {
                  const width =
                    (
                      item.count /
                      maxPlatformCount
                    ) *
                    100;

                  return (
                    <div
                      key={
                        item.platform
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-700">
                          {
                            item.platform
                          }
                        </p>

                        <p className="text-sm font-black text-slate-950">
                          {
                            item.count
                          }
                        </p>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{
                            width:
                              `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )
            ) : (
              <p className="text-sm text-slate-500">
                No platform data yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* STEAM */}

      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-300">
              Steam Activity
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Your Steam Overview
            </h2>
          </div>

          <p className="text-4xl font-black">
            {
              stats.steamHours
            }

            <span className="ml-2 text-base font-semibold text-slate-400">
              hours played
            </span>
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SteamSummary
            title="Most Played"
            game={
              mostPlayedGames[0] ??
              null
            }
          />

          <SteamSummary
            title="Recently Played"
            game={
              recentlyPlayed[0] ??
              null
            }
          />

          <SteamSummary
            title="Games With Steam Data"
            value={
              games.filter(
                (game) =>
                  Boolean(
                    game.steam_app_id,
                  ),
              ).length.toString()
            }
          />
        </div>
      </section>

      {/* TOP GAMES */}

      <section className="grid gap-6 lg:grid-cols-2">
        <GameRanking
          title="Your Highest Rated"
          subtitle="Based on your personal ratings."
          games={
            topRatedGames
          }
          mode="rating"
        />

        <GameRanking
          title="Most Played"
          subtitle="Based on total Steam playtime."
          games={
            mostPlayedGames
          }
          mode="playtime"
        />
      </section>

      {/* RECENT */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
          Recent Activity
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Recently Played
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {recentlyPlayed.length >
          0 ? (
            recentlyPlayed.map(
              (
                game,
              ) => (
                <div
                  key={
                    game.id
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200"
                >
                  <div className="relative aspect-[3/4] bg-slate-100">
                    {game.cover_url ? (
                      <Image
                        src={
                          game.cover_url
                        }
                        alt={`${game.title} cover`}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-3 text-center text-sm font-bold text-slate-500">
                        {
                          game.title
                        }
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-black text-slate-950">
                      {
                        game.title
                      }
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {new Intl.DateTimeFormat(
                        "en-AU",
                        {
                          day:
                            "numeric",
                          month:
                            "short",
                          year:
                            "numeric",
                        },
                      ).format(
                        new Date(
                          game.steam_last_played_at,
                        ),
                      )}
                    </p>
                  </div>
                </div>
              ),
            )
          ) : (
            <p className="text-sm text-slate-500">
              No recent Steam activity available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label:
    string;

  value:
    string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
        {
          value
        }
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
}: {
  label:
    string;

  value:
    number;

  total:
    number;
}) {
  const percentage =
    total > 0
      ? Math.round(
          (
            value /
            total
          ) *
            100,
        )
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-700">
          {
            label
          }
        </p>

        <p className="text-sm font-black text-slate-950">
          {value}{" "}
          <span className="font-medium text-slate-400">
            ({percentage}%)
          </span>
        </p>
      </div>

      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600"
          style={{
            width:
              `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function SteamSummary({
  title,
  game,
  value,
}: {
  title:
    string;

  game?:
    Game | null;

  value?:
    string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {
          title
        }
      </p>

      {game ? (
        <>
          <p className="mt-3 line-clamp-1 text-lg font-black text-white">
            {
              game.title
            }
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {hours(
              game.steam_playtime_minutes,
            ).toFixed(
              1,
            )}
            h total
          </p>
        </>
      ) : (
        <p className="mt-3 text-2xl font-black text-white">
          {value ??
            "—"}
        </p>
      )}
    </div>
  );
}

function GameRanking({
  title,
  subtitle,
  games,
  mode,
}: {
  title:
    string;

  subtitle:
    string;

  games:
    Game[];

  mode:
    "rating" |
    "playtime";
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
        Rankings
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {
          title
        }
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {
          subtitle
        }
      </p>

      <div className="mt-6 space-y-3">
        {games.length >
        0 ? (
          games.map(
            (
              game,
              index,
            ) => (
              <div
                key={
                  game.id
                }
                className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                  {
                    index +
                    1
                  }
                </div>

                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {game.cover_url && (
                    <Image
                      src={
                        game.cover_url
                      }
                      alt={`${game.title} cover`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-slate-950">
                    {
                      game.title
                    }
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {
                      game.platform
                    }
                  </p>
                </div>

                <p className="shrink-0 font-black text-slate-950">
                  {mode ===
                  "rating"
                    ? `${game.user_rating ?? 0}/5`
                    : `${hours(
                        game.steam_playtime_minutes,
                      ).toFixed(
                        1,
                      )}h`}
                </p>
              </div>
            ),
          )
        ) : (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Not enough data yet.
          </p>
        )}
      </div>
    </section>
  );
}