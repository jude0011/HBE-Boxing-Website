"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { createClient } from "@/app/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const supabase =
      createClient();

    const redirectTo =
      `${window.location.origin}/admin/reset-password`;

    const {
      error: resetError,
    } =
      await supabase.auth.resetPasswordForEmail(
        email
          .trim()
          .toLowerCase(),
        {
          redirectTo,
        }
      );

    if (resetError) {
      setError(
        resetError.message
      );

      setLoading(false);
      return;
    }

    setMessage(
      "If an HBE administrator account exists for that email address, a password reset link has been sent."
    );

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171717] px-4 py-12">

      <div className="w-full max-w-md overflow-hidden border border-white/10 bg-white shadow-2xl">

        {/* TOP */}
        <div className="border-b-4 border-[#c6a24a] bg-[#941f25] px-8 py-8">

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e0c273]">
            Heritage Boxing Entertainment
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-white">
            HBE Admin
          </h1>

        </div>

        {/* CONTENT */}
        <div className="p-8">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#941f25]">
            Account Recovery
          </p>

          <h2 className="mt-3 text-2xl font-black uppercase text-[#171717]">
            Forgot Password
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#6c675f]">
            Enter the email address connected
            to your HBE administrator account.
            We will send you a password reset
            link.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7"
          >

            <label className="text-xs font-black uppercase tracking-wide text-[#5f5b55]">
              Email Address
            </label>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              className="mt-2 w-full border border-[#d8d3cb] px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#941f25]"
            />

            {message && (
              <div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-6 text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#74181d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>

          <Link
            href="/admin/login"
            className="mt-6 block text-center text-xs font-black uppercase tracking-wide text-[#625d56] transition hover:text-[#941f25]"
          >
            ← Back to Login
          </Link>

        </div>

      </div>

    </main>
  );
}