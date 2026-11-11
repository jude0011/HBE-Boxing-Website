"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/app/lib/supabase/client";

type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: "super_admin" | "admin";
  active: boolean;
};

export default function AdminUsersPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [isSuperAdmin, setIsSuperAdmin] =
    useState(false);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const {
      data: currentAdmin,
      error: currentAdminError,
    } = await supabase
      .from("admin_users")
      .select("role, active")
      .eq("id", user.id)
      .single();

    if (
      currentAdminError ||
      !currentAdmin ||
      !currentAdmin.active ||
      currentAdmin.role !== "super_admin"
    ) {
      setIsSuperAdmin(false);
      setLoading(false);
      return;
    }

    setIsSuperAdmin(true);

    const {
      data,
      error,
    } = await supabase
      .from("admin_users")
      .select(`
        id,
        email,
        full_name,
        role,
        active
      `)
      .order("full_name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Admin users load error:",
        error
      );

      setMessage(
        error.message
      );

      setLoading(false);

      return;
    }

    setUsers(
      (data as AdminUser[]) || []
    );

    setLoading(false);
  }

  useEffect(() => {
    const initializePage =
      async () => {
        await loadData();
      };

    void initializePage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading Admin Users...
        </p>

      </main>
    );
  }

  if (!isSuperAdmin) {
    return (
      <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

        <div className="border border-red-200 bg-red-50 p-8">

          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
            Restricted Area
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-[#171717]">
            Super Admin Access Required
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#625d56]">
            Only the HBE Super Admin can manage administrator accounts,
            roles and access.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
            Security & Access
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
            Admin Users
          </h1>

          <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

          <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
            Manage administrator access, roles and account status
            for the Heritage Boxing Entertainment platform.
          </p>

        </div>

        <Link
          href="/admin/admin-users/new"
          className="inline-flex items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
        >
          + Add Admin User
        </Link>

      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mt-6 border border-[#d8d3cb] bg-white p-4 text-sm font-semibold text-[#171717]">
          {message}
        </div>
      )}

      {/* SUMMARY */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Total Admin Users
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {users.length}
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Active
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {
              users.filter(
                (user) =>
                  user.active
              ).length
            }
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Super Admins
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {
              users.filter(
                (user) =>
                  user.role ===
                  "super_admin"
              ).length
            }
          </p>

        </div>

      </div>

      {/* USERS */}
      <div className="mt-8 space-y-4">

        {users.length > 0 ? (

          users.map((user) => (

            <article
              key={user.id}
              className="border border-[#e2ddd5] bg-white shadow-sm"
            >

              <div className="grid lg:grid-cols-[1fr_auto]">

                {/* INFORMATION */}
                <div className="p-6">

                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="text-xl font-black uppercase text-[#171717]">
                      {user.full_name ||
                        "Unnamed Administrator"}
                    </h2>

                    <span
                      className={
                        user.role ===
                        "super_admin"
                          ? "bg-[#fff4d6] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#8a6919]"
                          : "bg-[#f7f4ef] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#625d56]"
                      }
                    >
                      {user.role ===
                      "super_admin"
                        ? "Super Admin"
                        : "Admin"}
                    </span>

                    <span
                      className={
                        user.active
                          ? "bg-green-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-green-700"
                          : "bg-red-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-700"
                      }
                    >
                      {user.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#625d56]">
                    {user.email}
                  </p>

                </div>

                {/* ACTION */}
                <div className="flex items-center border-t border-[#eee9e2] p-6 lg:border-l lg:border-t-0">

                  <Link
                    href={`/admin/admin-users/${user.id}`}
                    className="inline-flex w-full min-w-[180px] items-center justify-center bg-[#c6a24a] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39]"
                  >
                    Edit Admin User
                  </Link>

                </div>

              </div>

            </article>

          ))

        ) : (

          <div className="border border-[#e2ddd5] bg-white p-8">

            <p className="font-bold text-[#625d56]">
              No administrator accounts found.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}