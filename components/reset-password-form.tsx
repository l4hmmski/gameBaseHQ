"use client";

import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  supabase,
} from "@/lib/supabase";

export function ResetPasswordForm() {
  const router =
    useRouter();

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
    error,
    setError,
  ] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [
    isCheckingSession,
    setIsCheckingSession,
  ] =
    useState(true);

  const [
    hasRecoverySession,
    setHasRecoverySession,
  ] =
    useState(false);

  useEffect(() => {
    let cancelled =
      false;

    async function checkSession() {
      const {
        data: {
          user,
        },

        error:
          userError,
      } =
        await supabase.auth.getUser();

      if (
        cancelled
      ) {
        return;
      }

      if (
        userError ||
        !user
      ) {
        setHasRecoverySession(
          false,
        );

        setIsCheckingSession(
          false,
        );

        return;
      }

      setHasRecoverySession(
        true,
      );

      setIsCheckingSession(
        false,
      );
    }

    void checkSession();

    return () => {
      cancelled =
        true;
    };
  }, []);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (
      password.length <
      8
    ) {
      setError(
        "Your password must be at least 8 characters long.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "The passwords do not match.",
      );

      return;
    }

    setIsSubmitting(
      true,
    );

    try {
      const {
        error:
          updateError,
      } =
        await supabase.auth.updateUser({
          password,
        });

      if (
        updateError
      ) {
        console.error(
          "Password update failed:",
          updateError,
        );

        setError(
          "Your password could not be updated. The reset link may have expired. Please request a new one.",
        );

        return;
      }

      /*
        Sign the recovery session out.

        The user can then verify that
        their new password works by
        logging in normally.
      */

      await supabase.auth.signOut();

      router.replace(
        "/login?password=updated",
      );

      router.refresh();
    } catch (
      submitError
    ) {
      console.error(
        "Password update error:",
        submitError,
      );

      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  if (
    isCheckingSession
  ) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="font-semibold text-slate-600">
          Checking Reset Link...
        </p>
      </div>
    );
  }

  if (
    !hasRecoverySession
  ) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
          Invalid Reset Link
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Request a New Link
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          This password reset link is
          invalid or has expired.
        </p>

        <Link
          href="/forgot-password"
          className="mt-6 block rounded-xl bg-indigo-600 px-4 py-3 text-center font-bold text-white transition hover:bg-indigo-700"
        >
          Request New Reset Link
        </Link>

        <Link
          href="/login"
          className="mt-4 block text-center text-sm font-bold text-indigo-600 hover:text-indigo-800"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
        Account Recovery
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        Create a New Password
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Enter a new password for your
        Game Library account.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-7 space-y-5"
      >
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          New Password

          <input
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
            autoComplete="new-password"
            required
            minLength={
              8
            }
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Confirm New Password

          <input
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
            autoComplete="new-password"
            required
            minLength={
              8
            }
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold leading-6 text-red-700">
            {
              error
            }
          </div>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSubmitting
            ? "Updating Password..."
            : "Update Password"}
        </button>
      </form>
    </div>
  );
}