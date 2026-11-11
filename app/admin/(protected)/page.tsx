import Link from "next/link";

import { createClient } from "@/app/lib/supabase/server";

export const dynamic =
  "force-dynamic";

type ContactActivity = {
  id: string;
  full_name: string;
  organization: string | null;
  created_at: string;
  is_read: boolean;
};

type ApplicationActivity = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  is_read: boolean;
};

type ActivityItem = {
  id: string;
  type:
    | "contact"
    | "application";
  title: string;
  subtitle: string;
  created_at: string;
  href: string;
  is_read: boolean;
};

function formatDateTime(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

export default async function AdminDashboard() {
  const supabase =
    await createClient();

  const [
    boxersResult,
    rankingsResult,
    contactsResult,
    applicationsResult,
    eventsResult,
    partnersResult,
    unreadContactsResult,
    unreadApplicationsResult,
    recentContactsResult,
    recentApplicationsResult,
  ] = await Promise.all([
    /*
      TOTAL BOXERS
    */
    supabase
      .from("boxers")
      .select("*", {
        count: "exact",
        head: true,
      }),

    /*
      PUBLISHED RANKINGS
    */
    supabase
      .from("rankings")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "published",
        true
      ),

    /*
      TOTAL CONTACT INQUIRIES
    */
    supabase
      .from(
        "contact_inquiries"
      )
      .select("*", {
        count: "exact",
        head: true,
      }),

    /*
      TOTAL BOXER APPLICATIONS
    */
    supabase
      .from(
        "boxer_applications"
      )
      .select("*", {
        count: "exact",
        head: true,
      }),

    /*
      TOTAL EVENTS
    */
    supabase
      .from("events")
      .select("*", {
        count: "exact",
        head: true,
      }),

    /*
      TOTAL PARTNERS
    */
    supabase
      .from("partners")
      .select("*", {
        count: "exact",
        head: true,
      }),

    /*
      UNREAD CONTACT INQUIRIES
    */
    supabase
      .from(
        "contact_inquiries"
      )
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "is_read",
        false
      ),

    /*
      UNREAD BOXER APPLICATIONS
    */
    supabase
      .from(
        "boxer_applications"
      )
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "is_read",
        false
      ),

    /*
      RECENT CONTACT INQUIRIES
    */
    supabase
      .from(
        "contact_inquiries"
      )
      .select(`
        id,
        full_name,
        organization,
        created_at,
        is_read
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(5),

    /*
      RECENT BOXER APPLICATIONS
    */
    supabase
      .from(
        "boxer_applications"
      )
      .select(`
        id,
        first_name,
        last_name,
        created_at,
        is_read
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(5),
  ]);

  const unreadContacts =
    unreadContactsResult.count ??
    0;

  const unreadApplications =
    unreadApplicationsResult.count ??
    0;

  const totalUnread =
    unreadContacts +
    unreadApplications;

  /*
    MAIN DASHBOARD CARDS
  */
  const cards = [
    {
      label:
        "Boxers",

      value:
        boxersResult.count ??
        0,

      href:
        "/admin/boxers",

      unread:
        0,
    },
    {
      label:
        "Published Rankings",

      value:
        rankingsResult.count ??
        0,

      href:
        "/admin/rankings",

      unread:
        0,
    },
    {
      label:
        "Contact Inquiries",

      value:
        contactsResult.count ??
        0,

      href:
        "/admin/contacts",

      unread:
        unreadContacts,
    },
    {
      label:
        "Boxer Applications",

      value:
        applicationsResult.count ??
        0,

      href:
        "/admin/applications",

      unread:
        unreadApplications,
    },
    {
      label:
        "Events",

      value:
        eventsResult.count ??
        0,

      href:
        "/admin/events",

      unread:
        0,
    },
    {
      label:
        "Partners",

      value:
        partnersResult.count ??
        0,

      href:
        "/admin/partners",

      unread:
        0,
    },
  ];

  /*
    BUILD RECENT ACTIVITY LIST
  */
  const contactActivity:
    ActivityItem[] =
    (
      recentContactsResult.data as
        | ContactActivity[]
        | null
    )?.map(
      (contact) => ({
        id:
          `contact-${contact.id}`,

        type:
          "contact",

        title:
          contact.full_name,

        subtitle:
          contact.organization
            ? `Contact Inquiry · ${contact.organization}`
            : "Contact Inquiry",

        created_at:
          contact.created_at,

        href:
          "/admin/contacts",

        is_read:
          contact.is_read,
      })
    ) || [];

  const applicationActivity:
    ActivityItem[] =
    (
      recentApplicationsResult.data as
        | ApplicationActivity[]
        | null
    )?.map(
      (application) => {
        const fullName =
          `${application.first_name || ""} ${
            application.last_name || ""
          }`.trim() ||
          "Boxer Applicant";

        return {
          id:
            `application-${application.id}`,

          type:
            "application",

          title:
            fullName,

          subtitle:
            "Boxer Application",

          created_at:
            application.created_at ||
            "",

          href:
            "/admin/applications",

          is_read:
            application.is_read,
        };
      }
    ) || [];

  const recentActivity =
    [
      ...contactActivity,
      ...applicationActivity,
    ]
      .filter(
        (item) =>
          Boolean(
            item.created_at
          )
      )
      .sort(
        (
          a,
          b
        ) =>
          new Date(
            b.created_at
          ).getTime() -
          new Date(
            a.created_at
          ).getTime()
      )
      .slice(
        0,
        8
      );

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

      {/* =====================================
          PAGE HEADER
          ===================================== */}
      <div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
              Operations Center
            </p>

            <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
              HBE Dashboard
            </h1>

            <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

            <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
              Manage Heritage Boxing Entertainment
              fighters, rankings, events, applications,
              inquiries, media and commercial operations.
            </p>

          </div>

          {/* TOTAL NOTIFICATION BOX */}
          <div
            className={`min-w-[210px] border p-5 ${
              totalUnread >
              0
                ? "border-red-200 bg-red-50"
                : "border-[#e2ddd5] bg-white"
            }`}
          >

            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#941f25]">
              New Submissions
            </p>

            <div className="mt-3 flex items-end gap-3">

              <p className="text-4xl font-black text-[#171717]">
                {
                  totalUnread
                }
              </p>

              {totalUnread >
                0 && (

                <span className="mb-1 inline-flex rounded-full bg-[#941f25] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                  Unread
                </span>

              )}

            </div>

            <p className="mt-3 text-sm leading-6 text-[#625d56]">
              Contact inquiries and boxer applications
              waiting to be reviewed.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================
          MAIN DASHBOARD CARDS
          ===================================== */}
      <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {cards.map(
          (card) => (

            <Link
              key={
                card.label
              }
              href={
                card.href
              }
              className="relative border border-[#e2ddd5] bg-white p-6 transition hover:border-[#c6a24a] hover:shadow-md"
            >

              {/* UNREAD BADGE */}
              {card.unread >
                0 && (

                <span className="absolute right-4 top-4 flex min-h-[28px] min-w-[28px] items-center justify-center rounded-full bg-[#941f25] px-2 text-xs font-black text-white">
                  {
                    card.unread
                  }
                </span>

              )}

              <p className="pr-10 text-xs font-black uppercase tracking-[0.16em] text-[#7c766e]">
                {
                  card.label
                }
              </p>

              <p className="mt-3 text-4xl font-black text-[#171717]">
                {
                  card.value
                }
              </p>

              {card.unread >
              0 ? (

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#941f25]">
                  {
                    card.unread
                  }{" "}
                  New
                </p>

              ) : (

                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#8a847c]">
                  No New Alerts
                </p>

              )}

              <p className="mt-5 text-sm font-black uppercase text-[#941f25]">
                Manage →
              </p>

            </Link>

          )
        )}

      </div>

      {/* =====================================
          NEW SUBMISSION SUMMARY
          ===================================== */}
      <section className="mt-10">

        <div className="flex items-end justify-between gap-5">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
              Notifications
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase text-[#171717]">
              New Submissions
            </h2>

          </div>

          {totalUnread >
            0 && (

            <span className="rounded-full bg-[#941f25] px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
              {
                totalUnread
              }{" "}
              New
            </span>

          )}

        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">

          {/* CONTACT NOTIFICATIONS */}
          <Link
            href="/admin/contacts"
            className="border border-[#e2ddd5] bg-white p-7 transition hover:border-[#c6a24a] hover:shadow-md"
          >

            <div className="flex items-start justify-between gap-5">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                  Website Leads
                </p>

                <h3 className="mt-3 text-2xl font-black uppercase">
                  Contact Inquiries
                </h3>

              </div>

              {unreadContacts >
                0 && (

                <span className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-full bg-[#941f25] px-3 text-sm font-black text-white">
                  {
                    unreadContacts
                  }
                </span>

              )}

            </div>

            <p className="mt-4 leading-7 text-[#625d56]">
              Review people, organizations and
              commercial partners contacting HBE
              through the website.
            </p>

            {unreadContacts >
            0 ? (

              <p className="mt-5 font-black uppercase text-[#941f25]">
                {
                  unreadContacts
                }{" "}
                New Inquiry
                {unreadContacts ===
                1
                  ? ""
                  : "ies"}
                {" "}→
              </p>

            ) : (

              <p className="mt-5 text-sm font-black uppercase text-green-700">
                All Contact Inquiries Reviewed
              </p>

            )}

          </Link>

          {/* APPLICATION NOTIFICATIONS */}
          <Link
            href="/admin/applications"
            className="border border-[#e2ddd5] bg-white p-7 transition hover:border-[#c6a24a] hover:shadow-md"
          >

            <div className="flex items-start justify-between gap-5">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                  Fighter Recruitment
                </p>

                <h3 className="mt-3 text-2xl font-black uppercase">
                  Boxer Applications
                </h3>

              </div>

              {unreadApplications >
                0 && (

                <span className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-full bg-[#941f25] px-3 text-sm font-black text-white">
                  {
                    unreadApplications
                  }
                </span>

              )}

            </div>

            <p className="mt-4 leading-7 text-[#625d56]">
              Review professional and debut fighters
              who apply to join or work with HBE.
            </p>

            {unreadApplications >
            0 ? (

              <p className="mt-5 font-black uppercase text-[#941f25]">
                {
                  unreadApplications
                }{" "}
                New Application
                {unreadApplications ===
                1
                  ? ""
                  : "s"}
                {" "}→
              </p>

            ) : (

              <p className="mt-5 text-sm font-black uppercase text-green-700">
                All Applications Reviewed
              </p>

            )}

          </Link>

        </div>

      </section>

      {/* =====================================
          RECENT ACTIVITY
          ===================================== */}
      <section className="mt-10">

        <div>

          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
            Activity Feed
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase text-[#171717]">
            Recent Activity
          </h2>

          <div className="mt-4 h-1 w-14 bg-[#c6a24a]" />

        </div>

        <div className="mt-6 overflow-hidden border border-[#e2ddd5] bg-white">

          {recentActivity.length >
          0 ? (

            recentActivity.map(
              (
                activity,
                index
              ) => (

                <Link
                  key={
                    activity.id
                  }
                  href={
                    activity.href
                  }
                  className={`flex flex-col gap-4 p-5 transition hover:bg-[#f7f4ef] sm:flex-row sm:items-center sm:justify-between ${
                    index !==
                    recentActivity.length -
                      1
                      ? "border-b border-[#eee9e2]"
                      : ""
                  }`}
                >

                  <div className="flex min-w-0 items-start gap-4">

                    {/* ACTIVITY ICON */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                        activity.type ===
                        "application"
                          ? "bg-[#fff4d6] text-[#8a6919]"
                          : "bg-red-50 text-[#941f25]"
                      }`}
                    >
                      {activity.type ===
                      "application"
                        ? "BA"
                        : "CI"}
                    </div>

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <p className="font-black uppercase text-[#171717]">
                          {
                            activity.title
                          }
                        </p>

                        {!activity.is_read && (

                          <span className="rounded-full bg-[#941f25] px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white">
                            New
                          </span>

                        )}

                      </div>

                      <p className="mt-1 text-sm font-semibold text-[#625d56]">
                        {
                          activity.subtitle
                        }
                      </p>

                    </div>

                  </div>

                  <p className="shrink-0 text-xs font-bold text-[#8a847c] sm:text-right">
                    {
                      formatDateTime(
                        activity.created_at
                      )
                    }
                  </p>

                </Link>

              )
            )

          ) : (

            <div className="p-7">

              <p className="font-bold text-[#625d56]">
                No recent activity found.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}