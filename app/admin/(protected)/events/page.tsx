"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/app/lib/supabase/client";

type EventRow = {
  id: string;
  name: string;
  event_slug: string | null;
  event_date: string | null;
  venue: string | null;
  city: string | null;
  country_id: string | null;
  poster_url: string | null;
  hero_image_url: string | null;
  description: string | null;
  status: string;
  ticket_url: string | null;
  broadcast_url: string | null;
  created_at: string;
  updated_at: string;
};

function formatEventDate(
  value: string | null
) {
  if (!value) {
    return "Date Not Set";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date Not Set";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function statusClasses(
  status: string
) {
  const normalized =
    status.toLowerCase();

  if (
    normalized === "published" ||
    normalized === "upcoming"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "bg-red-100 text-red-700";
  }

  if (
    normalized === "completed" ||
    normalized === "past"
  ) {
    return "bg-[#ece8e2] text-[#625d56]";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function AdminEventsPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [events, setEvents] =
    useState<EventRow[]>([]);

  const [
    isSuperAdmin,
    setIsSuperAdmin,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const {
        data: adminData,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (adminError) {
        console.error(
          "Admin role error:",
          adminError
        );
      }

      setIsSuperAdmin(
        adminData?.role ===
          "super_admin"
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("events")
      .select("*")
      .order("event_date", {
        ascending: false,
        nullsFirst: false,
      });

    if (error) {
      console.error(
        "Admin events error:",
        error
      );

      setMessage(
        error.message
      );
    }

    setEvents(
      (data as EventRow[]) ||
        []
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

  async function deleteEvent(
    event: EventRow
  ) {
    if (!isSuperAdmin) {
      setMessage(
        "Only the Super Admin can permanently delete events."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `PERMANENTLY delete "${event.name}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const {
      error,
    } = await supabase
      .from("events")
      .delete()
      .eq("id", event.id);

    if (error) {
      console.error(
        "Delete event error:",
        error
      );

      setMessage(
        error.message
      );

      return;
    }

    setMessage(
      "Event permanently deleted."
    );

    await loadData();
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading Events...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
            Event Management
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
            HBE Events
          </h1>

          <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

          <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
            Manage Heritage Boxing Entertainment events,
            venues, dates, posters, tickets, broadcasts
            and event status.
          </p>

        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
        >
          + Create Event
        </Link>

      </div>

      {/* SUPER ADMIN NOTICE */}
      {isSuperAdmin && (
        <div className="mt-6 border border-[#e2ddd5] bg-white px-5 py-4">

          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#941f25]">
            Super Admin Controls Enabled
          </p>

          <p className="mt-1 text-sm text-[#625d56]">
            Permanent-delete controls are visible only to the Super Admin.
          </p>

        </div>
      )}

      {/* MESSAGE */}
      {message && (
        <div className="mt-6 border border-[#d8d3cb] bg-white p-4 text-sm font-semibold text-[#171717]">
          {message}
        </div>
      )}

      {/* COUNT */}
      <div className="mt-8 border border-[#e2ddd5] bg-white p-5">

        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
          Total Events
        </p>

        <p className="mt-1 text-3xl font-black text-[#171717]">
          {events.length}
        </p>

      </div>

      {/* EVENTS */}
      <div className="mt-8 space-y-5">

        {events.length > 0 ? (
          events.map((event) => {
            const imageUrl =
              event.poster_url ||
              event.hero_image_url;

            return (
              <article
                key={event.id}
                className="overflow-hidden border border-[#e2ddd5] bg-white shadow-sm"
              >

                <div className="grid lg:grid-cols-[220px_1fr_auto]">

                  {/* EVENT IMAGE */}
                  <div className="relative min-h-[220px] bg-[#ece8e2]">

                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={event.name}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center p-6 text-center">

                        <span className="text-xs font-black uppercase tracking-wider text-[#8a847c]">
                          No Event Image
                        </span>

                      </div>
                    )}

                  </div>

                  {/* EVENT INFORMATION */}
                  <div className="p-6">

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-black uppercase text-[#171717] sm:text-2xl">
                        {event.name}
                      </h2>

                      <span
                        className={`px-3 py-1 text-xs font-black uppercase tracking-wide ${statusClasses(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>

                    </div>

                    <p className="mt-4 text-lg font-bold text-[#941f25]">
                      {formatEventDate(
                        event.event_date
                      )}
                    </p>

                    <div className="mt-5 grid gap-4 text-sm text-[#625d56] sm:grid-cols-2">

                      <p>
                        <strong>
                          Venue:
                        </strong>{" "}
                        {event.venue ||
                          "Not Set"}
                      </p>

                      <p>
                        <strong>
                          City:
                        </strong>{" "}
                        {event.city ||
                          "Not Set"}
                      </p>

                    </div>

                    {event.description && (
                      <p className="mt-5 line-clamp-3 max-w-3xl leading-6 text-[#625d56]">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-4 text-sm">

                      {event.ticket_url && (
                        <span className="font-bold text-[#171717]">
                          ✓ Ticket Link
                        </span>
                      )}

                      {event.broadcast_url && (
                        <span className="font-bold text-[#171717]">
                          ✓ Broadcast Link
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center border-t border-[#eee9e2] p-6 lg:border-l lg:border-t-0">

                    <div className="w-full space-y-3">

                      <Link
                        href={`/admin/events/${event.id}`}
                        className="inline-flex w-full items-center justify-center bg-[#c6a24a] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39]"
                      >
                        Edit Event
                      </Link>

                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() =>
                            deleteEvent(
                              event
                            )
                          }
                          className="inline-flex w-full items-center justify-center border border-red-300 bg-red-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-red-700 transition hover:bg-red-700 hover:text-white"
                        >
                          Permanent Delete
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </article>
            );
          })
        ) : (
          <div className="border border-[#e2ddd5] bg-white p-8 text-[#625d56]">
            No events have been created yet.
          </div>
        )}

      </div>

    </main>
  );
}