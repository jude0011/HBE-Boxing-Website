"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role:
    | "admin"
    | "super_admin";
  active: boolean;
};

export default function EditAdminUserPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const adminId =
    typeof params.id ===
    "string"
      ? params.id
      : "";

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState("");

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    email,
    setEmail,
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
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const loadAdminUser =
      async () => {
        if (!adminId) {
          setError(
            "Administrator ID not found."
          );

          setLoading(false);

          return;
        }

        const {
          data: {
            user:
              currentUser,
          },
        } =
          await supabase.auth.getUser();

        if (currentUser) {
          setCurrentUserId(
            currentUser.id
          );
        }

        const {
          data,
          error:
            loadError,
        } = await supabase
          .from(
            "admin_users"
          )
          .select(`
            id,
            email,
            full_name,
            role,
            active
          `)
          .eq(
            "id",
            adminId
          )
          .single();

        if (
          loadError ||
          !data
        ) {
          setError(
            loadError?.message ||
              "Administrator not found."
          );

          setLoading(false);

          return;
        }

        const admin =
          data as AdminUser;

        setFullName(
          admin.full_name || ""
        );

        setEmail(
          admin.email || ""
        );

        setRole(
          admin.role
        );

        setActive(
          admin.active
        );

        setLoading(false);
      };

    void loadAdminUser();
  }, [
    adminId,
    supabase,
  ]);

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

    /*
      PROTECT THE CURRENT
      SUPER ADMIN FROM
      LOCKING THEMSELVES OUT
    */
    if (
      adminId ===
      currentUserId
    ) {
      if (!active) {
        setError(
          "You cannot deactivate your own Super Admin account."
        );

        setSaving(false);

        return;
      }

      if (
        role !==
        "super_admin"
      ) {
        setError(
          "You cannot remove your own Super Admin role."
        );

        setSaving(false);

        return;
      }
    }

    const {
      error:
        updateError,
    } = await supabase
      .from(
        "admin_users"
      )
      .update({
        full_name:
          fullName.trim(),

        role,

        active,
      })
      .eq(
        "id",
        adminId
      );

    if (updateError) {
      console.error(
        "Admin update error:",
        updateError
      );

      setError(
        updateError.message
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

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading Administrator...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Security & Access
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
        Edit Admin User
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      {adminId ===
        currentUserId && (
        <div className="mt-6 border border-[#e3d19a] bg-[#fff8e5] p-5">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#8a6919]">
            Your Account
          </p>

          <p className="mt-2 text-sm leading-6 text-[#625d56]">
            For security, you cannot
            deactivate your own account
            or remove your own Super
            Admin role.
          </p>

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase text-[#171717]">
            Administrator Information
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
                value={email}
                disabled
                className={`${inputClass} cursor-not-allowed bg-[#f2efe9] text-[#8a847c]`}
              />

              <p className="mt-2 text-xs text-[#8a847c]">
                Email is tied to the
                Supabase authentication
                account and is not edited
                from this screen.
              </p>

            </div>

          </div>

        </section>

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
              disabled={
                adminId ===
                currentUserId
              }
              onChange={(event) =>
                setRole(
                  event.target.value as
                    | "admin"
                    | "super_admin"
                )
              }
              className={`${inputClass} ${
                adminId ===
                currentUserId
                  ? "cursor-not-allowed bg-[#f2efe9]"
                  : ""
              }`}
            >

              <option value="admin">
                Admin
              </option>

              <option value="super_admin">
                Super Admin
              </option>

            </select>

          </div>

          <label className="mt-6 flex items-center gap-3">

            <input
              type="checkbox"
              checked={active}
              disabled={
                adminId ===
                currentUserId
              }
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

          <p className="mt-2 text-sm text-[#625d56]">
            An inactive administrator
            will no longer be allowed into
            the protected HBE admin area.
          </p>

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
            className="bg-[#c6a24a] px-7 py-4 text-sm font-black uppercase text-[#171717] transition hover:bg-[#b08d39] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Admin User"}
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