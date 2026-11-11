"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

type NotificationCounts = {
  contacts: number;
  applications: number;
};

const links = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/contacts",
    label: "Contact Inquiries",
  },
  {
    href: "/admin/applications",
    label: "Boxer Applications",
  },
  {
    href: "/admin/boxers",
    label: "Boxers",
  },
  {
    href: "/admin/rankings",
    label: "Rankings",
  },
  {
    href: "/admin/champions",
    label: "Champions",
  },
  {
    href: "/admin/events",
    label: "Events",
  },
  {
    href: "/admin/media",
    label: "Media",
  },
  {
    href: "/admin/news",
    label: "News",
  },
  {
    href: "/admin/partners",
    label: "Partners",
  },
];

export default function AdminSidebar({
  role,
}: {
  role: string;
}) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);

  const [
    notificationCounts,
    setNotificationCounts,
  ] =
    useState<NotificationCounts>({
      contacts: 0,
      applications: 0,
    });

  /*
    TOTAL UNREAD NOTIFICATIONS
  */
  const totalNotifications =
    notificationCounts.contacts +
    notificationCounts.applications;

  /*
    LOAD UNREAD COUNTS
  */
  useEffect(() => {
    let mounted = true;

    async function loadNotificationCounts() {
      const [
        contactsResult,
        applicationsResult,
      ] = await Promise.all([
        supabase
          .from(
            "contact_inquiries"
          )
          .select(
            "id",
            {
              count: "exact",
              head: true,
            }
          )
          .eq(
            "is_read",
            false
          ),

        supabase
          .from(
            "boxer_applications"
          )
          .select(
            "id",
            {
              count: "exact",
              head: true,
            }
          )
          .eq(
            "is_read",
            false
          ),
      ]);

      if (
        contactsResult.error
      ) {
        console.error(
          "Contact notification count error:",
          contactsResult.error
        );
      }

      if (
        applicationsResult.error
      ) {
        console.error(
          "Application notification count error:",
          applicationsResult.error
        );
      }

      if (!mounted) {
        return;
      }

      setNotificationCounts({
        contacts:
          contactsResult.count ??
          0,

        applications:
          applicationsResult.count ??
          0,
      });
    }

    void loadNotificationCounts();

    /*
      REALTIME CONTACT INQUIRIES
    */
    const contactsChannel =
      supabase
        .channel(
          "hbe-contact-notifications"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "contact_inquiries",
          },
          () => {
            void loadNotificationCounts();
          }
        )
        .subscribe();

    /*
      REALTIME BOXER APPLICATIONS
    */
    const applicationsChannel =
      supabase
        .channel(
          "hbe-application-notifications"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "boxer_applications",
          },
          () => {
            void loadNotificationCounts();
          }
        )
        .subscribe();

    return () => {
      mounted = false;

      void supabase.removeChannel(
        contactsChannel
      );

      void supabase.removeChannel(
        applicationsChannel
      );
    };
  }, [supabase]);

  /*
    LOCK PAGE SCROLL
    WHEN MOBILE DRAWER IS OPEN
  */
  useEffect(() => {
    if (
      mobileOpen
    ) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mobileOpen]);

  async function logout() {
    await supabase.auth.signOut();

    setMobileOpen(
      false
    );

    router.replace(
      "/admin/login"
    );

    router.refresh();
  }

  function isActive(
    href: string
  ) {
    if (
      href === "/admin"
    ) {
      return (
        pathname ===
        "/admin"
      );
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }

  /*
    GET NOTIFICATION COUNT
    FOR EACH NAVIGATION LINK
  */
  function getLinkNotificationCount(
    href: string
  ) {
    if (
      href ===
      "/admin"
    ) {
      return totalNotifications;
    }

    if (
      href ===
      "/admin/contacts"
    ) {
      return notificationCounts.contacts;
    }

    if (
      href ===
      "/admin/applications"
    ) {
      return notificationCounts.applications;
    }

    return 0;
  }

  const adminUsersActive =
    pathname ===
      "/admin/admin-users" ||
    pathname.startsWith(
      "/admin/admin-users/"
    );

  return (
    <>

      {/* =====================================
          DESKTOP SIDEBAR
          ===================================== */}
      <aside className="hidden h-screen w-[275px] shrink-0 flex-col overflow-y-auto bg-[#171717] text-white lg:flex">

        {/* HEADER */}
        <div className="border-b border-white/10 px-6 py-7">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e0c273]">
                Heritage Boxing
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase">
                HBE Admin
              </h2>

              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-white/50">
                {role ===
                "super_admin"
                  ? "Super Admin"
                  : "Administrator"}
              </p>

            </div>

            {/* DESKTOP NOTIFICATION TOTAL */}
            {totalNotifications >
              0 && (

              <div
                className="flex min-h-[34px] min-w-[34px] items-center justify-center rounded-full bg-[#941f25] px-2 text-xs font-black text-white"
                title={`${totalNotifications} new submission${
                  totalNotifications ===
                  1
                    ? ""
                    : "s"
                }`}
              >
                {
                  totalNotifications
                }
              </div>

            )}

          </div>

        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="p-4">

          {links.map(
            (link) => {
              const active =
                isActive(
                  link.href
                );

              const count =
                getLinkNotificationCount(
                  link.href
                );

              return (
                <Link
                  key={
                    link.href
                  }
                  href={
                    link.href
                  }
                  className={`mb-1 flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-[#941f25] text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >

                  <span>
                    {
                      link.label
                    }
                  </span>

                  {count >
                    0 && (

                    <span
                      className={`flex min-h-[24px] min-w-[24px] shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-black ${
                        active
                          ? "bg-white text-[#941f25]"
                          : "bg-[#941f25] text-white"
                      }`}
                    >
                      {
                        count
                      }
                    </span>

                  )}

                </Link>
              );
            }
          )}

          {/* SUPER ADMIN ONLY */}
          {role ===
            "super_admin" && (

            <Link
              href="/admin/admin-users"
              className={`mb-1 block px-4 py-3 text-sm font-bold transition ${
                adminUsersActive
                  ? "bg-[#941f25] text-white"
                  : "text-[#e0c273] hover:bg-white/10 hover:text-white"
              }`}
            >
              Admin Users
            </Link>

          )}

        </nav>

        {/* DESKTOP SIGN OUT */}
        <div className="mt-auto p-4">

          <button
            type="button"
            onClick={
              logout
            }
            className="w-full border border-white/20 px-4 py-3 text-left text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
          >
            Sign Out
          </button>

        </div>

      </aside>

      {/* =====================================
          MOBILE ADMIN BAR
          ===================================== */}
      <header className="sticky top-0 z-40 flex min-h-[68px] items-center justify-between border-b border-[#e5e0d8] bg-white px-4 lg:hidden">

        {/* HAMBURGER */}
        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              true
            )
          }
          aria-label="Open admin menu"
          aria-expanded={
            mobileOpen
          }
          className="relative flex h-11 w-11 shrink-0 items-center justify-center border border-[#d8d3cb] bg-[#f7f4ef] text-[#171717]"
        >

          <span className="text-2xl leading-none">
            ☰
          </span>

          {/* MOBILE HAMBURGER BADGE */}
          {totalNotifications >
            0 && (

            <span className="absolute -right-2 -top-2 flex min-h-[23px] min-w-[23px] items-center justify-center rounded-full bg-[#941f25] px-1.5 text-[10px] font-black text-white">
              {
                totalNotifications
              }
            </span>

          )}

        </button>

        {/* MOBILE TITLE */}
        <div className="min-w-0 flex-1 px-4">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#941f25]">
            HBE Administration
          </p>

          <p className="mt-1 text-xs font-bold uppercase text-[#625d56]">
            {role ===
            "super_admin"
              ? "Super Admin"
              : "Administrator"}
          </p>

        </div>

        {/* MOBILE NOTIFICATION STATUS */}
        {totalNotifications >
          0 ? (

          <div className="flex shrink-0 items-center gap-2 bg-red-50 px-3 py-2">

            <span className="text-sm">
              🔔
            </span>

            <span className="text-[11px] font-black text-[#941f25]">
              {
                totalNotifications
              }
            </span>

          </div>

        ) : (

          <div className="shrink-0 bg-[#f7f4ef] px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#5f5b55]">
            Admin
          </div>

        )}

      </header>

      {/* =====================================
          MOBILE DARK OVERLAY
          ===================================== */}
      {mobileOpen && (

        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />

      )}

      {/* =====================================
          MOBILE DRAWER
          ===================================== */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-[85%] max-w-[320px] flex-col overflow-y-auto bg-[#171717] text-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* DRAWER HEADER */}
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-6">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e0c273]">
              Heritage Boxing
            </p>

            <div className="mt-2 flex items-center gap-3">

              <h2 className="text-2xl font-black uppercase">
                HBE Admin
              </h2>

              {totalNotifications >
                0 && (

                <span className="flex min-h-[28px] min-w-[28px] items-center justify-center rounded-full bg-[#941f25] px-2 text-[11px] font-black text-white">
                  {
                    totalNotifications
                  }
                </span>

              )}

            </div>

            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-white/50">
              {role ===
              "super_admin"
                ? "Super Admin"
                : "Administrator"}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            aria-label="Close admin menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 text-xl font-bold text-white transition hover:bg-white hover:text-black"
          >
            ×
          </button>

        </div>

        {/* MOBILE NAVIGATION */}
        <nav className="p-4">

          {links.map(
            (link) => {
              const active =
                isActive(
                  link.href
                );

              const count =
                getLinkNotificationCount(
                  link.href
                );

              return (
                <Link
                  key={
                    link.href
                  }
                  href={
                    link.href
                  }
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className={`mb-1 flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-[#941f25] text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >

                  <span>
                    {
                      link.label
                    }
                  </span>

                  {count >
                    0 && (

                    <span
                      className={`flex min-h-[24px] min-w-[24px] shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-black ${
                        active
                          ? "bg-white text-[#941f25]"
                          : "bg-[#941f25] text-white"
                      }`}
                    >
                      {
                        count
                      }
                    </span>

                  )}

                </Link>
              );
            }
          )}

          {/* SUPER ADMIN ONLY */}
          {role ===
            "super_admin" && (

            <Link
              href="/admin/admin-users"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
              className={`mb-1 block px-4 py-3 text-sm font-bold transition ${
                adminUsersActive
                  ? "bg-[#941f25] text-white"
                  : "text-[#e0c273] hover:bg-white/10 hover:text-white"
              }`}
            >
              Admin Users
            </Link>

          )}

        </nav>

        {/* MOBILE SIGN OUT */}
        <div className="mt-auto p-4">

          <button
            type="button"
            onClick={
              logout
            }
            className="w-full border border-white/20 px-4 py-3 text-left text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
          >
            Sign Out
          </button>

        </div>

      </aside>

    </>
  );
}