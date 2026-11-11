"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const supabase =
      createClient();

    const {
      data,
      error: loginError,
    } =
      await supabase.auth.signInWithPassword(
        {
          email:
            email
              .trim()
              .toLowerCase(),

          password,
        }
      );

    if (loginError) {
      setError(
        loginError.message
      );

      setLoading(false);
      return;
    }

    if (!data.user) {
      setError(
        "Unable to verify this account."
      );

      setLoading(false);
      return;
    }

    const {
      data: admin,
      error: adminError,
    } = await supabase
      .from("admin_users")
      .select(`
        id,
        email,
        full_name,
        role,
        active
      `)
      .eq(
        "id",
        data.user.id
      )
      .single();

    if (
      adminError ||
      !admin ||
      !admin.active
    ) {
      await supabase.auth.signOut();

      setError(
        "This account does not have HBE administrator access."
      );

      setLoading(false);
      return;
    }

    router.replace(
      "/admin"
    );

    router.refresh();
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

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="p-8"
        >

          <h2 className="text-2xl font-black uppercase text-[#171717]">
            Administrator Login
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#6c675f]">
            Sign in to manage Heritage Boxing
            Entertainment operations.
          </p>

          {/* EMAIL */}
          <div className="mt-7">

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

          </div>

          {/* PASSWORD */}
          <div className="mt-5">

            <div className="flex items-center justify-between gap-4">

              <label className="text-xs font-black uppercase tracking-wide text-[#5f5b55]">
                Password
              </label>

              <Link
                href="/admin/forgot-password"
                className="text-xs font-black uppercase tracking-wide text-[#941f25] transition hover:text-[#b08d39]"
              >
                Forgot Password?
              </Link>

            </div>

            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              className="mt-2 w-full border border-[#d8d3cb] px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#941f25]"
            />

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#74181d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>

      </div>

    </main>
  );
}