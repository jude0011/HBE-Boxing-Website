"use client";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function NewAdminUserPage() {
  const router =
    useRouter();

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    role,
    setRole,
  ] = useState<
    "admin" | "super_admin"
  >("admin");

  const [
    active,
    setActive,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    if (
      !fullName.trim()
    ) {
      setError(
        "Full name is required."
      );

      setSaving(false);

      return;
    }

    if (!email.trim()) {
      setError(
        "Email is required."
      );

      setSaving(false);

      return;
    }

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

    const response =
      await fetch(
        "/api/admin-users",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            {
              full_name:
                fullName.trim(),

              email:
                email
                  .trim()
                  .toLowerCase(),

              password,

              role,

              active,
            }
          ),
        }
      );

    const result =
      (await response.json()) as {
        error?: string;
        success?: boolean;
      };

    if (!response.ok) {
      setError(
        result.error ||
          "Unable to create administrator."
      );

      setSaving(false);

      return;
    }

    router.push(
      "/admin/admin-users"
    );

    router.refresh();
  }

  const inputClass =
    "mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 text-[#171717] outline-none transition focus:border-[#941f25]";

  const labelClass =
    "text-xs font-black uppercase tracking-[0.12em] text-[#625d56]";

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Security & Access
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
        Add Admin User
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
        Create a secure HBE administrator
        account and assign its access level.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        {/* ACCOUNT */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase text-[#171717]">
            Administrator Account
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>

              <label className={labelClass}>
                Full Name
              </label>

              <input
                required
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                Email Address
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div>

              <label className={labelClass}>
                Temporary Password
              </label>

              <input
                required
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                minLength={8}
                className={inputClass}
              />

              <p className="mt-2 text-xs text-[#8a847c]">
                Minimum 8 characters.
              </p>

            </div>

            <div>

              <label className={labelClass}>
                Confirm Password
              </label>

              <input
                required
                type="password"
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                minLength={8}
                className={inputClass}
              />

            </div>

          </div>

        </section>

        {/* ACCESS */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase text-[#171717]">
            Access Level
          </h2>

          <div className="mt-6 max-w-md">

            <label className={labelClass}>
              Role
            </label>

            <select
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as
                    | "admin"
                    | "super_admin"
                )
              }
              className={inputClass}
            >

              <option value="admin">
                Admin
              </option>

              <option value="super_admin">
                Super Admin
              </option>

            </select>

          </div>

          <div className="mt-5 border border-[#e2ddd5] bg-[#f7f4ef] p-5">

            <p className="text-sm font-black uppercase text-[#171717]">
              Admin
            </p>

            <p className="mt-1 text-sm leading-6 text-[#625d56]">
              Can manage HBE content,
              fighters, rankings, champions,
              events, media and partners.
            </p>

            <p className="mt-4 text-sm font-black uppercase text-[#171717]">
              Super Admin
            </p>

            <p className="mt-1 text-sm leading-6 text-[#625d56]">
              Includes full administration
              privileges, permanent-delete
              controls and administrator
              account management.
            </p>

          </div>

          <label className="mt-6 flex items-center gap-3">

            <input
              type="checkbox"
              checked={active}
              onChange={(event) =>
                setActive(
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-[#941f25]"
            />

            <span className="text-sm font-black uppercase text-[#171717]">
              Active Account
            </span>

          </label>

        </section>

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="submit"
            disabled={saving}
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-[#74181d] disabled:opacity-60"
          >
            {saving
              ? "Creating..."
              : "Create Admin User"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/admin-users"
              )
            }
            className="border border-[#d8d3cb] bg-white px-7 py-4 text-sm font-black uppercase text-[#171717]"
          >
            Cancel
          </button>

        </div>

      </form>

    </main>
  );
}