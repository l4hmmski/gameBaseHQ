"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

export function ForgotPasswordForm() {
  const [email, setEmail] =
    useState("");

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setErrorMessage(
        "Enter your email address.",
      );

      return;
    }

    setIsSubmitting(true);

    const redirectTo =
      `${window.location.origin}/reset-password`;

    const { error } =
      await supabase.auth
        .resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo,
          },
        );

    setIsSubmitting(false);

    if (error) {
      console.error(
        "Password reset request failed:",
        error,
      );

      const message =
        error.message
          .toLowerCase();

      if (
        message.includes(
          "rate limit",
        ) ||
        message.includes(
          "too many",
        )
      ) {
        setErrorMessage(
          "Too many password reset requests. Please wait a few minutes and try again.",
        );

        return;
      }

      setErrorMessage(
        "We could not send the password reset email. Please try again.",
      );

      return;
    }

    setSuccessMessage(
      "If an account exists for that email address, a password reset link has been sent.",
    );

    setEmail("");
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
        Reset Your Password
      </h1>

      <p className="mt-3 leading-7 text-slate-600">
        Enter the email address linked
        to your account and we&apos;ll
        send you a password reset link.
      </p>

      <label className="mt-7 grid gap-2">
        <span className="text-sm font-bold text-slate-800">
          Email
        </span>

        <input
          required
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(
              event.target.value,
            );

            if (errorMessage) {
              setErrorMessage("");
            }

            if (successMessage) {
              setSuccessMessage("");
            }
          }}
          autoComplete="email"
          placeholder="you@example.com"
          className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </label>

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

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-12 w-full rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {isSubmitting
          ? "Sending Reset Link..."
          : "Send Reset Link"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-bold text-indigo-600 hover:underline"
        >
          Back to Log In
        </Link>
      </p>
    </form>
  );
}