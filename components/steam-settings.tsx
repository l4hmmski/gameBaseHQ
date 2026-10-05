"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  supabase,
} from "@/lib/supabase";

type SteamProfile = {
  steam_id:
    | string
    | null;

  steam_persona_name:
    | string
    | null;

  steam_profile_url:
    | string
    | null;

  steam_last_synced_at:
    | string
    | null;
};

export function SteamSettings() {
  const [
    steamProfile,
    setSteamProfile,
  ] =
    useState<
      SteamProfile | null
    >(null);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isSyncing,
    setIsSyncing,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    let cancelled =
      false;

    async function loadSteamProfile() {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (
        cancelled
      ) {
        return;
      }

      if (!user) {
        setIsLoading(
          false,
        );

        return;
      }

      const {
        data,
        error:
          profileError,
      } =
        await supabase
          .from(
            "profiles",
          )
          .select(
            `
              steam_id,
              steam_persona_name,
              steam_profile_url,
              steam_last_synced_at
            `,
          )
          .eq(
            "id",
            user.id,
          )
          .single();

      if (
        cancelled
      ) {
        return;
      }

      if (
        profileError
      ) {
        console.error(
          "Steam profile load failed:",
          profileError,
        );

        setError(
          "Steam account information could not be loaded.",
        );

        setIsLoading(
          false,
        );

        return;
      }

      setSteamProfile(
        data as SteamProfile,
      );

      setIsLoading(
        false,
      );
    }

    void loadSteamProfile();

    return () => {
      cancelled =
        true;
    };
  }, []);

  async function refreshSteamProfile() {
    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const {
      data,
      error:
        profileError,
    } =
      await supabase
        .from(
          "profiles",
        )
        .select(
          `
            steam_id,
            steam_persona_name,
            steam_profile_url,
            steam_last_synced_at
          `,
        )
        .eq(
          "id",
          user.id,
        )
        .single();

    if (
      profileError
    ) {
      console.error(
        "Steam profile refresh failed:",
        profileError,
      );

      return;
    }

    setSteamProfile(
      data as SteamProfile,
    );
  }

  async function syncSteam() {
    setError("");
    setMessage("");
    setIsSyncing(
      true,
    );

    try {
      const response =
        await fetch(
          "/api/steam/sync",
          {
            method:
              "POST",
          },
        );

      const data =
        (await response.json()) as {
          success?: boolean;

          total?: number;

          imported?: number;

          updated?: number;

          error?: string;
        };

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.error ??
            "Steam could not be synced.",
        );

        return;
      }

      setMessage(
        `Steam synced. ${data.total ?? 0} games found, ${data.imported ?? 0} imported and ${data.updated ?? 0} updated.`,
      );

      await refreshSteamProfile();
    } catch (
      syncError
    ) {
      console.error(
        "Steam sync request failed:",
        syncError,
      );

      setError(
        "Steam could not be synced.",
      );
    } finally {
      setIsSyncing(
        false,
      );
    }
  }

  async function disconnectSteam() {
    const confirmed =
      window.confirm(
        "Disconnect Steam? Your imported games will remain in your library.",
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/steam/disconnect",
          {
            method:
              "POST",
          },
        );

      const data =
        (await response.json()) as {
          success?: boolean;
          error?: string;
        };

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.error ??
            "Steam could not be disconnected.",
        );

        return;
      }

      setSteamProfile({
        steam_id:
          null,

        steam_persona_name:
          null,

        steam_profile_url:
          null,

        steam_last_synced_at:
          null,
      });

      setMessage(
        "Steam account disconnected.",
      );
    } catch (
      disconnectError
    ) {
      console.error(
        "Steam disconnect request failed:",
        disconnectError,
      );

      setError(
        "Steam could not be disconnected.",
      );
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-slate-600">
          Loading Steam...
        </p>
      </section>
    );
  }

  const connected =
    Boolean(
      steamProfile
        ?.steam_id,
    );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
        Connected Accounts
      </p>

      <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            Steam
          </h2>

          {connected ? (
            <>
              <p className="mt-2 font-bold text-slate-700">
                {steamProfile
                  ?.steam_persona_name ??
                  "Steam Account"}
              </p>

              {steamProfile
                ?.steam_last_synced_at && (
                <p className="mt-1 text-sm text-slate-500">
                  Last Synced{" "}
                  {new Intl.DateTimeFormat(
                    "en-AU",
                    {
                      day:
                        "numeric",

                      month:
                        "short",

                      year:
                        "numeric",

                      hour:
                        "numeric",

                      minute:
                        "2-digit",
                    },
                  ).format(
                    new Date(
                      steamProfile.steam_last_synced_at,
                    ),
                  )}
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Connect Steam to import
              your PC library and keep
              playtime information up
              to date.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!connected ? (
            <Link
              href="/api/steam/connect"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Connect Steam
            </Link>
          ) : (
            <>
              <button
                type="button"
                disabled={
                  isSyncing
                }
                onClick={() =>
                  void syncSteam()
                }
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {isSyncing
                  ? "Syncing..."
                  : "Sync Steam"}
              </button>

              {steamProfile
                ?.steam_profile_url && (
                <a
                  href={
                    steamProfile.steam_profile_url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  View Steam
                </a>
              )}

              <button
                type="button"
                onClick={() =>
                  void disconnectSteam()
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-500 hover:text-red-600"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>

      {connected && (
        <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Your Steam Game Details must
          be public for Game Library to
          read your owned games and
          playtime.
        </p>
      )}

      {message && (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {
            message
          }
        </p>
      )}

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {
            error
          }
        </p>
      )}
    </section>
  );
}