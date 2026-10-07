"use client";

import Link from "next/link";

import {
  FormEvent,
  useState,
} from "react";

import {
  supabase,
} from "@/lib/supabase";

export function ForgotPasswordForm() {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (!cleanEmail) {
      setError(
        "Enter your email address.",
      );

      return;
    }

    setIsSubmitting(
      true,
    );

    try {
      const siteUrl =
        process.env
          .NEXT_PUBLIC_SITE_URL ??
        window.location.origin;

      const redirectTo =
        `${siteUrl}/auth/callback?next=/reset-password`;

      const {
        error:
          resetError,
      } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo,
          },
        );

      if (
        resetError
      ) {
        console.error(
          "Password reset request failed:",
          resetError,
        );

        if (
          resetError.message
            .toLowerCase()
            .includes(
              "rate limit",
            )
        ) {
          setError(
            "Too many reset emails have been requested. Please wait and try again later.",
          );

          return;
        }

        setError(
          "The reset email could not be sent. Please try again.",
        );

        return;
      }

      /*
        Deliberately generic.

        We do not tell someone whether
        an account exists for an email.
      */

      setMessage(
        "If an account exists for that email address, a password reset link has been sent.",
      );

      setEmail("");
    } catch (
      submitError
    ) {
      console.error(
        "Password reset error:",
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

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
          Account Recovery
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Forgot Your Password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the email address
          associated with your account
          and we&apos;ll send you a
          password reset link.
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-7 space-y-5"
      >
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Email Address

          <input
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
            required
            placeholder="you@example.com"
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {
              error
            }
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold leading-6 text-emerald-700">
            {
              message
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
            ? "Sending..."
            : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-bold text-indigo-600 transition hover:text-indigo-800"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}