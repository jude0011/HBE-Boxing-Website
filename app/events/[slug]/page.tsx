import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(
  date: string | null
) {
  if (!date) {
    return null;
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(
    parsedDate
  );
}

function formatDateTime(
  date: string | null
) {
  if (!date) {
    return null;
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(
    parsedDate
  );
}

/*
  DYNAMIC EVENT METADATA
*/
export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;

  const {
    data: event,
  } = await supabase
    .from("events")
    .select(`
      name,
      event_slug,
      event_date,
      venue,
      city,
      poster_url,
      hero_image_url,
      description,
      status
    `)
    .eq(
      "event_slug",
      slug
    )
    .maybeSingle();

  if (!event) {
    return {
      title: "HBE Event",

      description:
        "Heritage Boxing Entertainment professional boxing event.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const eventUrl =
    `${siteUrl}/events/${slug}`;

  const imageUrl =
    event.poster_url ||
    event.hero_image_url ||
    `${siteUrl}/images/events-hero.png`;

  const locationText = [
    event.venue,
    event.city,
  ]
    .filter(Boolean)
    .join(", ");

  const description =
    event.description ||
    `View ${event.name}, a Heritage Boxing Entertainment professional boxing event${locationText ? ` at ${locationText}` : ""}. Find event details, fight information and official results.`;

  return {
    title:
      `${event.name} | HBE Boxing Event`,

    description,

    alternates: {
      canonical:
        eventUrl,
    },

    openGraph: {
      type: "website",

      url:
        eventUrl,

      siteName:
        "Heritage Boxing Entertainment",

      title:
        `${event.name} | HBE Boxing Event`,

      description,

      images: [
        {
          url:
            imageUrl,

          alt:
            `${event.name} Heritage Boxing Entertainment boxing event`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${event.name} | HBE Boxing Event`,

      description,

      images: [
        imageUrl,
      ],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventPageProps) {
  const { slug } = await params;

  const {
    data: event,
    error,
  } = await supabase
    .from("events")
    .select("*")
    .eq(
      "event_slug",
      slug
    )
    .maybeSingle();

  if (error) {
    console.error(
      "Error loading event:",
      error
    );
  }

  if (!event) {
    notFound();
  }

  const isCompleted =
    event.status ===
    "completed";

  const hasOfficialResults =
    Boolean(
      event.results_summary ||
        event.main_event_winner ||
        event.main_event_loser ||
        event.result_method ||
        event.result_round !== null ||
        event.result_time ||
        event.result_notes
    );

  const eventDate =
    formatDate(
      event.event_date
    );

  const completedDate =
    formatDateTime(
      event.completed_at
    );

  const eventUrl =
    `${siteUrl}/events/${slug}`;

  const eventImage =
    event.poster_url ||
    event.hero_image_url ||
    `${siteUrl}/images/events-hero.png`;

  /*
    SPORTS EVENT SCHEMA
  */
  const eventSchema = {
    "@context":
      "https://schema.org",

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

    description:
      event.description ||
      undefined,

    startDate:
      event.event_date ||
      undefined,

    image:
      eventImage,

    eventStatus:
      event.status === "completed"
        ? "https://schema.org/EventCompleted"
        : event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : event.status === "postponed"
        ? "https://schema.org/EventPostponed"
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
              event.status === "completed"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
          }
        : undefined,

    performer:
      event.main_event_winner ||
      event.main_event_loser
        ? [
            ...(event.main_event_winner
              ? [
                  {
                    "@type":
                      "Person",

                    name:
                      event.main_event_winner,
                  },
                ]
              : []),

            ...(event.main_event_loser
              ? [
                  {
                    "@type":
                      "Person",

                    name:
                      event.main_event_loser,
                  },
                ]
              : []),
          ]
        : undefined,
  };

  /*
    WEBPAGE SCHEMA
  */
  const eventPageSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "WebPage",

    "@id":
      `${eventUrl}#webpage`,

    url:
      eventUrl,

    name:
      `${event.name} | HBE Boxing Event`,

    description:
      event.description ||
      `Official event page for ${event.name} from Heritage Boxing Entertainment.`,

    isPartOf: {
      "@id":
        `${siteUrl}/#website`,
    },

    about: {
      "@id":
        `${eventUrl}#event`,
    },

    primaryImageOfPage: {
      "@type":
        "ImageObject",

      url:
        eventImage,
    },

    inLanguage:
      "en",
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
      {
        "@type":
          "ListItem",

        position: 3,

        name:
          event.name,

        item:
          eventUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171717]">

      {/* SPORTS EVENT SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              eventSchema
            ),
        }}
      />

      {/* EVENT PAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              eventPageSchema
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

      {/* EVENT HERO / INTRO */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <Link
            href="/events"
            className="inline-flex items-center text-sm font-black uppercase tracking-wide text-[#171717] transition hover:text-[#941f25]"
          >
            ← Back To Events
          </Link>

          <div className="mt-10 max-w-4xl">

            <div className="flex flex-wrap items-center gap-3">

              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
                HBE Event
              </p>

              {isCompleted && (

                <span className="bg-[#171717] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Completed
                </span>

              )}

            </div>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-[#171717] sm:text-5xl lg:text-6xl">
              {event.name}
            </h1>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

            {/* EVENT DETAILS */}
            <div className="mt-7 border border-[#e5e0d8] bg-[#f7f4ef] p-6 sm:p-8">

              {eventDate && (

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
                    Event Date
                  </p>

                  <p className="mt-2 text-lg font-black text-[#171717]">
                    {eventDate}
                  </p>

                </div>

              )}

              {(event.venue ||
                event.city) && (

                <div className="mt-5 border-t border-[#ddd7ce] pt-5">

                  {event.venue && (

                    <p className="text-[#5f5b55]">
                      <span className="font-black text-[#171717]">
                        Venue:
                      </span>{" "}
                      {event.venue}
                    </p>

                  )}

                  {event.city && (

                    <p className="mt-2 text-[#5f5b55]">
                      <span className="font-black text-[#171717]">
                        City:
                      </span>{" "}
                      {event.city}
                    </p>

                  )}

                </div>

              )}

            </div>

            {event.description && (

              <div className="mt-8 max-w-3xl">

                <p className="whitespace-pre-line text-base leading-8 text-[#5f5b55] sm:text-lg">
                  {event.description}
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* OFFICIAL RESULTS */}
      {isCompleted &&
        hasOfficialResults && (

          <section className="border-y border-[#e2ddd5] bg-[#f7f4ef]">

            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

              <div className="max-w-5xl">

                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
                  Fight Night
                </p>

                <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
                  Official Results
                </h2>

                <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

                {/* MAIN EVENT RESULT */}
                {(event.main_event_winner ||
                  event.main_event_loser ||
                  event.result_method) && (

                  <div className="mt-10 border border-[#e2ddd5] border-t-4 border-t-[#c6a24a] bg-white p-6 sm:p-8">

                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                      Main Event
                    </p>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">

                      {event.main_event_winner && (

                        <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-5">

                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a847c]">
                            Winner
                          </p>

                          <p className="mt-2 text-2xl font-black uppercase leading-tight text-[#171717]">
                            {
                              event.main_event_winner
                            }
                          </p>

                        </div>

                      )}

                      {event.main_event_loser && (

                        <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-5">

                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a847c]">
                            Opponent
                          </p>

                          <p className="mt-2 text-2xl font-black uppercase leading-tight text-[#171717]">
                            {
                              event.main_event_loser
                            }
                          </p>

                        </div>

                      )}

                    </div>

                    <div className="mt-6 grid gap-4 border-t border-[#ddd7ce] pt-6 sm:grid-cols-3">

                      {event.result_method && (

                        <div>

                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a847c]">
                            Method
                          </p>

                          <p className="mt-2 font-black text-[#171717]">
                            {
                              event.result_method
                            }
                          </p>

                        </div>

                      )}

                      {event.result_round !==
                        null &&
                        event.result_round !==
                          undefined && (

                          <div>

                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a847c]">
                              Round
                            </p>

                            <p className="mt-2 font-black text-[#171717]">
                              {
                                event.result_round
                              }
                            </p>

                          </div>

                        )}

                      {event.result_time && (

                        <div>

                          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a847c]">
                            Time
                          </p>

                          <p className="mt-2 font-black text-[#171717]">
                            {
                              event.result_time
                            }
                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                )}

                {/* RESULTS SUMMARY */}
                {event.results_summary && (

                  <div className="mt-10 border border-[#e5e0d8] bg-white p-6 sm:p-8">

                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                      Event Summary
                    </p>

                    <p className="mt-5 max-w-4xl whitespace-pre-line leading-8 text-[#5f5b55]">
                      {
                        event.results_summary
                      }
                    </p>

                  </div>

                )}

                {/* RESULT NOTES */}
                {event.result_notes && (

                  <div className="mt-8 border-l-4 border-[#c6a24a] bg-white p-6 sm:p-8">

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
                      Result Notes
                    </p>

                    <p className="mt-4 whitespace-pre-line leading-8 text-[#5f5b55]">
                      {
                        event.result_notes
                      }
                    </p>

                  </div>

                )}

                {/* COMPLETED DATE */}
                {completedDate && (

                  <p className="mt-8 text-sm font-semibold text-[#8a847c]">
                    Results finalized{" "}
                    {completedDate}
                  </p>

                )}

              </div>

            </div>

          </section>

        )}

      {/* BOTTOM NAVIGATION */}
      <section className="border-t border-[#e5e0d8] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/events"
              className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
            >
              View All Events
            </Link>

            <Link
              href="/media"
              className="inline-flex min-h-[52px] w-full items-center justify-center border-2 border-[#171717] bg-transparent px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:!border-[#171717] hover:!bg-[#171717] hover:!text-white focus:!border-[#171717] focus:!bg-[#171717] focus:!text-white active:!border-[#171717] active:!bg-[#171717] active:!text-white sm:w-auto"
            >
              HBE Media
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}