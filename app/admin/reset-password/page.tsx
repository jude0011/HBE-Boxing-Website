"use client";

import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

export default function ResetPasswordPage() {
  const router =
    useRouter();

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [ready, setReady] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function prepareRecovery() {
      setError("");

      /*
        PKCE PASSWORD RECOVERY

        Supabase can return:
        /admin/reset-password?code=...

        Exchange the code for a session
        before allowing password update.
      */
      const params =
        new URLSearchParams(
          window.location.search
        );

      const code =
        params.get("code");

      if (code) {
        const {
          error: exchangeError,
        } =
          await supabase.auth.exchangeCodeForSession(
            code
          );

        if (exchangeError) {
          setError(
            "This password reset link is invalid or has expired. Please request a new reset link."
          );

          setChecking(false);
          return;
        }

        window.history.replaceState(
          {},
          document.title,
          "/admin/reset-password"
        );
      }

      /*
        CHECK RECOVERY SESSION
      */
      const {
        data: {
          session,
        },
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (
        sessionError ||
        !session
      ) {
        setError(
          "No valid password recovery session was found. Please request a new reset link."
        );

        setChecking(false);
        return;
      }

      setReady(true);
      setChecking(false);
    }

    void prepareRecovery();
  }, [supabase]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    if (
      password.length < 8
    ) {
      setError(
        "Password must be at least 8 characters."
      );

      setSaving(false);
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      setSaving(false);
      return;
    }

    const {
      error: updateError,
    } =
      await supabase.auth.updateUser(
        {
          password,
        }
      );

    if (updateError) {
      setError(
        updateError.message
      );

      setSaving(false);
      return;
    }

    setMessage(
      "Your password has been updated successfully. Returning you to the HBE Admin login."
    );

    setSaving(false);

    await supabase.auth.signOut();

    setTimeout(() => {
      router.replace(
        "/admin/login"
      );
    }, 1500);
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
            Create New Password
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#6c675f]">
            Enter a new password for your
            HBE administrator account.
          </p>

          {checking && (
            <div className="mt-6 border border-[#e2ddd5] bg-[#f7f4ef] px-4 py-4 text-sm font-semibold text-[#625d56]">
              Verifying your password reset link...
            </div>
          )}

          {!checking &&
            !ready &&
            error && (
              <>
                <div className="mt-6 border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold leading-6 text-red-700">
                  {error}
                </div>

                <Link
                  href="/admin/forgot-password"
                  className="mt-6 block w-full bg-[#941f25] px-6 py-4 text-center text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
                >
                  Request New Reset Link
                </Link>

                <Link
                  href="/admin/login"
                  className="mt-5 block text-center text-xs font-black uppercase tracking-wide text-[#625d56] transition hover:text-[#941f25]"
                >
                  Back to Login
                </Link>
              </>
            )}

          {ready && (
            <form
              onSubmit={handleSubmit}
              className="mt-7"
            >

              {/* NEW PASSWORD */}
              <div>

                <label className="text-xs font-black uppercase tracking-wide text-[#5f5b55]">
                  New Password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full border border-[#d8d3cb] px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#941f25]"
                />

              </div>

              {/* CONFIRM */}
              <div className="mt-5">

                <label className="text-xs font-black uppercase tracking-wide text-[#5f5b55]">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={
                    confirmPassword
                  }
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full border border-[#d8d3cb] px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#941f25]"
                />

              </div>

              {error && (
                <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-6 text-green-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-7 w-full bg-[#c6a24a] px-6 py-4 text-sm font-black uppercase tracking-wider text-[#171717] transition hover:bg-[#b08d39] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Updating..."
                  : "Update Password"}
              </button>

            </form>
          )}

        </div>

      </div>

    </main>
  );
}