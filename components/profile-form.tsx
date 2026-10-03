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

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

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

    loadProfile();
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

  if (isLoading) {
    return (
      <section
        className="
          rounded-xl border
          border-gray-300 bg-white
          p-12 text-center
          text-gray-950
        "
      >
        <p className="font-medium">
          Loading your profile...
        </p>
      </section>
    );
  }

  return (
    <div
      className="
        grid gap-8
        md:grid-cols-[1fr_2fr]
      "
    >
      <aside className="space-y-5">
        <section
          className="
            rounded-xl border
            border-gray-300 bg-white
            p-6 text-gray-950
            shadow-sm
          "
        >
          <p className="text-sm font-semibold text-gray-700">
            Email
          </p>

          <p className="mt-1 break-all font-medium text-black">
            {email}
          </p>
        </section>

        <section
          className="
            rounded-xl border
            border-gray-300 bg-white
            p-6 text-gray-950
            shadow-sm
          "
        >
          <p className="text-sm font-semibold text-gray-700">
            Games collected
          </p>

          <p className="mt-1 text-3xl font-bold text-black">
            {gameCount}
          </p>
        </section>

        <section
          className="
            rounded-xl border
            border-gray-300 bg-white
            p-6 text-gray-950
            shadow-sm
          "
        >
          <p className="text-sm font-semibold text-gray-700">
            Member since
          </p>

          <p className="mt-1 font-medium text-black">
            {joinedDate}
          </p>
        </section>
      </aside>

      <form
        onSubmit={handleSubmit}
        className="
          rounded-xl border
          border-gray-300 bg-white
          p-6 text-gray-950
          shadow-sm
        "
      >
        <h2 className="text-2xl font-bold text-black">
          Profile information
        </h2>

        <p className="mt-1 text-gray-800">
          Update your public account
          information.
        </p>

        <label className="mt-6 block space-y-2">
          <span className="font-semibold text-black">
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
            placeholder="liamjaryn"
            className="
              w-full rounded-lg border
              border-gray-400 bg-white
              px-4 py-3 text-black
              placeholder:text-gray-500
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </label>

        <label className="mt-5 block space-y-2">
          <span className="font-semibold text-black">
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
            placeholder="Liam"
            className="
              w-full rounded-lg border
              border-gray-400 bg-white
              px-4 py-3 text-black
              placeholder:text-gray-500
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </label>

        <label className="mt-5 block space-y-2">
          <span className="font-semibold text-black">
            Favourite platform
          </span>

          <select
            value={favouritePlatform}
            onChange={(event) =>
              setFavouritePlatform(
                event.target.value,
              )
            }
            className="
              w-full rounded-lg border
              border-gray-400 bg-white
              px-4 py-3 text-black
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
            "
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

        <label className="mt-5 block space-y-2">
          <span className="font-semibold text-black">
            Bio
          </span>

          <textarea
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
            rows={5}
            maxLength={300}
            placeholder="Tell us about your game collection..."
            className="
              w-full resize-y rounded-lg
              border border-gray-400
              bg-white px-4 py-3
              text-black
              placeholder:text-gray-500
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
            "
          />

          <p className="text-sm font-medium text-gray-700">
            {bio.length}/300 characters
          </p>
        </label>

        {errorMessage && (
          <div
            className="
              mt-5 rounded-lg border
              border-red-300 bg-red-50
              p-3 text-red-900
            "
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            className="
              mt-5 rounded-lg border
              border-green-300
              bg-green-50 p-3
              text-green-900
            "
          >
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="
            mt-6 rounded-lg
            bg-blue-700 px-5 py-3
            font-semibold text-white
            hover:bg-blue-800
            disabled:cursor-not-allowed
            disabled:bg-blue-300
          "
        >
          {isSaving
            ? "Saving..."
            : "Save profile"}
        </button>
      </form>
    </div>
  );
}