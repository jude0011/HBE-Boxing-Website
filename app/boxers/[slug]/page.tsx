import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

import { supabase } from "@/app/lib/supabase";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

type BoxerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type TitleRelation = {
  name: string | null;
};

type ChampionshipRow = {
  id: string;
  won_date: string | null;
  current_champion: boolean | null;
  title_defenses: number | null;
  won_by: string | null;
  opponent_name: string | null;
  event_name: string | null;
  location: string | null;
  notes: string | null;
  titles: TitleRelation | null;
};

type LiveBoxer = {
  id: string;

  first_name: string | null;
  last_name: string | null;
  nickname: string | null;

  profile_slug: string | null;
  photo_url: string | null;

  nationality_code: string | null;
  division_id: string | null;

  wins: number | null;
  losses: number | null;
  draws: number | null;

  knockout_wins: number | null;
  knockout_losses: number | null;

  bouts: number | null;
  rounds: number | null;
  ko_percentage: number | null;

  stance: string | null;

  boxrec_id: string | null;
  boxrec_rating_stars: number | null;

  boxrec_world_rank: number | null;
  boxrec_world_total: number | null;

  boxrec_country_rank: number | null;
  boxrec_country_total: number | null;

  birth_name: string | null;
  date_of_birth: string | null;
  gender: string | null;

  residence: string | null;
  birthplace: string | null;

  career_start_year: number | null;
  career_end_year: number | null;

  debut_date: string | null;

  facebook_url: string | null;
  instagram_url: string | null;
};

function formatDate(
  date: string | null
) {
  if (!date) {
    return null;
  }

  return new Date(
    `${date}T00:00:00Z`
  ).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

function calculateAge(
  dateOfBirth: string | null
) {
  if (!dateOfBirth) {
    return null;
  }

  const birth = new Date(
    `${dateOfBirth}T00:00:00Z`
  );

  if (
    Number.isNaN(
      birth.getTime()
    )
  ) {
    return null;
  }

  const today = new Date();

  let age =
    today.getUTCFullYear() -
    birth.getUTCFullYear();

  const monthDifference =
    today.getUTCMonth() -
    birth.getUTCMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getUTCDate() <
        birth.getUTCDate()
    )
  ) {
    age -= 1;
  }

  return age;
}

function countryFlag(
  code?: string | null
) {
  if (
    !code ||
    code.length !== 2
  ) {
    return "🌍";
  }

  return code
    .toUpperCase()
    .replace(
      /./g,
      (character) =>
        String.fromCodePoint(
          127397 +
            character.charCodeAt(0)
        )
    );
}

function getKnownMonthYear(
  notes: string | null
) {
  if (!notes) {
    return null;
  }

  const match = notes.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{4}/i
  );

  if (!match) {
    return null;
  }

  return match[0]
    .replace(
      /^Jan /i,
      "January "
    )
    .replace(
      /^Feb /i,
      "February "
    )
    .replace(
      /^Mar /i,
      "March "
    )
    .replace(
      /^Apr /i,
      "April "
    )
    .replace(
      /^Jun /i,
      "June "
    )
    .replace(
      /^Jul /i,
      "July "
    )
    .replace(
      /^Aug /i,
      "August "
    )
    .replace(
      /^Sep /i,
      "September "
    )
    .replace(
      /^Sept /i,
      "September "
    )
    .replace(
      /^Oct /i,
      "October "
    )
    .replace(
      /^Nov /i,
      "November "
    )
    .replace(
      /^Dec /i,
      "December "
    );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
}) {
  return (
    <div className="border-b border-[#e5e0d8] py-4">

      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#817a73]">
        {label}
      </p>

      <p className="mt-1 font-bold text-[#171717]">
        {value !== null &&
        value !== undefined &&
        value !== ""
          ? value
          : "—"}
      </p>

    </div>
  );
}

export async function generateMetadata({
  params,
}: BoxerPageProps): Promise<Metadata> {
  const { slug } = await params;

  const {
    data: profile,
  } = await supabase
    .from("boxer_profiles")
    .select("*")
    .eq("profile_slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!profile) {
    return {
      title: "HBE Boxer",

      description:
        "Professional boxer profile with Heritage Boxing Entertainment.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const {
    data: liveBoxer,
  } = await supabase
    .from("boxers")
    .select(`
      first_name,
      last_name,
      nickname,
      photo_url,
      wins,
      losses,
      draws
    `)
    .eq("id", profile.id)
    .maybeSingle();

  const fullName =
    `${liveBoxer?.first_name || ""} ${
      liveBoxer?.last_name || ""
    }`.trim() ||
    profile.full_name ||
    "HBE Boxer";

  const division =
    profile.division_name ||
    profile.division ||
    "professional boxing";

  const record =
    liveBoxer
      ? `${liveBoxer.wins ?? 0}-${liveBoxer.losses ?? 0}-${liveBoxer.draws ?? 0}`
      : profile.record || "";

  const description =
    `View ${fullName}'s professional boxing profile, ${division} division, fight record${record ? ` ${record}` : ""}, rankings and career with Heritage Boxing Entertainment.`;

  const canonicalUrl =
    `${siteUrl}/boxers/${slug}`;

  const imageUrl =
    liveBoxer?.photo_url ||
    profile.photo_url ||
    `${siteUrl}/images/boxers-hero.png`;

  return {
    title:
      `${fullName} | Professional Boxer`,

    description,

    alternates: {
      canonical:
        canonicalUrl,
    },

    openGraph: {
      type: "profile",

      url:
        canonicalUrl,

      siteName:
        "Heritage Boxing Entertainment",

      title:
        `${fullName} | Professional Boxer`,

      description,

      images: [
        {
          url:
            imageUrl,

          alt:
            `${fullName} professional boxer with Heritage Boxing Entertainment`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${fullName} | Professional Boxer`,

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

export default async function BoxerProfilePage({
  params,
}: BoxerPageProps) {
  const { slug } = await params;

  /*
    PROFILE VIEW

    We still use boxer_profiles to locate
    the active public boxer and obtain
    display information such as division
    and country names.
  */
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("boxer_profiles")
    .select("*")
    .eq(
      "profile_slug",
      slug
    )
    .eq(
      "active",
      true
    )
    .single();

  if (
    profileError ||
    !profile
  ) {
    notFound();
  }

  /*
    LIVE BOXER RECORD

    This is now the master source for
    everything editable in Admin:
    record, KO data, BoxRec rankings,
    photo, nickname, social media,
    personal details, etc.
  */
  const {
    data: liveBoxerData,
    error: liveBoxerError,
  } = await supabase
    .from("boxers")
    .select("*")
    .eq(
      "id",
      profile.id
    )
    .single();

  if (
    liveBoxerError ||
    !liveBoxerData
  ) {
    console.error(
      "Error loading live boxer data:",
      liveBoxerError
    );

    notFound();
  }

  const liveBoxer =
    liveBoxerData as LiveBoxer;

  /*
    CHAMPIONSHIP HISTORY
  */
  const {
    data: titleReigns,
    error: championshipError,
  } = await supabase
    .from("title_reigns")
    .select(`
      id,
      won_date,
      current_champion,
      title_defenses,
      won_by,
      opponent_name,
      event_name,
      location,
      notes,
      titles (
        name
      )
    `)
    .eq(
      "boxer_id",
      liveBoxer.id
    )
    .order(
      "current_champion",
      {
        ascending: false,
      }
    )
    .order(
      "won_date",
      {
        ascending: false,
        nullsFirst: false,
      }
    );

  if (
    championshipError
  ) {
    console.error(
      "Error loading championship records:",
      championshipError
    );
  }

  const reigns =
    (
      titleReigns as unknown as ChampionshipRow[]
    ) || [];

  /*
    CORE IDENTITY
  */
  const fullName =
    `${liveBoxer.first_name || ""} ${
      liveBoxer.last_name || ""
    }`.trim() ||
    profile.full_name ||
    "HBE Boxer";

  const nickname =
    liveBoxer.nickname ||
    null;

  const photoUrl =
    liveBoxer.photo_url ||
    profile.photo_url ||
    null;

  /*
    DIVISION / COUNTRY DISPLAY NAMES
  */
  const division =
    profile.division_name ||
    profile.division ||
    "Professional Boxer";

  const country =
    profile.country_name ||
    profile.country ||
    "";

  const nationalityCode =
    liveBoxer.nationality_code ||
    profile.nationality_code ||
    null;

  const flag =
    countryFlag(
      nationalityCode
    );

  /*
    RECORD
  */
  const record =
    `${liveBoxer.wins ?? 0}-${
      liveBoxer.losses ?? 0
    }-${liveBoxer.draws ?? 0}`;

  /*
    PERSONAL DETAILS
  */
  const birthName =
    liveBoxer.birth_name ||
    fullName;

  const dateOfBirth =
    liveBoxer.date_of_birth ||
    null;

  const age =
    calculateAge(
      dateOfBirth
    );

  const gender =
    liveBoxer.gender ||
    null;

  const residence =
    liveBoxer.residence ||
    null;

  const birthplace =
    liveBoxer.birthplace ||
    null;

  const debutDate =
    liveBoxer.debut_date ||
    null;

  /*
    CAREER
  */
  const career =
    liveBoxer.career_start_year
      ? liveBoxer.career_end_year
        ? `${liveBoxer.career_start_year}–${liveBoxer.career_end_year}`
        : `${liveBoxer.career_start_year}–Present`
      : null;

  /*
    SOCIAL MEDIA
  */
  const facebookUrl =
    liveBoxer.facebook_url ||
    null;

  const instagramUrl =
    liveBoxer.instagram_url ||
    null;

  /*
    BOXREC RANKINGS
  */
  const worldRank =
    liveBoxer.boxrec_world_rank
      ? `#${Number(
          liveBoxer.boxrec_world_rank
        ).toLocaleString()}${
          liveBoxer.boxrec_world_total
            ? ` / ${Number(
                liveBoxer.boxrec_world_total
              ).toLocaleString()}`
            : ""
        }`
      : "—";

  const nationalRank =
    liveBoxer.boxrec_country_rank
      ? `#${Number(
          liveBoxer.boxrec_country_rank
        ).toLocaleString()}${
          liveBoxer.boxrec_country_total
            ? ` / ${Number(
                liveBoxer.boxrec_country_total
              ).toLocaleString()}`
            : ""
        }`
      : "—";

  /*
    SEO STRUCTURED DATA
  */
  const boxerUrl =
    `${siteUrl}/boxers/${slug}`;

  const socialProfiles = [
    facebookUrl,
    instagramUrl,
  ].filter(
    (url): url is string =>
      Boolean(url)
  );

  const boxerSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "Person",

    "@id":
      `${boxerUrl}#person`,

    name:
      fullName,

    alternateName:
      nickname ||
      undefined,

    url:
      boxerUrl,

    image:
      photoUrl ||
      undefined,

    description:
      `${fullName} is a ${division} professional boxer with Heritage Boxing Entertainment${country ? ` representing ${country}` : ""}. Current professional record: ${record}.`,

    jobTitle:
      "Professional Boxer",

    nationality:
      country
        ? {
            "@type":
              "Country",

            name:
              country,
          }
        : undefined,

    birthDate:
      dateOfBirth ||
      undefined,

    birthPlace:
      birthplace
        ? {
            "@type":
              "Place",

            name:
              birthplace,
          }
        : undefined,

    homeLocation:
      residence
        ? {
            "@type":
              "Place",

            name:
              residence,
          }
        : undefined,

    sameAs:
      socialProfiles.length > 0
        ? socialProfiles
        : undefined,

    memberOf: {
      "@id":
        `${siteUrl}/#organization`,
    },

    knowsAbout: [
      "Professional Boxing",
      division,
    ].filter(Boolean),
  };

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
          "Boxers",

        item:
          `${siteUrl}/boxers`,
      },
      {
        "@type":
          "ListItem",

        position: 3,

        name:
          fullName,

        item:
          boxerUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-[#171717]">

      {/* BOXER PERSON SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              boxerSchema
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

      {/* PROFILE HERO */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">

          <Link
            href="/boxers"
            className="inline-flex items-center text-sm font-black uppercase tracking-wide text-[#171717] transition hover:text-[#941f25]"
          >
            ← Back To Boxers
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

            {/* LEFT COLUMN */}
            <div>

              {/* PHOTO */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#efebe5] shadow-lg">

                {photoUrl ? (

                  <Image
                    src={photoUrl}
                    alt={`${fullName} professional boxer with Heritage Boxing Entertainment`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center"
                  />

                ) : (

                  <div className="flex h-full items-center justify-center px-6 text-center text-[#777]">
                    Photo coming soon
                  </div>

                )}

              </div>

              {/* SOCIAL MEDIA */}
              {(facebookUrl ||
                instagramUrl) && (

                <div className="mt-5 border border-[#e5e0d8] bg-[#f7f4ef] p-5">

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7a746d]">
                    Follow The Fighter
                  </p>

                  <div className="mt-4 flex gap-3">

                    {facebookUrl && (

                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${fullName} on Facebook`}
                        title="Facebook"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#171717] text-white transition hover:bg-[#941f25]"
                      >
                        <FaFacebookF
                          size={19}
                        />
                      </a>

                    )}

                    {instagramUrl && (

                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${fullName} on Instagram`}
                        title="Instagram"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#171717] text-white transition hover:bg-[#941f25]"
                      >
                        <FaInstagram
                          size={20}
                        />
                      </a>

                    )}

                  </div>

                </div>

              )}

            </div>

            {/* RIGHT COLUMN */}
            <div>

              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#941f25] sm:text-sm">
                HBE Professional Boxer
              </p>

              <h1 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl">
                {fullName}
              </h1>

              {nickname && (

                <p className="mt-3 text-xl font-semibold italic text-[#5f5b55]">
                  &ldquo;
                  {nickname}
                  &rdquo;
                </p>

              )}

              <div className="mt-7 h-1 w-20 bg-[#c6a24a]" />

              {/* MAIN STAT CARDS */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* RECORD */}
                <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-5">

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                    Record
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {record}
                  </p>

                </div>

                {/* DIVISION */}
                <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-5">

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                    Division
                  </p>

                  <p className="mt-2 text-lg font-black">
                    {division}
                  </p>

                </div>

                {/* WORLD RANK */}
                <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-5">

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                    World Rank
                  </p>

                  <p className="mt-2 text-lg font-black">
                    {worldRank}
                  </p>

                </div>

                {/* NATIONAL RANK */}
                <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-5">

                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-[#7a746d]">

                    <span className="text-lg">
                      {flag}
                    </span>

                    <span>
                      {country ||
                        "National"}
                    </span>

                  </p>

                  <p className="mt-2 text-lg font-black">
                    {nationalRank}
                  </p>

                </div>

              </div>

              {/* PROFESSIONAL PROFILE */}
              <div className="mt-10">

                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
                  Professional Profile
                </p>

                <h2 className="mt-3 text-2xl font-black uppercase sm:text-3xl">
                  Fighter Statistics
                </h2>

                <div className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">

                  <ProfileItem
                    label="Wins"
                    value={
                      liveBoxer.wins ??
                      0
                    }
                  />

                  <ProfileItem
                    label="Losses"
                    value={
                      liveBoxer.losses ??
                      0
                    }
                  />

                  <ProfileItem
                    label="Draws"
                    value={
                      liveBoxer.draws ??
                      0
                    }
                  />

                  <ProfileItem
                    label="KO Wins"
                    value={
                      liveBoxer.knockout_wins ??
                      0
                    }
                  />

                  <ProfileItem
                    label="KO Losses"
                    value={
                      liveBoxer.knockout_losses ??
                      0
                    }
                  />

                  <ProfileItem
                    label="KO Percentage"
                    value={
                      liveBoxer.ko_percentage !==
                        null &&
                      liveBoxer.ko_percentage !==
                        undefined
                        ? `${liveBoxer.ko_percentage}%`
                        : null
                    }
                  />

                  <ProfileItem
                    label="Bouts"
                    value={
                      liveBoxer.bouts
                    }
                  />

                  <ProfileItem
                    label="Rounds"
                    value={
                      liveBoxer.rounds
                    }
                  />

                  <ProfileItem
                    label="Stance"
                    value={
                      liveBoxer.stance
                    }
                  />

                  <ProfileItem
                    label="BoxRec Rating"
                    value={
                      liveBoxer.boxrec_rating_stars !==
                        null &&
                      liveBoxer.boxrec_rating_stars !==
                        undefined
                        ? `${liveBoxer.boxrec_rating_stars} Stars`
                        : null
                    }
                  />

                  <ProfileItem
                    label="World Ranking"
                    value={
                      worldRank
                    }
                  />

                  {/* COUNTRY RANK */}
                  <div className="border-b border-[#e5e0d8] py-4">

                    <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#817a73]">

                      <span className="text-base">
                        {flag}
                      </span>

                      <span>
                        {country ||
                          "National"}{" "}
                        Ranking
                      </span>

                    </p>

                    <p className="mt-1 font-bold text-[#171717]">
                      {nationalRank}
                    </p>

                  </div>

                  <ProfileItem
                    label="BoxRec ID"
                    value={
                      liveBoxer.boxrec_id
                    }
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* PERSONAL INFORMATION */}
      <section className="border-t border-[#e5e0d8] bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
            Fighter Information
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
            Personal & Career Details
          </h2>

          <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

          <div className="mt-10 grid gap-x-10 bg-white px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">

            <ProfileItem
              label="Birth Name"
              value={
                birthName
              }
            />

            <ProfileItem
              label="Date of Birth"
              value={
                formatDate(
                  dateOfBirth
                )
              }
            />

            <ProfileItem
              label="Age"
              value={
                age
              }
            />

            <ProfileItem
              label="Gender"
              value={
                gender
              }
            />

            {/* NATIONALITY */}
            <div className="border-b border-[#e5e0d8] py-4">

              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#817a73]">
                Nationality
              </p>

              <p className="mt-1 flex items-center gap-2 font-bold text-[#171717]">

                <span className="text-xl">
                  {flag}
                </span>

                <span>
                  {country || "—"}
                </span>

              </p>

            </div>

            <ProfileItem
              label="Residence"
              value={
                residence
              }
            />

            <ProfileItem
              label="Birthplace"
              value={
                birthplace
              }
            />

            <ProfileItem
              label="Fighting From"
              value={
                profile.hometown
                  ? `${profile.hometown}${
                      profile.state_region
                        ? `, ${profile.state_region}`
                        : ""
                    }`
                  : profile.state_region
              }
            />

            <ProfileItem
              label="Career"
              value={
                career
              }
            />

            <ProfileItem
              label="Professional Debut"
              value={
                formatDate(
                  debutDate
                )
              }
            />

            <ProfileItem
              label="Division"
              value={
                division
              }
            />

            <ProfileItem
              label="Stance"
              value={
                liveBoxer.stance
              }
            />

          </div>

          {/* CAREER HIGHLIGHTS */}
          {profile.career_highlights && (

            <div className="mt-10 border border-[#e5e0d8] bg-white p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
                Career Highlights
              </p>

              <div className="mt-5 whitespace-pre-line text-base leading-8 text-[#5f5b55]">
                {
                  profile.career_highlights
                }
              </div>

            </div>

          )}

        </div>

      </section>

      {/* CHAMPIONSHIP HISTORY */}
      {reigns.length > 0 && (

        <section className="border-t border-[#e5e0d8] bg-white">

          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
              Championship Record
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
              Championship History
            </h2>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
              Official championship achievements
              and title history for{" "}
              {fullName}.
            </p>

            <div className="mt-10 space-y-8">

              {reigns.map(
                (reign) => {
                  const titleName =
                    reign.titles?.name ||
                    "HBE Championship";

                  const titleDate =
                    formatDate(
                      reign.won_date
                    ) ||
                    getKnownMonthYear(
                      reign.notes
                    );

                  return (

                    <article
                      key={
                        reign.id
                      }
                      className="overflow-hidden border border-[#e5e0d8] bg-[#f7f4ef] shadow-sm"
                    >

                      {/* TITLE HEADER */}
                      <div className="border-b border-[#e5e0d8] bg-white px-6 py-6 sm:px-8">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                              {reign.current_champion
                                ? "Current Championship"
                                : "Championship Record"}
                            </p>

                            <h3 className="mt-2 text-2xl font-black uppercase sm:text-3xl">
                              {titleName}
                            </h3>

                          </div>

                          {reign.current_champion && (

                            <div className="inline-flex w-fit bg-[#c6a24a] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#171717]">
                              Current Champion
                            </div>

                          )}

                        </div>

                      </div>

                      {/* DETAILS */}
                      <div className="p-6 sm:p-8">

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                          <div className="border border-[#e5e0d8] bg-white p-5">

                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                              Date Title Was Won
                            </p>

                            <p className="mt-2 font-bold">
                              {titleDate ||
                                "Date being verified"}
                            </p>

                          </div>

                          <div className="border border-[#e5e0d8] bg-white p-5">

                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                              Opponent Defeated
                            </p>

                            <p className="mt-2 font-bold">
                              {reign.opponent_name ||
                                "Information being verified"}
                            </p>

                          </div>

                          <div className="border border-[#e5e0d8] bg-white p-5">

                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                              How They Won
                            </p>

                            <p className="mt-2 font-bold">
                              {reign.won_by ||
                                "Information being verified"}
                            </p>

                          </div>

                          <div className="border border-[#e5e0d8] bg-white p-5 sm:col-span-2">

                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                              Event Name
                            </p>

                            <p className="mt-2 font-bold">
                              {reign.event_name ||
                                "Information being verified"}
                            </p>

                          </div>

                          <div className="border border-[#e5e0d8] bg-white p-5">

                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                              Fight Record
                            </p>

                            <p className="mt-2 font-bold">
                              {record}
                            </p>

                          </div>

                        </div>

                        {reign.location && (

                          <div className="mt-5 border border-[#e5e0d8] bg-white p-5">

                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                              Event Location
                            </p>

                            <p className="mt-3 leading-7 text-[#5f5b55]">
                              {
                                reign.location
                              }
                            </p>

                          </div>

                        )}

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          </div>

        </section>

      )}

      {/* NO CHAMPIONSHIP HISTORY */}
      {reigns.length === 0 && (

        <section className="border-t border-[#e5e0d8] bg-[#f7f4ef]">

          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
              Championship Record
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase">
              Championship Information Coming Soon
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-[#5f5b55]">
              Official championship records are
              being added and verified.
            </p>

          </div>

        </section>

      )}

      {/* LINKS */}
      <section className="border-t border-[#e5e0d8] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/champions"
              className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
            >
              View HBE Champions
            </Link>

            <Link
              href="/boxers"
              className="inline-flex min-h-[52px] w-full items-center justify-center border-2 border-[#171717] bg-transparent px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:!border-[#171717] hover:!bg-[#171717] hover:!text-white focus:!border-[#171717] focus:!bg-[#171717] focus:!text-white active:!border-[#171717] active:!bg-[#171717] active:!text-white sm:w-auto"
            >
              View All Boxers
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}