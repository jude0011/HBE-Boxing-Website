import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

export const metadata: Metadata = {
  title: "HBE Boxing Events | Fight Nights & Championships",

  description:
    "Explore upcoming Heritage Boxing Entertainment fight nights, championship boxing events, venues, tickets, broadcast information and official event results.",

  alternates: {
    canonical: `${siteUrl}/events`,
  },

  openGraph: {
    type: "website",
    url: `${siteUrl}/events`,
    siteName: "Heritage Boxing Entertainment",
    title:
      "HBE Boxing Events | Fight Nights & Championships",
    description:
      "Explore upcoming HBE boxing events, championship fight nights, venues, tickets and the official Heritage Boxing Entertainment event archive.",
    images: [
      {
        url: `${siteUrl}/images/events-hero.png`,
        alt:
          "Heritage Boxing Entertainment professional boxing events and fight nights",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "HBE Boxing Events | Fight Nights & Championships",
    description:
      "Upcoming HBE fight nights, championship boxing events, tickets and event results.",
    images: [
      `${siteUrl}/images/events-hero.png`,
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

type EventRow = {
  id: string;
  name: string;
  event_slug: string | null;
  event_date: string | null;
  venue: string | null;
  city: string | null;
  poster_url: string | null;
  hero_image_url: string | null;
  description: string | null;
  status: string | null;
  ticket_url: string | null;
  broadcast_url: string | null;
};

function formatEventDate(date: string | null) {
  if (!date) {
    return "Date to be confirmed";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function EventsPage() {
  const {
    data: eventData,
    error,
  } = await supabase
    .from("events")
    .select(`
      id,
      name,
      event_slug,
      event_date,
      venue,
      city,
      poster_url,
      hero_image_url,
      description,
      status,
      ticket_url,
      broadcast_url
    `)
    .order("event_date", {
      ascending: false,
      nullsFirst: false,
    });

  if (error) {
    console.error(
      "Error loading HBE events:",
      error
    );
  }

  const events =
    (eventData as EventRow[]) || [];

  const upcomingEvents =
    events.filter(
      (event) =>
        event.status === "upcoming"
    );

  const previousEvents =
    events.filter(
      (event) =>
        event.status === "completed"
    );

  /*
    EVENTS PAGE SCHEMA
  */
  const eventsPageSchema = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id":
      `${siteUrl}/events#webpage`,

    url:
      `${siteUrl}/events`,

    name:
      "HBE Boxing Events | Fight Nights & Championships",

    description:
      "Official Heritage Boxing Entertainment event directory featuring upcoming professional fight nights, championship boxing events and previous HBE events.",

    isPartOf: {
      "@id":
        `${siteUrl}/#website`,
    },

    about: {
      "@id":
        `${siteUrl}/#organization`,
    },

    primaryImageOfPage: {
      "@type":
        "ImageObject",

      url:
        `${siteUrl}/images/events-hero.png`,
    },

    inLanguage: "en",
  };

  /*
    EVENT ITEM LIST

    This tells search engines which
    individual event pages belong to
    the HBE events directory.
  */
  const eventListSchema = {
    "@context": "https://schema.org",

    "@type": "ItemList",

    name:
      "Heritage Boxing Entertainment Boxing Events",

    url:
      `${siteUrl}/events`,

    numberOfItems:
      events.filter(
        (event) =>
          event.event_slug
      ).length,

    itemListElement:
      events
        .filter(
          (event) =>
            event.event_slug
        )
        .map(
          (event, index) => {
            const eventUrl =
              `${siteUrl}/events/${event.event_slug}`;

            return {
              "@type":
                "ListItem",

              position:
                index + 1,

              name:
                event.name,

              url:
                eventUrl,

              item: {
                "@type":
                  "SportsEvent",

                "@id":
                  `${eventUrl}#event`,

                name:
                  event.name,

                url:
                  eventUrl,

                sport:
                  "Boxing",

                startDate:
                  event.event_date ||
                  undefined,

                description:
                  event.description ||
                  undefined,

                image:
                  event.poster_url ||
                  event.hero_image_url ||
                  undefined,

                eventStatus:
                  event.status ===
                  "completed"
                    ? "https://schema.org/EventCompleted"
                    : event.status ===
                      "cancelled"
                    ? "https://schema.org/EventCancelled"
                    : "https://schema.org/EventScheduled",

                organizer: {
                  "@id":
                    `${siteUrl}/#organization`,
                },

                location:
                  event.venue ||
                  event.city
                    ? {
                        "@type":
                          "Place",

                        name:
                          event.venue ||
                          event.city ||
                          undefined,

                        address:
                          event.city
                            ? {
                                "@type":
                                  "PostalAddress",

                                addressLocality:
                                  event.city,
                              }
                            : undefined,
                      }
                    : undefined,

                offers:
                  event.ticket_url
                    ? {
                        "@type":
                          "Offer",

                        url:
                          event.ticket_url,

                        availability:
                          event.status ===
                          "completed"
                            ? "https://schema.org/SoldOut"
                            : "https://schema.org/InStock",
                      }
                    : undefined,
              },
            };
          }
        ),
  };

  /*
    BREADCRUMB SCHEMA
  */
  const breadcrumbSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position: 1,

        name:
          "Home",

        item:
          siteUrl,
      },
      {
        "@type":
          "ListItem",

        position: 2,

        name:
          "Events",

        item:
          `${siteUrl}/events`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171717]">

      {/* EVENTS PAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              eventsPageSchema
            ),
        }}
      />

      {/* EVENT LIST SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              eventListSchema
            ),
        }}
      />

      {/* BREADCRUMB SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbSchema
            ),
        }}
      />

      {/* HERO */}
      <section
        className="relative isolate overflow-hidden bg-cover bg-[position:70%_center] bg-no-repeat sm:bg-center"
        style={{
          backgroundImage:
            "url('/images/events-hero.png')",
        }}
      >

        {/* STANDARD 55% DARKNESS */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LIGHT SUPPORTING GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[560px] sm:items-center sm:px-6 sm:py-16 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e0c273] sm:text-sm">
              HBE Fight Nights
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              HBE Events
            </h1>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/95 sm:text-xl">
              Upcoming championships, professional fight nights and
              the official Heritage Boxing Entertainment event archive.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="#upcoming-events"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                Upcoming Events
              </Link>

              <Link
                href="#past-events"
                className="hbe-secondary-cta inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] active:border-[#171717] active:bg-[#171717] active:text-white sm:w-auto"
              >
                Event Archive
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* INTRO */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
            HBE Event Experience
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
            Fight Nights. Championships. History.
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            Explore upcoming Heritage Boxing Entertainment events and
            revisit past championship nights, featured bouts and major
            moments from the HBE event archive.
          </p>

        </div>

      </section>

      {/* UPCOMING EVENTS */}
      <section
        id="upcoming-events"
        className="scroll-mt-24 bg-[#f7f4ef]"
      >

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="mb-10">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
              What&apos;s Next
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
              Upcoming Events
            </h2>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          </div>

          {upcomingEvents.length > 0 ? (

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

              {upcomingEvents.map((event) => (

                <article
                  key={event.id}
                  className="overflow-hidden bg-white shadow-lg ring-1 ring-black/5"
                >

                  {/* EVENT POSTER */}
                  <div className="relative min-h-[360px] overflow-hidden bg-[#171717] sm:min-h-[440px]">

                    {event.poster_url ? (

                      <Image
                        src={
                          event.poster_url
                        }
                        alt={`${event.name} Heritage Boxing Entertainment event poster`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain p-4"
                      />

                    ) : (

                      <div className="flex min-h-[360px] items-center justify-center px-6 text-center text-white/50 sm:min-h-[440px]">
                        Event poster coming soon
                      </div>

                    )}

                  </div>

                  <div className="p-6 sm:p-8">

                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                      Upcoming HBE Event
                    </p>

                    <h3 className="mt-3 text-2xl font-black uppercase leading-tight sm:text-3xl">
                      {event.name}
                    </h3>

                    <div className="mt-5 space-y-2 text-[#5f5b55]">

                      <p>
                        <span className="font-black text-[#171717]">
                          Date:
                        </span>{" "}
                        {formatEventDate(
                          event.event_date
                        )}
                      </p>

                      {event.venue && (

                        <p>
                          <span className="font-black text-[#171717]">
                            Venue:
                          </span>{" "}
                          {event.venue}
                        </p>

                      )}

                      {event.city && (

                        <p>
                          <span className="font-black text-[#171717]">
                            City:
                          </span>{" "}
                          {event.city}
                        </p>

                      )}

                    </div>

                    {event.description && (

                      <p className="mt-5 leading-7 text-[#5f5b55]">
                        {event.description}
                      </p>

                    )}

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                      {event.event_slug && (

                        <Link
                          href={`/events/${event.event_slug}`}
                          className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
                        >
                          Event Details
                        </Link>

                      )}

                      {event.ticket_url && (

                        <a
                          href={
                            event.ticket_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[52px] w-full items-center justify-center border-2 border-[#171717] bg-transparent px-6 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:!border-[#171717] hover:!bg-[#171717] hover:!text-white focus:!border-[#171717] focus:!bg-[#171717] focus:!text-white active:!border-[#171717] active:!bg-[#171717] active:!text-white sm:w-auto"
                        >
                          Tickets
                        </a>

                      )}

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="border border-[#e3ddd4] border-t-4 border-t-[#c6a24a] bg-white p-8 text-center sm:p-12">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
                Coming Soon
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase sm:text-3xl">
                New HBE Events Will Be Announced Soon
              </h3>

              <p className="mx-auto mt-4 max-w-5xl text-base leading-8 text-[#5f5b55] lg:whitespace-nowrap lg:text-lg">
                Stay connected for upcoming championship bouts, professional fight nights and international HBE boxing events.
              </p>

              <Link
                href="/media"
                className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                Follow HBE Media
              </Link>

            </div>

          )}

        </div>

      </section>

      {/* PAST EVENTS */}
      <section
        id="past-events"
        className="scroll-mt-24 bg-white"
      >

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="mb-10">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
              HBE Event Archive
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
              Previous Events
            </h2>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          </div>

          {previousEvents.length > 0 ? (

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {previousEvents.map((event) => (

                <article
                  key={event.id}
                  className="overflow-hidden bg-[#f7f4ef] shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* EVENT POSTER */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#171717]">

                    {event.poster_url ? (

                      <Image
                        src={
                          event.poster_url
                        }
                        alt={`${event.name} Heritage Boxing Entertainment event poster`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-3"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center px-6 text-center text-white/50">
                        Event poster coming soon
                      </div>

                    )}

                  </div>

                  <div className="p-6">

                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                      Completed Event
                    </p>

                    <h3 className="mt-3 text-xl font-black uppercase leading-tight">
                      {event.name}
                    </h3>

                    <div className="mt-5 space-y-2 text-sm text-[#5f5b55]">

                      <p>
                        <span className="font-black text-[#171717]">
                          Date:
                        </span>{" "}
                        {formatEventDate(
                          event.event_date
                        )}
                      </p>

                      {event.venue && (

                        <p>
                          <span className="font-black text-[#171717]">
                            Venue:
                          </span>{" "}
                          {event.venue}
                        </p>

                      )}

                      {event.city && (

                        <p>
                          <span className="font-black text-[#171717]">
                            City:
                          </span>{" "}
                          {event.city}
                        </p>

                      )}

                    </div>

                    {event.event_slug && (

                      <Link
                        href={`/events/${event.event_slug}`}
                        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
                      >
                        View Event
                      </Link>

                    )}

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-10 text-center">

              <p className="font-bold text-[#5f5b55]">
                HBE event archive is being updated.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* BOTTOM SECTION */}
      <section className="border-t border-[#e5e0d8] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
                Heritage Boxing Entertainment
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
                Building Boxing History
              </h2>

              <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

              <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
                HBE events bring together professional fighters,
                championship opportunities and boxing fans across
                Africa and the international boxing community.
              </p>

            </div>

            {/* CONSISTENT IVORY CARD */}
            <div className="border border-[#e1dbd2] border-t-4 border-t-[#c6a24a] bg-[#f7f4ef] p-7 sm:p-9">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Event Updates
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase">
                Stay Connected
              </h3>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                New fight nights, championship events, ticket details
                and broadcast information will be added as they are
                officially announced.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}