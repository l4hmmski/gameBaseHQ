import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import {
  PublicGameCard,
} from "@/components/public-game-card";

import type {
  PublicGame,
} from "@/components/public-game-card";

import {
  createSupabasePublicClient,
} from "@/lib/supabase-public";

type PublicProfilePageProps = {
  params:
    Promise<{
      username:
        string;
    }>;
};

type PublicProfile = {
  username: string;

  display_name:
    | string
    | null;

  favourite_platform:
    | string
    | null;

  bio:
    | string
    | null;

  created_at:
    string;
};

export const dynamic =
  "force-dynamic";

async function getProfile(
  username:
    string,
) {
  const supabase =
    createSupabasePublicClient();

  const {
    data:
      profile,
    error:
      profileError,
  } =
    await supabase
      .from(
        "profiles",
      )
      .select(
        "username, display_name, favourite_platform, bio, created_at",
      )
      .ilike(
        "username",
        username,
      )
      .eq(
        "is_public",
        true,
      )
      .maybeSingle();

  if (
    profileError ||
    !profile
  ) {
    return null;
  }

  const {
    data:
      games,

    error:
      gamesError,
  } =
    await supabase.rpc(
      "get_public_library",
      {
        p_username:
          username,
      },
    );

  if (
    gamesError
  ) {
    console.error(
      "Public library could not be loaded:",
      gamesError,
    );

    return null;
  }

  return {
    profile:
      profile as PublicProfile,

    games:
      (games ??
        []) as PublicGame[],
  };
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const {
    username,
  } =
    await params;

  return {
    title:
      `${username}'s Library`,

    description:
      `View ${username}'s public video game library.`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const {
    username,
  } =
    await params;

  const result =
    await getProfile(
      username,
    );

  if (!result) {
    notFound();
  }

  const {
    profile,
    games,
  } = result;

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

  const ratedGames =
    games.filter(
      (
        game,
      ): game is PublicGame & {
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
            total,
            game,
          ) =>
            total +
            game.user_rating,
          0,
        ) /
        ratedGames.length
      : null;

  const initials =
    (
      profile.display_name ??
      profile.username
    )
      .charAt(0)
      .toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-3xl font-black text-white">
              {
                initials
              }
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                Public Library
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                {profile.display_name ??
                  profile.username}
              </h1>

              <p className="mt-1 font-semibold text-slate-500">
                @
                {
                  profile.username
                }
              </p>

              {profile.bio && (
                <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                  {
                    profile.bio
                  }
                </p>
              )}

              {profile.favourite_platform && (
                <p className="mt-3 text-sm font-semibold text-indigo-600">
                  Favourite Platform:{" "}
                  {
                    profile.favourite_platform
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <PublicStat
            label="Games"
            value={
              games.length
            }
          />

          <PublicStat
            label="Playing"
            value={
              playing
            }
          />

          <PublicStat
            label="Completed"
            value={
              completed
            }
          />

          <PublicStat
            label="Backlog"
            value={
              backlog
            }
          />

          <PublicStat
            label="Wishlist"
            value={
              wishlist
            }
          />

          <PublicStat
            label="Avg Rating"
            value={
              averageRating !==
              null
                ? `${averageRating.toFixed(
                    1,
                  )}/5`
                : "—"
            }
          />
        </section>

        <section className="mt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Collection
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {
                games.length
              }{" "}
              {games.length ===
              1
                ? "Game"
                : "Games"}
            </h2>
          </div>

          {games.length >
          0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {games.map(
                (game) => (
                  <PublicGameCard
                    key={
                      game.id
                    }
                    game={
                      game
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="text-xl font-black text-slate-950">
                No Games Yet
              </h3>

              <p className="mt-2 text-slate-600">
                This library is currently empty.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function PublicStat({
  label,
  value,
}: {
  label:
    string;

  value:
    string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {
          value
        }
      </p>
    </div>
  );
}