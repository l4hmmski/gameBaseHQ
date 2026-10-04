"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  track,
} from "@vercel/analytics";

import { supabase } from "@/lib/supabase";

export function PublicProfileSettings() {
  const [
    username,
    setUsername,
  ] =
    useState<
      string | null
    >(null);

  const [
    isPublic,
    setIsPublic,
  ] =
    useState(false);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isSaving,
    setIsSaving,
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
    async function loadSettings() {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

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
            "username, is_public",
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
          profileError,
        );

        setError(
          "Public profile settings could not be loaded.",
        );

        setIsLoading(
          false,
        );

        return;
      }

      setUsername(
        data.username,
      );

      setIsPublic(
        data.is_public ??
          false,
      );

      setIsLoading(
        false,
      );
    }

    void loadSettings();
  }, []);

  async function handleVisibilityChange(
    newValue:
      boolean,
  ) {
    setError("");
    setMessage("");

    if (
      newValue &&
      !username
    ) {
      setError(
        "Create a username above before making your profile public.",
      );

      return;
    }

    setIsSaving(
      true,
    );

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "You must be logged in.",
      );

      setIsSaving(
        false,
      );

      return;
    }

    const {
      error:
        updateError,
    } =
      await supabase
        .from(
          "profiles",
        )
        .update({
          is_public:
            newValue,
        })
        .eq(
          "id",
          user.id,
        );

    setIsSaving(
      false,
    );

    if (
      updateError
    ) {
      console.error(
        updateError,
      );

      setError(
        "Your profile visibility could not be updated.",
      );

      return;
    }

    setIsPublic(
      newValue,
    );

    setMessage(
      newValue
        ? "Your library is now public."
        : "Your library is now private.",
    );

    if (
      newValue
    ) {
      track(
        "Public Profile Enabled",
      );
    }
  }

  async function copyProfileLink() {
    if (
      !username
    ) {
      return;
    }

    const url =
      `${window.location.origin}/u/${username}`;

    try {
      await navigator.clipboard.writeText(
        url,
      );

      setMessage(
        "Public profile link copied.",
      );
    } catch {
      setError(
        "Could not copy the link.",
      );
    }
  }

  if (isLoading) {
    return (
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-semibold text-slate-600">
          Loading Sharing Settings...
        </p>
      </section>
    );
  }

  const profilePath =
    username
      ? `/u/${username}`
      : null;

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
        Sharing
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        Public Library
      </h2>

      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Allow other people to view
        your profile, library,
        ratings and wishlist through
        a shareable link.
      </p>

      <div className="mt-6 flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="font-bold text-slate-900">
            Public Profile
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {isPublic
              ? "Anyone with your profile link can view your library."
              : "Only you can access your library."}
          </p>
        </div>

        <button
          type="button"
          disabled={
            isSaving
          }
          onClick={() =>
            void handleVisibilityChange(
              !isPublic,
            )
          }
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            isPublic
              ? "bg-indigo-600"
              : "bg-slate-300"
          }`}
          aria-label="Toggle Public Profile"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
              isPublic
                ? "left-6"
                : "left-1"
            }`}
          />
        </button>
      </div>

      {isPublic &&
        profilePath && (
        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-500">
            Your Public Link
          </p>

          <p className="mt-2 break-all font-semibold text-indigo-950">
            {
              profilePath
            }
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={
                profilePath
              }
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              View Public Profile
            </a>

            <button
              type="button"
              onClick={() =>
                void copyProfileLink()
              }
              className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      {!username && (
        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Add a username to your
          profile before enabling
          public sharing.
        </p>
      )}

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {
            error
          }
        </p>
      )}

      {message && (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {
            message
          }
        </p>
      )}
    </section>
  );
}