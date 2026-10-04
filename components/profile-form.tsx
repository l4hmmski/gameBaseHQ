"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";

const platforms = [
  "PlayStation 5",
  "Xbox Series X",
  "Nintendo Switch",
  "PC",
];

export function ProfileForm() {
  const [userId, setUserId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [
    displayName,
    setDisplayName,
  ] = useState("");

  const [
    favouritePlatform,
    setFavouritePlatform,
  ] = useState("");

  const [bio, setBio] =
    useState("");

  const [joinedDate, setJoinedDate] =
    useState("");

  const [gameCount, setGameCount] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage(
          "You must be logged in to view your profile.",
        );

        setIsLoading(false);
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      const {
        data,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          username,
          display_name,
          favourite_platform,
          bio,
          created_at
        `)
        .eq("id", user.id)
        .single();

      if (profileError) {
        setErrorMessage(
          profileError.message,
        );

        setIsLoading(false);
        return;
      }

      const profile =
        data as Profile;

      setUsername(
        profile.username ?? "",
      );

      setDisplayName(
        profile.display_name ?? "",
      );

      setFavouritePlatform(
        profile.favourite_platform ?? "",
      );

      setBio(profile.bio ?? "");

      setJoinedDate(
        new Intl.DateTimeFormat(
          "en-AU",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        ).format(
          new Date(
            profile.created_at,
          ),
        ),
      );

      const {
        count,
        error: countError,
      } = await supabase
        .from("games")
        .select("*", {
          count: "exact",
          head: true,
        });

      if (countError) {
        setErrorMessage(
          countError.message,
        );

        setIsLoading(false);
        return;
      }

      setGameCount(count ?? 0);
      setIsLoading(false);
    }

    void loadProfile();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanUsername =
      username
        .trim()
        .toLowerCase();

    if (
      cleanUsername &&
      cleanUsername.length < 3
    ) {
      setErrorMessage(
        "Username must contain at least 3 characters.",
      );

      return;
    }

    if (
      cleanUsername &&
      !/^[a-z0-9_-]+$/.test(
        cleanUsername,
      )
    ) {
      setErrorMessage(
        "Username can only contain letters, numbers, underscores and hyphens.",
      );

      return;
    }

    setIsSaving(true);

    const { error } =
      await supabase
        .from("profiles")
        .update({
          username:
            cleanUsername || null,

          display_name:
            displayName.trim() ||
            null,

          favourite_platform:
            favouritePlatform ||
            null,

          bio:
            bio.trim() || null,
        })
        .eq("id", userId);

    setIsSaving(false);

    if (error) {
      if (error.code === "23505") {
        setErrorMessage(
          "That username is already being used.",
        );

        return;
      }

      setErrorMessage(error.message);
      return;
    }

    setUsername(cleanUsername);

    setSuccessMessage(
      "Your profile has been updated.",
    );
  }

  const initials =
    displayName.trim().charAt(0) ||
    username.trim().charAt(0) ||
    email.trim().charAt(0) ||
    "G";

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-indigo-100" />

        <p className="mt-4 font-semibold text-slate-700">
          Loading your profile...
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-5">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600" />

          <div className="px-6 pb-6">
            <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-slate-950 text-3xl font-black uppercase text-white shadow-lg">
              {initials}
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-950">
              {displayName ||
                username ||
                "Your profile"}
            </h2>

            {username && (
              <p className="mt-1 text-sm font-semibold text-indigo-600">
                @{username}
              </p>
            )}

            <p className="mt-4 break-all text-sm text-slate-500">
              {email}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Games collected
            </p>

            <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              {gameCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              In your library
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Member since
            </p>

            <p className="mt-2 font-bold text-slate-950">
              {joinedDate}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Account created
            </p>
          </div>
        </section>

        {favouritePlatform && (
          <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
              Favourite platform
            </p>

            <p className="mt-2 text-lg font-black text-indigo-950">
              {favouritePlatform}
            </p>
          </section>
        )}
      </aside>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="border-b border-slate-100 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Account details
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Profile information
          </h2>

          <p className="mt-2 max-w-2xl leading-7 text-slate-600">
            Update the information shown
            on your account and choose
            your gaming preferences.
          </p>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-800">
              Username
            </span>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value,
                )
              }
              placeholder="Your username"
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <span className="text-xs text-slate-500">
              Letters, numbers,
              underscores and hyphens.
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-800">
              Display name
            </span>

            <input
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value,
                )
              }
              placeholder="Your name"
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <span className="text-xs text-slate-500">
              This can be your real name
              or gamer name.
            </span>
          </label>
        </div>

        <label className="mt-6 grid gap-2">
          <span className="text-sm font-bold text-slate-800">
            Favourite platform
          </span>

          <select
            value={favouritePlatform}
            onChange={(event) =>
              setFavouritePlatform(
                event.target.value,
              )
            }
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="">
              Select a platform
            </option>

            {platforms.map(
              (platform) => (
                <option
                  key={platform}
                  value={platform}
                >
                  {platform}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="mt-6 grid gap-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-slate-800">
              Bio
            </span>

            <span className="text-xs font-semibold text-slate-400">
              {bio.length}/300
            </span>
          </div>

          <textarea
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
            rows={6}
            maxLength={300}
            placeholder="Tell us about your game collection, favourite games or what you're currently playing..."
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isSaving
              ? "Saving..."
              : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}