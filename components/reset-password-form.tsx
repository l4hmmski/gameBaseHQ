"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export function ResetPasswordForm() {
  const router =
    useRouter();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    isChecking,
    setIsChecking,
  ] = useState(true);

  const [
    recoveryReady,
    setRecoveryReady,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      const {
        data: { session },
        error,
      } =
        await supabase.auth
          .getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          "Could not check recovery session:",
          error,
        );
      }

      if (session) {
        setRecoveryReady(true);
      }

      setIsChecking(false);
    }

    void checkRecoverySession();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth
        .onAuthStateChange(
          (
            event,
            session,
          ) => {
            if (!mounted) {
              return;
            }

            if (
              event ===
                "PASSWORD_RECOVERY" ||
              session
            ) {
              setRecoveryReady(
                true,
              );

              setIsChecking(
                false,
              );

              setErrorMessage(
                "",
              );
            }
          },
        );

    /*
      Give Supabase a short moment
      to process the recovery redirect.

      If no authenticated recovery
      session appears, show an error.
    */

    const timeout =
      window.setTimeout(
        () => {
          if (!mounted) {
            return;
          }

          setIsChecking(
            false,
          );
        },
        1500,
      );

    return () => {
      mounted = false;

      window.clearTimeout(
        timeout,
      );

      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!recoveryReady) {
      setErrorMessage(
        "This password reset link is invalid or has expired. Please request a new reset link.",
      );

      return;
    }

    if (
      password.length < 8
    ) {
      setErrorMessage(
        "Your new password must contain at least 8 characters.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setErrorMessage(
        "The passwords do not match.",
      );

      return;
    }

    setIsSubmitting(true);

    const { error } =
      await supabase.auth
        .updateUser({
          password,
        });

    setIsSubmitting(false);

    if (error) {
      console.error(
        "Password update failed:",
        error,
      );

      setErrorMessage(
        "Your password could not be updated. Please request a new reset link and try again.",
      );

      return;
    }

    setSuccessMessage(
      "Your password has been updated successfully.",
    );

    setPassword("");
    setConfirmPassword("");

    window.setTimeout(
      async () => {
        await supabase.auth
          .signOut();

        router.push(
          "/login",
        );

        router.refresh();
      },
      1500,
    );
  }

  if (isChecking) {
    return (
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

        <p className="mt-4 font-semibold text-slate-700">
          Checking Your Reset Link...
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
        Account Recovery
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        Choose a New Password
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        Enter a new password for
        your Game Library account.
      </p>

      {!recoveryReady && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          This password reset link is invalid or has expired.
        </div>
      )}

      {recoveryReady && (
        <>
          <label className="mt-7 grid gap-2">
            <span className="text-sm font-bold text-slate-800">
              New Password
            </span>

            <input
              required
              type="password"
              value={password}
              onChange={(
                event,
              ) =>
                setPassword(
                  event.target
                    .value,
                )
              }
              minLength={8}
              autoComplete="new-password"
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="mt-5 grid gap-2">
            <span className="text-sm font-bold text-slate-800">
              Confirm New Password
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
                  event.target
                    .value,
                )
              }
              minLength={8}
              autoComplete="new-password"
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </>
      )}

      {errorMessage && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      {recoveryReady && (
        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="mt-6 h-12 w-full rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSubmitting
            ? "Updating Password..."
            : "Update Password"}
        </button>
      )}

      {!recoveryReady && (
        <Link
          href="/forgot-password"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Request New Reset Link
        </Link>
      )}
    </form>
  );
}