import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

export const metadata: Metadata = {
  title: "HBE Champions | Boxing Titleholders",

  description:
    "Meet Heritage Boxing Entertainment champions and official HBE titleholders, including championship records, divisions, title dates and professional fighter profiles.",

  alternates: {
    canonical: `${siteUrl}/champions`,
  },

  openGraph: {
    type: "website",
    url: `${siteUrl}/champions`,
    siteName: "Heritage Boxing Entertainment",
    title: "HBE Champions | Boxing Titleholders",
    description:
      "Meet official Heritage Boxing Entertainment champions, titleholders and championship fighters across HBE divisions.",
    images: [
      {
        url: `${siteUrl}/images/champions-hero.png`,
        alt:
          "Heritage Boxing Entertainment champions and boxing titleholders",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "HBE Champions | Boxing Titleholders",
    description:
      "Meet official HBE champions, championship titleholders and professional fighters.",
    images: [
      `${siteUrl}/images/champions-hero.png`,
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

type TitleRelation = {
  name: string | null;
};

type BoxerRelation = {
  id: string;
};

type TitleReignRow = {
  id: string;
  boxer_id: string;
  won_date: string | null;
  ended_date: string | null;
  current_champion: boolean | null;
  title_defenses: number | null;
  won_by: string | null;
  opponent_name: string | null;
  event_name: string | null;
  location: string | null;
  notes: string | null;
  titles: TitleRelation | null;
  boxers: BoxerRelation | null;
};

type BoxerProfile = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  nickname?: string | null;
  photo_url?: string | null;
  profile_slug?: string | null;

  wins?: number | null;
  losses?: number | null;
  draws?: number | null;
  record?: string | null;

  country_name?: string | null;
  country?: string | null;

  division_name?: string | null;
  division?: string | null;

  state_region?: string | null;
  hometown?: string | null;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default async function ChampionsPage() {
  /*
    STEP 1:
    GET ALL CURRENT HBE TITLE REIGNS
  */
  const {
    data: reignData,
    error: reignError,
  } =
    await supabase
      .from("title_reigns")
      .select(`
        id,
        boxer_id,
        won_date,
        ended_date,
        current_champion,
        title_defenses,
        won_by,
        opponent_name,
        event_name,
        location,
        notes,
        titles (
          name
        ),
        boxers (
          id
        )
      `)
      .eq("current_champion", true);

  if (reignError) {
    console.error(
      "Error loading HBE champions:",
      reignError
    );
  }

  const reigns =
    (reignData as unknown as TitleReignRow[]) || [];

  /*
    STEP 2:
    GET THE EXISTING BOXER PROFILES
  */
  const boxerIds = reigns
    .map((reign) => reign.boxer_id)
    .filter(Boolean);

  let boxerProfiles: BoxerProfile[] = [];

  if (boxerIds.length > 0) {
    const {
      data: profileData,
      error: profileError,
    } = await supabase
      .from("boxer_profiles")
      .select("*")
      .in("id", boxerIds);

    if (profileError) {
      console.error(
        "Error loading champion boxer profiles:",
        profileError
      );
    } else {
      boxerProfiles =
        (profileData as BoxerProfile[]) || [];
    }
  }

  /*
    STEP 3:
    COMBINE THE CHAMPIONSHIP RECORD
    WITH THE EXISTING BOXER PROFILE
  */
  const champions = reigns
    .map((reign) => {
      const boxer = boxerProfiles.find(
        (profile) =>
          profile.id === reign.boxer_id
      );

      if (!boxer) {
        return null;
      }

      return {
        ...reign,
        boxer,
      };
    })
    .filter(
      (
        champion
      ): champion is TitleReignRow & {
        boxer: BoxerProfile;
      } => champion !== null
    );

  /*
    CHAMPIONS PAGE SCHEMA
  */
  const championsPageSchema = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id":
      `${siteUrl}/champions#webpage`,

    url:
      `${siteUrl}/champions`,

    name:
      "HBE Champions | Boxing Titleholders",

    description:
      "Official Heritage Boxing Entertainment champions and titleholders across HBE championship divisions.",

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
        `${siteUrl}/images/champions-hero.png`,
    },

    inLanguage: "en",
  };

  /*
    CHAMPIONS ITEM LIST
  */
  const championsListSchema = {
    "@context": "https://schema.org",

    "@type": "ItemList",

    name:
      "Current Heritage Boxing Entertainment Champions",

    url:
      `${siteUrl}/champions`,

    numberOfItems:
      champions.length,

    itemListElement:
      champions.map(
        (champion, index) => {
          const boxer =
            champion.boxer;

          const fullName =
            boxer.full_name ||
            `${boxer.first_name || ""} ${
              boxer.last_name || ""
            }`.trim();

          const boxerUrl =
            boxer.profile_slug
              ? `${siteUrl}/boxers/${boxer.profile_slug}`
              : undefined;

          const titleName =
            champion.titles?.name ||
            "HBE Championship";

          return {
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              `${fullName} - ${titleName}`,

            url:
              boxerUrl,

            item: {
              "@type":
                "Person",

              ...(boxerUrl
                ? {
                    "@id":
                      `${boxerUrl}#person`,
                  }
                : {}),

              name:
                fullName,

              alternateName:
                boxer.nickname ||
                undefined,

              url:
                boxerUrl,

              image:
                boxer.photo_url ||
                undefined,

              jobTitle:
                "Professional Boxer",

              memberOf: {
                "@id":
                  `${siteUrl}/#organization`,
              },

              award:
                titleName,
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
          "Champions",

        item:
          `${siteUrl}/champions`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171717]">

      {/* CHAMPIONS PAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              championsPageSchema
            ),
        }}
      />

      {/* CHAMPIONS LIST SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              championsListSchema
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
        className="relative isolate overflow-hidden bg-cover bg-[position:68%_center] bg-no-repeat sm:bg-center"
        style={{
          backgroundImage:
            "url('/images/champions-hero.png')",
        }}
      >

        {/* STANDARD 55% DARKNESS */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LIGHT SUPPORTING GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[560px] sm:items-center sm:px-6 sm:py-16 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e0c273] sm:text-sm">
              HBE Championships
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              HBE Champions
            </h1>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/95 sm:text-xl">
              Meet the fighters who hold Heritage Boxing
              Entertainment championship titles and represent
              excellence in professional boxing across Africa
              and the international stage.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/rankings"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                View Rankings
              </Link>

              <Link
                href="/boxers"
                className="hbe-secondary-cta inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] active:border-[#171717] active:bg-[#171717] active:text-white sm:w-auto"
              >
                View Boxers
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* INTRO */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
                Championship Recognition
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-[#171717] sm:text-4xl lg:text-5xl">
                Honoring The Best In HBE Boxing
              </h2>

              <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

              <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
                HBE champions represent the highest standard
                of competition within Heritage Boxing
                Entertainment. These titleholders reflect
                discipline, talent, preparation and
                championship-level performance.
              </p>

              <p className="mt-5 max-w-3xl text-base leading-8 text-[#6f6962]">
                As HBE continues to grow across Africa and
                internationally, this page showcases official
                titleholders across divisions and celebrates
                fighters who earn championship status.
              </p>

            </div>

            <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-8 sm:p-10">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                HBE Vision
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase text-[#171717]">
                Africa To The World
              </h3>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <p className="mt-5 leading-8 text-[#5f5b55]">
                HBE is building a championship platform
                designed to elevate fighters, titles,
                rankings and boxing visibility across Africa
                while creating international recognition and
                opportunity.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CURRENT CHAMPIONS */}
      <section className="bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
            Current Titleholders
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase text-[#171717] sm:text-4xl lg:text-5xl">
            HBE Champions
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            Meet the current championship titleholders
            recognized by Heritage Boxing Entertainment.
          </p>

          {/* NO CHAMPIONS */}
          {champions.length === 0 ? (

            <div className="mt-12 border border-[#e5e0d8] bg-white p-8 sm:p-10">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                HBE Championship Roster
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase text-[#171717]">
                Champion Profiles Coming Soon
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f6962] sm:text-base">
                Official HBE championship records are being
                added and verified.
              </p>

            </div>

          ) : (

            /* CHAMPION CARDS */
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {champions.map((champion) => {
                const boxer = champion.boxer;

                const fullName =
                  boxer.full_name ||
                  `${boxer.first_name || ""} ${
                    boxer.last_name || ""
                  }`.trim();

                const division =
                  boxer.division_name ||
                  boxer.division ||
                  null;

                const country =
                  boxer.country_name ||
                  boxer.country ||
                  null;

                const record =
                  boxer.record ||
                  `${boxer.wins ?? 0}-${
                    boxer.losses ?? 0
                  }-${boxer.draws ?? 0}`;

                const titleName =
                  champion.titles?.name ||
                  "HBE Championship";

                return (
                  <article
                    key={champion.id}
                    className="overflow-hidden border border-[#e5e0d8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* BOXER PHOTO */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e1d8]">

                      {boxer.photo_url ? (

                        <Image
                          src={boxer.photo_url}
                          alt={`${fullName} HBE boxing champion`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain object-center transition duration-500 hover:scale-[1.03] sm:object-cover sm:object-top lg:object-center"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center px-6 text-center">

                          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8a847c]">
                            HBE Champion
                          </p>

                        </div>

                      )}

                      {/* CHAMPION LABEL */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pb-5 pt-20">

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e0c273]">
                          Current Champion
                        </p>

                      </div>

                    </div>

                    {/* CHAMPION INFORMATION */}
                    <div className="p-7">

                      <p className="text-xs font-black uppercase leading-5 tracking-[0.18em] text-[#941f25]">
                        {titleName}
                      </p>

                      <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-[#171717]">
                        {fullName}
                      </h3>

                      {boxer.nickname && (
                        <p className="mt-2 text-sm font-semibold text-[#7a746d]">
                          &ldquo;{boxer.nickname}&rdquo;
                        </p>
                      )}

                      <div className="mt-5 border-t border-[#eee9e2] pt-5">

                        <div className="space-y-2">

                          {division && (
                            <p className="text-sm text-[#5f5b55]">
                              <span className="font-bold text-[#171717]">
                                Division:
                              </span>{" "}
                              {division}
                            </p>
                          )}

                          {country && (
                            <p className="text-sm text-[#5f5b55]">
                              <span className="font-bold text-[#171717]">
                                Country:
                              </span>{" "}
                              {country}
                            </p>
                          )}

                          <p className="text-sm text-[#5f5b55]">
                            <span className="font-bold text-[#171717]">
                              Record:
                            </span>{" "}
                            {record}
                          </p>

                          {champion.won_date && (
                            <p className="text-sm text-[#5f5b55]">
                              <span className="font-bold text-[#171717]">
                                Title Won:
                              </span>{" "}
                              {formatDate(
                                champion.won_date
                              )}
                            </p>
                          )}

                        </div>

                      </div>

                      {!champion.won_date && (
                        <p className="mt-5 text-xs leading-6 text-[#817b73]">
                          Additional championship information
                          will be added as official records are
                          verified.
                        </p>
                      )}

                      {boxer.profile_slug && (

                        <Link
                          href={`/boxers/${boxer.profile_slug}`}
                          className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
                        >
                          View Fighter Profile
                        </Link>

                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>

      </section>

      {/* CTA */}
      <section className="border-t border-[#e5e0d8] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-[#f7f4ef] p-8 sm:p-10 lg:p-12">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
              HBE Platform
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-[#171717] sm:text-4xl lg:text-5xl">
              Follow The Rise Of HBE Champions
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
              Stay connected with HBE championship
              developments, boxer profiles, rankings, fight
              events and the continuing growth of
              professional boxing across Africa and beyond.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/boxers"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                Explore Boxers
              </Link>

              <Link
                href="/events"
                className="inline-flex min-h-[52px] w-full items-center justify-center border-2 border-[#171717] bg-transparent px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:!border-[#171717] hover:!bg-[#171717] hover:!text-white focus:!border-[#171717] focus:!bg-[#171717] focus:!text-white active:!border-[#171717] active:!bg-[#171717] active:!text-white sm:w-auto"
              >
                View Events
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}