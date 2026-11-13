"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const router =
    useRouter();

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (!cleanEmail) {
      setErrorMessage(
        "Enter your administrator email address."
      );
      return;
    }

    setSubmitting(true);
    setMessage("");
    setErrorMessage("");

    const {
      error,
    } =
      await supabase.auth
        .resetPasswordForEmail(
          cleanEmail
        );

    if (error) {
      console.error(
        "Password recovery error:",
        error
      );

      /*
        Keep the response intentionally
        generic so the page does not
        reveal whether an email exists.
      */
      setMessage(
        "If that email belongs to an HBE administrator, a 6-digit reset code has been sent."
      );

      setSubmitting(false);
      return;
    }

    /*
      Save the email for this browser
      and also pass it in the URL so
      the reset page can prefill it.
    */
    sessionStorage.setItem(
      "hbe_reset_email",
      cleanEmail
    );

    setMessage(
      "Reset code sent. Opening the verification page..."
    );

    setTimeout(
      () => {
        router.push(
          `/admin/reset-password?email=${encodeURIComponent(
            cleanEmail
          )}`
        );
      },
      650
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-12 text-[#171717]">

      <section className="w-full max-w-[540px] overflow-hidden border border-[#e1ddd6] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.12)]">

        {/* HBE HEADER */}
        <div className="border-b-4 border-[#c6a24a] bg-[#941f25] px-8 py-9 sm:px-10">

          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#c6a24a]">
            Heritage Boxing Entertainment
          </p>

          <h1 className="mt-2 text-3xl font-black uppercase text-white">
            HBE Admin
          </h1>

        </div>

        <div className="px-8 py-10 sm:px-10">

          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
            Account Recovery
          </p>

          <h2 className="mt-3 text-3xl font-black uppercase">
            Forgot Password?
          </h2>

          <div className="mt-4 h-1 w-16 bg-[#c6a24a]" />

          <p className="mt-5 leading-7 text-[#625d56]">
            Enter the email address connected to your HBE administrator account. We will email you a 6-digit verification code.
          </p>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8"
          >

            <label
              htmlFor="email"
              className="block text-xs font-black uppercase tracking-[0.12em] text-[#625d56]"
            >
              Administrator Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(
                event
              ) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="admin@example.com"
              className="mt-2 w-full border border-[#d8d2ca] bg-white px-4 py-4 text-lg outline-none transition focus:border-[#941f25] focus:ring-2 focus:ring-[#941f25]/10"
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 flex min-h-[58px] w-full items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#74181d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Sending Code..."
                : "Send Reset Code"}
            </button>

          </form>

          {message && (

            <div className="mt-6 border border-green-200 bg-green-50 p-5 text-sm font-semibold leading-6 text-green-800">
              {message}
            </div>

          )}

          {errorMessage && (

            <div className="mt-6 border border-red-200 bg-red-50 p-5 text-sm font-semibold leading-6 text-red-800">
              {errorMessage}
            </div>

          )}

          <div className="mt-8 border-t border-[#e5e0d8] pt-6">

            <Link
              href="/admin/login"
              className="text-sm font-black uppercase tracking-wide text-[#941f25] hover:text-[#74181d]"
            >
              ← Back To Admin Login
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
