"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  track,
} from "@vercel/analytics";

import {
  supabase,
} from "@/lib/supabase";

export function SignupForm() {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [
    isGoogleLoading,
    setIsGoogleLoading,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState("");

  async function handleGoogleSignup() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsGoogleLoading(
      true,
    );

    /*
      We track that the Google signup
      process was started here.

      We do NOT track "Signup Completed"
      here because the user still has to
      successfully authenticate with Google.
    */

    track(
      "Google Signup Started",
    );

    const redirectTo =
      `${window.location.origin}/auth/callback`;

    const {
      error,
    } =
      await supabase.auth
        .signInWithOAuth({
          provider:
            "google",

          options: {
            redirectTo,
          },
        });

    if (error) {
      console.error(
        "Google signup failed:",
        error,
      );

      setErrorMessage(
        "Could not continue with Google. Please try again.",
      );

      setIsGoogleLoading(
        false,
      );
    }
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      password !==
      confirmPassword
    ) {
      setErrorMessage(
        "The passwords do not match.",
      );

      return;
    }

    if (
      password.length <
      8
    ) {
      setErrorMessage(
        "Password must contain at least 8 characters.",
      );

      return;
    }

    setIsSubmitting(
      true,
    );

    const {
      data,
      error,
    } =
      await supabase.auth
        .signUp({
          email:
            cleanEmail,

          password,

          options: {
            emailRedirectTo:
              `${window.location.origin}/login`,
          },
        });

    setIsSubmitting(
      false,
    );

    if (error) {
      console.error(
        "Account creation failed:",
        error,
      );

      setErrorMessage(
        "Your account could not be created. Please try again.",
      );

      return;
    }

    /*
      Email signup successfully reached
      Supabase.

      Do not send email addresses or other
      personal information to analytics.
    */

    track(
      "Signup Completed",
      {
        method:
          "email",

        requiresConfirmation:
          !data.session,
      },
    );

    setSuccessMessage(
      "Account created. Check your email to confirm your account, then log in.",
    );

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  const authBusy =
    isSubmitting ||
    isGoogleLoading;

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-slate-950 shadow-sm"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
        Get Started
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        Create Account
      </h1>

      <p className="mt-2 leading-7 text-slate-600">
        Create an account to
        start building your
        personal game library.
      </p>

      <button
        type="button"
        disabled={
          authBusy
        }
        onClick={() =>
          void handleGoogleSignup()
        }
        className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            fill="#4285F4"
            d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
          />

          <path
            fill="#34A853"
            d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.05v2.62A10 10 0 0 0 12 22Z"
          />

          <path
            fill="#FBBC05"
            d="M6.4 13.94A6.02 6.02 0 0 1 6.08 12c0-.67.12-1.32.32-1.94V7.44H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.56l3.35-2.62Z"
          />

          <path
            fill="#EA4335"
            d="M12 5.94c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.95 5.44l3.35 2.62C7.19 7.7 9.4 5.94 12 5.94Z"
          />
        </svg>

        {isGoogleLoading
          ? "Connecting..."
          : "Continue With Google"}
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Or Use Email
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-bold text-slate-800">
          Email
        </span>

        <input
          required
          type="email"
          value={
            email
          }
          onChange={(
            event,
          ) =>
            setEmail(
              event
                .target
                .value,
            )
          }
          autoComplete="email"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </label>

      <label className="mt-5 block space-y-2">
        <span className="text-sm font-bold text-slate-800">
          Password
        </span>

        <input
          required
          type="password"
          value={
            password
          }
          onChange={(
            event,
          ) =>
            setPassword(
              event
                .target
                .value,
            )
          }
          minLength={
            8
          }
          autoComplete="new-password"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </label>

      <label className="mt-5 block space-y-2">
        <span className="text-sm font-bold text-slate-800">
          Confirm Password
        </span>

        <input
          required
          type="password"
          value={
            confirmPassword
          }
          onChange={(
            event,
          ) =>
            setConfirmPassword(
              event
                .target
                .value,
            )
          }
          minLength={
            8
          }
          autoComplete="new-password"
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </label>

      {errorMessage && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {
            errorMessage
          }
        </div>
      )}

      {successMessage && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {
            successMessage
          }
        </div>
      )}

      <button
        type="submit"
        disabled={
          authBusy
        }
        className="mt-6 h-12 w-full rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {isSubmitting
          ? "Creating Account..."
          : "Create Account"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an
        account?{" "}
        <Link
          href="/login"
          className="font-bold text-indigo-600 hover:underline"
        >
          Log In
        </Link>
      </p>
    </form>
  );
}