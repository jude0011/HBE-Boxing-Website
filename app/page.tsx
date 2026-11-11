import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

export const metadata: Metadata = {
  title:
    "Heritage Boxing Entertainment | Professional Boxing Across Africa",

  description:
    "Heritage Boxing Entertainment promotes professional fighters, championship boxing, rankings, events, media and partnerships across Africa and international markets.",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName:
      "Heritage Boxing Entertainment",
    title:
      "Heritage Boxing Entertainment | Professional Boxing Across Africa",
    description:
      "Advancing championship boxing, developing fighters and connecting professional boxing communities across Africa and the world.",
    images: [
      {
        url: `${siteUrl}/images/hbe-hero-pro.png`,
        alt:
          "Heritage Boxing Entertainment professional boxing across Africa",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Heritage Boxing Entertainment | Professional Boxing Across Africa",
    description:
      "Professional fighters, championship boxing, rankings, events and media across Africa and international markets.",
    images: [
      `${siteUrl}/images/hbe-hero-pro.png`,
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

type TitleReignRow = {
  id: string;
  boxer_id: string;
  titles: TitleRelation | null;
};

type BoxerProfile = {
  id: string;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  nickname?: string | null;
  photo_url?: string | null;
  profile_slug?: string | null;

  record?: string | null;
  wins?: number | null;
  losses?: number | null;
  draws?: number | null;

  division?: string | null;
  division_name?: string | null;

  country?: string | null;
  country_name?: string | null;

  state_region?: string | null;
};

type HomepageRankingRow = {
  id: string;
  boxer_id: string;
  ranking_position: number;
  published: boolean | null;
};

type HomepageRankingBoxer = {
  id: string;

  first_name?: string | null;
  last_name?: string | null;

  wins?: number | null;
  losses?: number | null;
  draws?: number | null;

  knockout_wins?: number | null;
  knockout_losses?: number | null;

  boxrec_rating_stars?: number | null;
};

const featuredMedia = [
  {
    title: "HBE Interview",
    label: "Exclusive Interview",
    videoId: "8GvBQWKmOu8",
    description:
      "Exclusive boxing conversation with Coach Oye Poku and manager Yemisi Daniel.",
  },
  {
    title: "Fight Highlights",
    label: "Inside The Ring",
    videoId: "gI6lndoPfOY",
    description:
      "Watch professional boxing action, competition and memorable moments from inside the ring.",
  },
  {
    title: "Behind The Scenes",
    label: "Inside HBE",
    videoId: "_JtJeH5M-6w",
    description:
      "Go behind the scenes with training, preparation and the work that happens around professional boxing.",
  },
];

function RatingStars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const star = index + 1;

        if (rating >= star) {
          return (
            <span
              key={index}
              className="text-xl text-[#f2a900] sm:text-2xl"
            >
              ★
            </span>
          );
        }

        if (rating >= star - 0.5) {
          return (
            <span
              key={index}
              className="relative inline-block text-xl text-[#d7d9dd] sm:text-2xl"
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
            className="text-xl text-[#d7d9dd] sm:text-2xl"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default async function Home() {
  /*
    GET CURRENT HBE CHAMPIONS
  */
  const {
    data: reignData,
    error: reignError,
  } = await supabase
    .from("title_reigns")
    .select(`
      id,
      boxer_id,
      titles (
        name
      )
    `)
    .eq("current_champion", true);

  if (reignError) {
    console.error(
      "Homepage champion query error:",
      reignError
    );
  }

  const reigns =
    (reignData as unknown as TitleReignRow[]) || [];

  /*
    GET BOXER PROFILES FOR CURRENT CHAMPIONS
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
        "Homepage champion profiles error:",
        profileError
      );
    } else {
      boxerProfiles =
        (profileData as BoxerProfile[]) || [];
    }
  }

  /*
    COMBINE TITLE + BOXER INFORMATION
  */
  const featuredChampions = reigns
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
    )
    .slice(0, 3);

  /*
    GET HOMEPAGE HBE RANKINGS
  */
  const {
    data: homepageRankingData,
    error: homepageRankingError,
  } = await supabase
    .from("rankings")
    .select(`
      id,
      boxer_id,
      ranking_position,
      published
    `)
    .eq("published", true)
    .order("ranking_position", {
      ascending: true,
    })
    .limit(6);

  if (homepageRankingError) {
    console.error(
      "Homepage rankings query error:",
      homepageRankingError
    );
  }

  const rankingRows =
    (homepageRankingData as HomepageRankingRow[]) ||
    [];

  const rankingBoxerIds = rankingRows
    .map((ranking) => ranking.boxer_id)
    .filter(Boolean);

  /*
    GET RECORD + KO + RATING
    DIRECTLY FROM BOXERS TABLE
  */
  let rankingBoxers: HomepageRankingBoxer[] = [];

  if (rankingBoxerIds.length > 0) {
    const {
      data: rankingBoxerData,
      error: rankingBoxerError,
    } = await supabase
      .from("boxers")
      .select(`
        id,
        first_name,
        last_name,
        wins,
        losses,
        draws,
        knockout_wins,
        knockout_losses,
        boxrec_rating_stars
      `)
      .in("id", rankingBoxerIds);

    if (rankingBoxerError) {
      console.error(
        "Homepage ranking boxer query error:",
        rankingBoxerError
      );
    } else {
      rankingBoxers =
        (rankingBoxerData as HomepageRankingBoxer[]) ||
        [];
    }
  }

  /*
    COMBINE HOMEPAGE RANKINGS
  */
  const homepageRankings = rankingRows
    .map((ranking) => {
      const boxer = rankingBoxers.find(
        (fighter) =>
          fighter.id === ranking.boxer_id
      );

      if (!boxer) {
        return null;
      }

      const fullName =
        `${boxer.first_name || ""} ${
          boxer.last_name || ""
        }`.trim();

      return {
        id: ranking.id,

        rankingPosition:
          ranking.ranking_position,

        fullName,

        wins:
          boxer.wins ?? 0,

        losses:
          boxer.losses ?? 0,

        draws:
          boxer.draws ?? 0,

        knockoutWins:
          boxer.knockout_wins ?? 0,

        knockoutLosses:
          boxer.knockout_losses ?? 0,

        rating:
          Number(
            boxer.boxrec_rating_stars ?? 0
          ),
      };
    })
    .filter(
      (
        ranking
      ): ranking is {
        id: string;
        rankingPosition: number;
        fullName: string;
        wins: number;
        losses: number;
        draws: number;
        knockoutWins: number;
        knockoutLosses: number;
        rating: number;
      } => ranking !== null
    );

  /*
    HOMEPAGE STRUCTURED DATA
  */
  const homePageSchema = {
    "@context": "https://schema.org",

    "@type": "WebPage",

    "@id":
      `${siteUrl}/#webpage`,

    url: siteUrl,

    name:
      "Heritage Boxing Entertainment | Professional Boxing Across Africa",

    description:
      "Heritage Boxing Entertainment promotes professional fighters, championship boxing, rankings, events, media and partnerships across Africa and international markets.",

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
        `${siteUrl}/images/hbe-hero-pro.png`,
    },

    inLanguage: "en",
  };

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* HOMEPAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              homePageSchema
            ),
        }}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/hbe-hero-pro.png')",
        }}
      >

        {/* STANDARD 55% DARKNESS */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LIGHT SUPPORTING GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[620px] sm:items-center sm:px-6 sm:py-16 lg:min-h-[700px] lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e0c273] sm:text-sm">
              Africa&apos;s Professional Boxing Organization
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-6xl md:text-7xl lg:text-8xl">
              Heritage Boxing
              <br />
              Entertainment
            </h1>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl text-base font-medium leading-8 text-white/95 sm:text-lg md:text-xl">
              Advancing championship boxing, developing
              fighters and connecting professional boxing
              communities across Africa and the world.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/events"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                HBE Events
              </Link>

              <Link
                href="/boxers"
                className="hbe-secondary-cta inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] active:border-[#171717] active:bg-[#171717] active:text-white sm:w-auto"
              >
                Explore Boxers
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* INTERNATIONAL REACH */}
      <section className="border-b border-[#e5e0d8] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
                HBE International
              </p>

              <p className="mt-2 text-sm font-semibold text-[#5f5b55]">
                Connecting professional boxing communities worldwide
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-4 text-2xl sm:text-3xl">

              <span title="Guinea">🇬🇳</span>
              <span title="Azerbaijan">🇦🇿</span>
              <span title="Bahamas">🇧🇸</span>
              <span title="Barbados">🇧🇧</span>
              <span title="Belarus">🇧🇾</span>
              <span title="Benin">🇧🇯</span>
              <span title="Bolivia">🇧🇴</span>
              <span title="Burkina Faso">🇧🇫</span>
              <span title="Republic of the Congo">🇨🇬</span>
              <span title="Democratic Republic of the Congo">🇨🇩</span>
              <span title="El Salvador">🇸🇻</span>
              <span title="Liberia">🇱🇷</span>
              <span title="Nigeria">🇳🇬</span>
              <span title="South Africa">🇿🇦</span>

            </div>

          </div>

        </div>

      </section>

      {/* CHAMPIONS */}
      <section className="hbe-section-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

          <p className="hbe-kicker text-xs sm:text-sm">
            HBE Championships
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase text-[#171717] sm:text-5xl md:text-6xl">
            HBE Champions
          </h2>

          <div className="hbe-divider mt-5" />

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            Meet the HBE championships.
          </p>

          {featuredChampions.length > 0 ? (

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {featuredChampions.map(
                (champion) => {
                  const boxer =
                    champion.boxer;

                  const fullName =
                    boxer.full_name ||
                    `${boxer.first_name || ""} ${
                      boxer.last_name || ""
                    }`.trim();

                  const titleName =
                    champion.titles?.name ||
                    "HBE Championship";

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

                  return (

                    <article
                      key={champion.id}
                      className="overflow-hidden bg-white shadow-lg ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >

                      <div className="relative aspect-[4/5] overflow-hidden bg-[#efebe5]">

                        {boxer.photo_url ? (

                          <Image
                            src={
                              boxer.photo_url
                            }
                            alt={
                              `${fullName} HBE boxing champion`
                            }
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-500 hover:scale-[1.03]"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center px-6 text-center">

                            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8a847c]">
                              HBE Champion
                            </p>

                          </div>

                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pb-5 pt-20">

                          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e0c273]">
                            Current Champion
                          </p>

                        </div>

                      </div>

                      <div className="p-7">

                        <p className="text-xs font-black uppercase leading-5 tracking-[0.18em] text-[#941f25]">
                          {titleName}
                        </p>

                        <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-[#171717]">
                          {fullName}
                        </h3>

                        {boxer.nickname && (

                          <p className="mt-2 italic text-[#5f5b55]">
                            &ldquo;
                            {boxer.nickname}
                            &rdquo;
                          </p>

                        )}

                        <div className="mt-5 border-t border-[#eee9e2] pt-5">

                          {division && (

                            <p className="text-sm text-[#5f5b55]">

                              <span className="font-bold text-[#171717]">
                                Division:
                              </span>{" "}

                              {division}

                            </p>

                          )}

                          {country && (

                            <p className="mt-2 text-sm text-[#5f5b55]">

                              <span className="font-bold text-[#171717]">
                                Country:
                              </span>{" "}

                              {country}

                            </p>

                          )}

                          <p className="mt-2 text-sm text-[#5f5b55]">

                            <span className="font-bold text-[#171717]">
                              Record:
                            </span>{" "}

                            {record}

                          </p>

                        </div>

                        {boxer.profile_slug && (

                          <Link
                            href={`/boxers/${boxer.profile_slug}`}
                            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
                          >
                            View Fighter Profile
                          </Link>

                        )}

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          ) : (

            <div className="mt-12 border border-[#e5e0d8] bg-[#f7f4ef] p-8">

              <p className="font-bold text-[#171717]">
                HBE championship profiles are being updated.
              </p>

            </div>

          )}

          <div className="mt-10">

            <Link
              href="/champions"
              className="hbe-button-secondary"
            >
              View All Champions
            </Link>

          </div>

        </div>

      </section>

      {/* RANKINGS */}
      <section className="hbe-section-soft">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

          <p className="hbe-kicker text-xs sm:text-sm">
            Official HBE Rankings
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase text-[#171717] sm:text-5xl">
            The Road To The Title
          </h2>

          <div className="hbe-divider mt-5" />

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            Follow the leading HBE contenders, professional
            records and ratings as they move toward
            championship opportunities.
          </p>

          {homepageRankings.length > 0 ? (

            <div className="mt-10 overflow-hidden border border-[#e5e0d8] bg-white shadow-sm">

              {/* DESKTOP HEADER */}
              <div className="hidden grid-cols-[90px_1fr_300px_180px] items-center bg-[#171717] px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-white lg:grid">

                <div>
                  Rank
                </div>

                <div>
                  Fighter
                </div>

                <div>
                  Record
                </div>

                <div>
                  Rating
                </div>

              </div>

              {homepageRankings.map(
                (ranking) => (

                  <div
                    key={ranking.id}
                    className="grid gap-6 border-b border-[#e5e0d8] px-5 py-6 last:border-b-0 lg:grid-cols-[90px_1fr_300px_180px] lg:items-center lg:px-6"
                  >

                    {/* HBE RANK */}
                    <div>

                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8a847c] lg:hidden">
                        HBE Rank
                      </p>

                      <p className="mt-1 text-3xl font-black text-[#941f25]">
                        #
                        {
                          ranking.rankingPosition
                        }
                      </p>

                    </div>

                    {/* FIGHTER */}
                    <div>

                      <p className="text-xl font-black uppercase leading-tight text-[#171717]">
                        {
                          ranking.fullName
                        }
                      </p>

                    </div>

                    {/* BOXREC-STYLE RECORD */}
                    <div className="w-full max-w-[300px]">

                      <div className="flex overflow-hidden rounded-lg">

                        {/* WINS */}
                        <div className="flex-1 border-r-2 border-white bg-[#078d13] px-3 py-2 text-center">

                          <p className="text-3xl font-black leading-none text-white">
                            {
                              ranking.wins
                            }
                          </p>

                        </div>

                        {/* LOSSES */}
                        <div className="flex-1 border-r-2 border-white bg-[#d10808] px-3 py-2 text-center">

                          <p className="text-3xl font-black leading-none text-white">
                            {
                              ranking.losses
                            }
                          </p>

                        </div>

                        {/* DRAWS */}
                        <div className="flex-1 bg-[#78a5ef] px-3 py-2 text-center">

                          <p className="text-3xl font-black leading-none text-white">
                            {
                              ranking.draws
                            }
                          </p>

                        </div>

                      </div>

                      {/* KO NUMBERS */}
                      <div className="grid grid-cols-3 text-center">

                        <div className="pt-2">

                          <p className="text-sm font-black text-[#078d13]">
                            {
                              ranking.knockoutWins
                            }{" "}
                            KOs
                          </p>

                        </div>

                        <div className="pt-2">

                          <p className="text-sm font-black text-[#d10808]">
                            {
                              ranking.knockoutLosses
                            }{" "}
                            KOs
                          </p>

                        </div>

                        <div />

                      </div>

                    </div>

                    {/* STAR RATING */}
                    <div>

                      <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#8a847c] lg:hidden">
                        Rating
                      </p>

                      <RatingStars
                        rating={
                          ranking.rating
                        }
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="mt-10 border border-[#e5e0d8] bg-white p-8">

              <p className="font-bold text-[#171717]">
                HBE rankings are being updated.
              </p>

            </div>

          )}

          <Link
            href="/rankings"
            className="hbe-button-secondary mt-8"
          >
            View Full Rankings
          </Link>

        </div>

      </section>

      {/* UPCOMING EVENTS */}
      <section className="hbe-section-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

          <p className="hbe-kicker text-xs sm:text-sm">
            HBE Fight Nights
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase text-[#171717] sm:text-5xl">
            The Next Chapter Is Coming
          </h2>

          <div className="hbe-divider mt-5" />

          <div className="mt-10 overflow-hidden border border-[#e5e0d8] bg-[#f7f4ef]">

            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

              <div className="p-8 sm:p-10 lg:p-12">

                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#941f25]">
                  Upcoming HBE Events
                </p>

                <h3 className="mt-4 max-w-2xl text-3xl font-black uppercase leading-tight text-[#171717] sm:text-4xl">
                  New Championship Events Will Be Announced Soon
                </h3>

                <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

                <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5b55] sm:text-lg">
                  HBE is developing future professional fight nights,
                  championship opportunities and international boxing events.
                  Official dates, venues, fight cards and broadcast information
                  will be released as they are confirmed.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                  <Link
                    href="/events"
                    className="hbe-button-primary"
                  >
                    View Event Archive
                  </Link>

                  <Link
                    href="/media"
                    className="hbe-button-secondary"
                  >
                    Follow HBE Media
                  </Link>

                </div>

              </div>

              <div className="flex min-h-[300px] items-center border-l border-[#e5e0d8] bg-[#f7f4ef] p-8 sm:p-10 lg:p-12">

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
                    Africa To The World
                  </p>

                  <h3 className="mt-4 text-3xl font-black uppercase leading-tight text-[#171717] sm:text-4xl">
                    Building The Future Of Championship Boxing
                  </h3>

                  <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

                  <p className="mt-5 leading-8 text-[#5f5b55]">
                    HBE continues to develop fighters, create championship
                    pathways and expand professional boxing opportunities
                    across Africa and international markets.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* MEDIA */}
      <section className="hbe-section-soft">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

          <p className="hbe-kicker text-xs sm:text-sm">
            HBE Media
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase text-[#171717] sm:text-5xl">
            Watch The Story Unfold
          </h2>

          <div className="hbe-divider mt-5" />

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            Interviews, fight highlights and behind-the-scenes access from
            inside the world of Heritage Boxing Entertainment.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {featuredMedia.map(
              (video) => (

                <article
                  key={
                    video.videoId
                  }
                  className="overflow-hidden border border-[#e5e0d8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="aspect-video overflow-hidden bg-black">

                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={
                        video.title
                      }
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />

                  </div>

                  <div className="p-6">

                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                      {
                        video.label
                      }
                    </p>

                    <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-[#171717]">
                      {
                        video.title
                      }
                    </h3>

                    <p className="mt-4 leading-7 text-[#5f5b55]">
                      {
                        video.description
                      }
                    </p>

                  </div>

                </article>

              )
            )}

          </div>

          <div className="mt-9">

            <Link
              href="/media"
              className="hbe-button-secondary"
            >
              Explore HBE Media
            </Link>

          </div>

        </div>

      </section>

      {/* PARTNERS */}
      <section className="hbe-section-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

          <p className="hbe-kicker text-xs sm:text-sm">
            Commercial Partnerships
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase text-[#171717] sm:text-5xl">
            Put Your Brand At The Heart Of Professional Boxing
          </h2>

          <div className="hbe-divider mt-5" />

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            HBE offers sponsorship, broadcast, event, digital
            media and commercial partnership opportunities.
          </p>

          <div className="mt-9">

            <Link
              href="/partners"
              className="hbe-button-primary"
            >
              Partner With HBE
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}