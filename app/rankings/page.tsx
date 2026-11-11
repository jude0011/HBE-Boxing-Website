import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

export const metadata: Metadata = {
  title: "HBE Boxing Rankings | Official Fighter Rankings",

  description:
    "View official Heritage Boxing Entertainment rankings, professional fighter records, ratings, KO statistics and championship pathways across HBE divisions.",

  alternates: {
    canonical: `${siteUrl}/rankings`,
  },

  openGraph: {
    type: "website",
    url: `${siteUrl}/rankings`,
    siteName: "Heritage Boxing Entertainment",
    title:
      "HBE Boxing Rankings | Official Fighter Rankings",
    description:
      "Follow official HBE fighter rankings, professional records, ratings and contenders progressing toward championship opportunities.",
    images: [
      {
        url: `${siteUrl}/images/rankings-hero.png`,
        alt:
          "Official Heritage Boxing Entertainment fighter rankings",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "HBE Boxing Rankings | Official Fighter Rankings",
    description:
      "Official HBE fighter rankings, records, ratings and championship pathways.",
    images: [
      `${siteUrl}/images/rankings-hero.png`,
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

type RankingRow = {
  id: string;
  boxer_id: string;
  ranking_position: number;
  ranking_points: number | null;
};

type BoxerRow = {
  id: string;

  first_name: string | null;
  last_name: string | null;
  nickname?: string | null;

  profile_slug?: string | null;
  photo_url?: string | null;

  wins?: number | null;
  losses?: number | null;
  draws?: number | null;

  knockout_wins?: number | null;
  knockout_losses?: number | null;

  bouts?: number | null;
  rounds?: number | null;
  ko_percentage?: number | null;

  stance?: string | null;

  nationality_code?: string | null;

  boxrec_id?: string | null;
  boxrec_rating_stars?: number | null;

  boxrec_world_rank?: number | null;
  boxrec_world_total?: number | null;

  boxrec_country_rank?: number | null;
  boxrec_country_total?: number | null;
};

function RatingStars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const star = index + 1;

        if (rating >= star) {
          return (
            <span
              key={index}
              className="text-2xl text-[#f2a900]"
            >
              ★
            </span>
          );
        }

        if (rating >= star - 0.5) {
          return (
            <span
              key={index}
              className="relative inline-block text-2xl text-[#d7d9dd]"
            >
              ★

              <span
                className="absolute left-0 top-0 w-1/2 overflow-hidden text-[#f2a900]"
                aria-hidden="true"
              >
                ★
              </span>
            </span>
          );
        }

        return (
          <span
            key={index}
            className="text-2xl text-[#d7d9dd]"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function countryFlag(
  code?: string | null
) {
  if (!code) {
    return "🌍";
  }

  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(
        127397 +
          char.charCodeAt(0)
      )
    );
}

export default async function RankingsPage() {
  const {
    data: rankingData,
    error: rankingError,
  } = await supabase
    .from("rankings")
    .select(`
      id,
      boxer_id,
      ranking_position,
      ranking_points
    `)
    .eq("published", true)
    .order(
      "ranking_position",
      {
        ascending: true,
      }
    );

  if (rankingError) {
    console.error(
      "HBE rankings error:",
      rankingError
    );
  }

  const rankings =
    (rankingData as RankingRow[]) ||
    [];

  const boxerIds =
    rankings
      .map(
        (ranking) =>
          ranking.boxer_id
      )
      .filter(Boolean);

  let boxers: BoxerRow[] = [];

  if (boxerIds.length > 0) {
    const {
      data: boxerData,
      error: boxerError,
    } = await supabase
      .from("boxers")
      .select("*")
      .in("id", boxerIds);

    if (boxerError) {
      console.error(
        "HBE boxers error:",
        boxerError
      );
    } else {
      boxers =
        (boxerData as BoxerRow[]) ||
        [];
    }
  }

  const rankedBoxers =
    rankings
      .map((ranking) => {
        const boxer =
          boxers.find(
            (fighter) =>
              fighter.id ===
              ranking.boxer_id
          );

        if (!boxer) {
          return null;
        }

        const fullName =
          `${boxer.first_name || ""} ${
            boxer.last_name || ""
          }`.trim();

        return {
          ranking,
          boxer,
          fullName,
        };
      })
      .filter(
        (
          item
        ): item is {
          ranking: RankingRow;
          boxer: BoxerRow;
          fullName: string;
        } => item !== null
      );

  /*
    RANKINGS PAGE SCHEMA
  */
  const rankingsPageSchema = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id":
      `${siteUrl}/rankings#webpage`,

    url:
      `${siteUrl}/rankings`,

    name:
      "HBE Boxing Rankings | Official Fighter Rankings",

    description:
      "Official Heritage Boxing Entertainment fighter rankings featuring professional records, ratings, knockout statistics and championship progression.",

    isPartOf: {
      "@id":
        `${siteUrl}/#website`,
    },

    about: {
      "@id":
        `${siteUrl}/#organization`,
    },

    primaryImageOfPage: {
      "@type": "ImageObject",

      url:
        `${siteUrl}/images/rankings-hero.png`,
    },

    inLanguage: "en",
  };

  /*
    RANKED FIGHTERS ITEM LIST
  */
  const rankingsListSchema = {
    "@context": "https://schema.org",

    "@type": "ItemList",

    name:
      "Official Heritage Boxing Entertainment Fighter Rankings",

    url:
      `${siteUrl}/rankings`,

    numberOfItems:
      rankedBoxers.length,

    itemListOrder:
      "https://schema.org/ItemListOrderAscending",

    itemListElement:
      rankedBoxers.map(
        (
          {
            ranking,
            boxer,
            fullName,
          },
          index
        ) => {
          const profileUrl =
            boxer.profile_slug
              ? `${siteUrl}/boxers/${boxer.profile_slug}`
              : undefined;

          return {
            "@type":
              "ListItem",

            position:
              ranking.ranking_position ||
              index + 1,

            name:
              fullName,

            url:
              profileUrl,

            item: {
              "@type":
                "Person",

              ...(profileUrl
                ? {
                    "@id":
                      `${profileUrl}#person`,
                  }
                : {}),

              name:
                fullName,

              url:
                profileUrl,

              image:
                boxer.photo_url ||
                undefined,

              alternateName:
                boxer.nickname ||
                undefined,

              jobTitle:
                "Professional Boxer",

              memberOf: {
                "@id":
                  `${siteUrl}/#organization`,
              },
            },
          };
        }
      ),
  };

  /*
    BREADCRUMB SCHEMA
  */
  const breadcrumbSchema = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

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
          "Rankings",

        item:
          `${siteUrl}/rankings`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171717]">

      {/* RANKINGS PAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              rankingsPageSchema
            ),
        }}
      />

      {/* RANKINGS LIST SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              rankingsListSchema
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
        className="relative isolate overflow-hidden bg-black bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/rankings-hero.png')",
        }}
      >

        {/* STANDARD 55% DARKNESS */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LIGHT SUPPORTING GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[520px] sm:items-center sm:px-6 sm:py-16 lg:min-h-[560px] lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#e0c273]">
              Official HBE Rankings
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-5xl md:text-6xl lg:text-7xl">
              The Road To The Title
            </h1>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/90 sm:text-lg">
              Follow Heritage Boxing
              Entertainment fighters,
              professional records and
              ranking performance as they
              move toward championship
              opportunities.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/boxers"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] sm:w-auto"
              >
                View HBE Fighters
              </Link>

              <Link
                href="/events"
                className="hbe-secondary-cta inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] sm:w-auto"
              >
                Upcoming Events
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* INTRO */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
            HBE Fighter Rankings
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase">
            Official Rankings
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <p className="mt-6 max-w-4xl leading-8 text-[#5f5b55]">
            HBE rankings combine
            official Heritage Boxing
            Entertainment positioning
            with professional fighter
            records and boxing ranking
            reference information.
          </p>

        </div>

      </section>

      {/* RANKINGS */}
      <section className="bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          {rankedBoxers.length > 0 ? (

            <div className="space-y-8">

              {rankedBoxers.map(
                ({
                  ranking,
                  boxer,
                  fullName,
                }) => {
                  const wins =
                    boxer.wins ?? 0;

                  const losses =
                    boxer.losses ?? 0;

                  const draws =
                    boxer.draws ?? 0;

                  const rating =
                    Number(
                      boxer.boxrec_rating_stars ??
                        0
                    );

                  return (

                    <article
                      key={
                        ranking.id
                      }
                      className="overflow-hidden border border-[#ded9d1] bg-white shadow-sm"
                    >

                      <div className="grid lg:grid-cols-[430px_1fr]">

                        {/* BOXER IMAGE */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ece8e2] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[650px]">

                          {boxer.photo_url ? (

                            <Image
                              src={
                                boxer.photo_url
                              }
                              alt={
                                `${fullName} ranked HBE professional boxer`
                              }
                              fill
                              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 430px"
                              className="object-contain object-center sm:object-cover sm:object-top lg:object-center"
                            />

                          ) : (

                            <div className="flex h-full min-h-[420px] items-center justify-center sm:min-h-[520px] lg:min-h-[650px]">

                              <p className="font-black uppercase tracking-widest text-[#8a847c]">
                                HBE Boxer
                              </p>

                            </div>

                          )}

                        </div>

                        {/* BOXER INFORMATION */}
                        <div className="p-6 sm:p-8 lg:p-10">

                          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                            <div>

                              <div className="mb-4 inline-flex items-center gap-2 bg-[#171717] px-4 py-2">

                                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#e0c273]">
                                  HBE Rank
                                </span>

                                <span className="text-xl font-black text-white">
                                  #
                                  {
                                    ranking.ranking_position
                                  }
                                </span>

                              </div>

                              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                                Professional Boxer
                              </p>

                              <h2 className="mt-2 text-3xl font-black uppercase leading-tight sm:text-4xl">
                                {
                                  fullName
                                }
                              </h2>

                              {boxer.nickname && (

                                <p className="mt-2 text-lg italic text-[#5f5b55]">
                                  &ldquo;
                                  {
                                    boxer.nickname
                                  }
                                  &rdquo;
                                </p>

                              )}

                            </div>

                            <div>

                              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#8a847c]">
                                Rating
                              </p>

                              <div className="mt-2">

                                <RatingStars
                                  rating={
                                    rating
                                  }
                                />

                              </div>

                            </div>

                          </div>

                          {/* RECORD */}
                          <div className="mt-8 max-w-[400px]">

                            <div className="flex overflow-hidden rounded-xl">

                              <div className="flex-1 border-r-2 border-white bg-[#078d13] px-4 py-3 text-center">

                                <p className="text-5xl font-black leading-none text-white">
                                  {wins}
                                </p>

                              </div>

                              <div className="flex-1 border-r-2 border-white bg-[#d10808] px-4 py-3 text-center">

                                <p className="text-5xl font-black leading-none text-white">
                                  {losses}
                                </p>

                              </div>

                              <div className="flex-1 bg-[#78a5ef] px-4 py-3 text-center">

                                <p className="text-5xl font-black leading-none text-white">
                                  {draws}
                                </p>

                              </div>

                            </div>

                            <div className="grid grid-cols-3 text-center">

                              <div className="pt-2">

                                <p className="text-base font-black text-[#078d13]">
                                  {
                                    boxer.knockout_wins ??
                                    0
                                  }{" "}
                                  KOs
                                </p>

                              </div>

                              <div className="pt-2">

                                <p className="text-base font-black text-[#d10808]">
                                  {
                                    boxer.knockout_losses ??
                                    0
                                  }{" "}
                                  KOs
                                </p>

                              </div>

                              <div />

                            </div>

                          </div>

                          {/* BOXING STATS */}
                          <div className="mt-9 grid gap-6 border-t border-[#ebe6df] pt-7 sm:grid-cols-2 lg:grid-cols-4">

                            <div>

                              <p className="text-xs font-black uppercase tracking-wider text-[#8a847c]">
                                Bouts
                              </p>

                              <p className="mt-1 text-xl font-black">
                                {
                                  boxer.bouts ??
                                  "—"
                                }
                              </p>

                            </div>

                            <div>

                              <p className="text-xs font-black uppercase tracking-wider text-[#8a847c]">
                                Rounds
                              </p>

                              <p className="mt-1 text-xl font-black">
                                {
                                  boxer.rounds ??
                                  "—"
                                }
                              </p>

                            </div>

                            <div>

                              <p className="text-xs font-black uppercase tracking-wider text-[#8a847c]">
                                KO %
                              </p>

                              <p className="mt-1 text-xl font-black">
                                {boxer.ko_percentage !==
                                  null &&
                                boxer.ko_percentage !==
                                  undefined
                                  ? `${boxer.ko_percentage}%`
                                  : "—"}
                              </p>

                            </div>

                            <div>

                              <p className="text-xs font-black uppercase tracking-wider text-[#8a847c]">
                                Stance
                              </p>

                              <p className="mt-1 text-xl font-black">
                                {
                                  boxer.stance ||
                                  "—"
                                }
                              </p>

                            </div>

                          </div>

                          {/* RANKING REFERENCE */}
                          <div className="mt-8 bg-[#f7f4ef] p-5 sm:p-6">

                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                              Professional Ranking Reference
                            </p>

                            <div className="mt-5 grid gap-6 sm:grid-cols-2">

                              <div>

                                <p className="text-xs font-black uppercase text-[#8a847c]">
                                  World Ratings
                                </p>

                                <p className="mt-1 text-2xl font-black">
                                  {boxer.boxrec_world_rank
                                    ? `#${boxer.boxrec_world_rank.toLocaleString()}`
                                    : "—"}

                                  {boxer.boxrec_world_total
                                    ? ` / ${boxer.boxrec_world_total.toLocaleString()}`
                                    : ""}
                                </p>

                              </div>

                              <div>

                                <div className="flex items-center gap-3">

                                  <span
                                    className="text-4xl"
                                    aria-label="Nationality"
                                  >
                                    {countryFlag(
                                      boxer.nationality_code
                                    )}
                                  </span>

                                  <p className="text-2xl font-black">
                                    {boxer.boxrec_country_rank
                                      ? `#${boxer.boxrec_country_rank}`
                                      : "—"}

                                    {boxer.boxrec_country_total
                                      ? ` / ${boxer.boxrec_country_total}`
                                      : ""}
                                  </p>

                                </div>

                              </div>

                            </div>

                          </div>

                          {boxer.profile_slug && (

                            <Link
                              href={`/boxers/${boxer.profile_slug}`}
                              className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] sm:w-auto"
                            >
                              View Fighter Profile
                            </Link>

                          )}

                        </div>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          ) : (

            <div className="border border-[#e5e0d8] bg-white p-10 text-center">

              <p className="text-xl font-black uppercase">
                HBE Rankings Are Being Updated
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}