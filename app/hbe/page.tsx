import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

/*
  =====================================
  HBE RING OFFICIALS
  =====================================

  Replace each OFFICIAL NAME and role
  with the correct information.

  role can be:
  - Referee
  - Judge
  - Referee / Judge
*/
const ringOfficials = [
  {
    name: "Stone face",
    role: "Referee / Judge",
    image:
      "/images/ring-official-1.jpg",
  },
  {
    name: "Maria",
    role: "Referee / Judge",
    image:
      "/images/ring-official-2.jpg",
  },
  {
    name: "Onyeka Ilo",
    role: "Referee / Judge",
    image:
      "/images/ring-official-3.jpg",
  },
  {
    name: "Ngozika Enwelum",
    role: "Referee / Judge",
    image:
      "/images/ring-official-4.jpg",
  },
  {
    name: "Innocent Nwokocha",
    role: "Referee / Judge",
    image:
      "/images/ring-official-5.jpeg",
  },
  {
    name: "Umeh Innocent (Coach)",
    role: "Referee / Judge",
    image:
      "/images/ring-official-6.jpg",
  },
  {
    name: "Christopher Ossai (Technical Adviser)",
    role: "Referee / Judge",
    image:
      "/images/ring-official-7.jpg",
  },
];

export const metadata: Metadata = {
  title: "About HBE",

  description:
    "Discover Heritage Boxing Entertainment, an independent professional boxing organization advancing championship boxing, fighter development, rankings, events and international opportunities across Africa and beyond.",

  alternates: {
    canonical:
      `${siteUrl}/hbe`,
  },

  openGraph: {
    type:
      "website",

    url:
      `${siteUrl}/hbe`,

    siteName:
      "Heritage Boxing Entertainment",

    title:
      "About HBE | Heritage Boxing Entertainment",

    description:
      "Learn about Heritage Boxing Entertainment, its mission, leadership, ring officials and vision for professional boxing across Africa and international markets.",

    images: [
      {
        url:
          `${siteUrl}/images/hbe-about-hero.jpg`,

        alt:
          "Heritage Boxing Entertainment professional boxing organization",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "About HBE | Heritage Boxing Entertainment",

    description:
      "Learn about HBE's mission, leadership, ring officials and vision for professional boxing across Africa and international markets.",

    images: [
      `${siteUrl}/images/hbe-about-hero.jpg`,
    ],
  },

  robots: {
    index:
      true,

    follow:
      true,
  },
};

export default function HBEPage() {
  /*
    =====================================
    ABOUT PAGE SCHEMA
    =====================================
  */
  const aboutPageSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "AboutPage",

    "@id":
      `${siteUrl}/hbe#webpage`,

    url:
      `${siteUrl}/hbe`,

    name:
      "About HBE | Heritage Boxing Entertainment",

    description:
      "Heritage Boxing Entertainment is an independent professional boxing organization focused on championship sanctioning, title recognition, boxer development, rankings, events, professional ring officials and international boxing opportunities.",

    isPartOf: {
      "@id":
        `${siteUrl}/#website`,
    },

    about: {
      "@id":
        `${siteUrl}/#organization`,
    },

    mainEntity: {
      "@id":
        `${siteUrl}/#organization`,
    },

    primaryImageOfPage: {
      "@type":
        "ImageObject",

      url:
        `${siteUrl}/images/hbe-about-hero.jpg`,
    },

    inLanguage:
      "en",
  };

  /*
    =====================================
    BREADCRUMB SCHEMA
    =====================================
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

        position:
          1,

        name:
          "Home",

        item:
          siteUrl,
      },
      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "HBE",

        item:
          `${siteUrl}/hbe`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-[#171717]">

      {/* =====================================
          ABOUT PAGE SEO SCHEMA
          ===================================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              aboutPageSchema
            ),
        }}
      />

      {/* =====================================
          BREADCRUMB SCHEMA
          ===================================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbSchema
            ),
        }}
      />

      {/* =====================================
          HERO
          ===================================== */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/hbe-about-hero.jpg')",
        }}
      >

        {/* STANDARD 55% DARKNESS */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LIGHT SUPPORTING GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[560px] sm:items-center sm:px-6 sm:py-16 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e0c273] sm:text-sm">
              Heritage Boxing Entertainment
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              About HBE
            </h1>

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/95 sm:text-xl">
              An independent professional boxing
              organization.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/champions"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                View Champions
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

      {/* =====================================
          WHO WE ARE
          ===================================== */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
                Who We Are
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
                Upholding the Heritage of
                Professional Boxing
              </h2>

              <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

              <p className="mt-7 leading-8 text-[#5f5b55]">
                Heritage Boxing Entertainment
                (HBE Boxing) is an independent
                professional boxing organization
                dedicated to championship
                sanctioning, title recognition,
                boxer development and the
                advancement of professional boxing
                across Africa and internationally.
              </p>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                HBE works to create a professional
                boxing ecosystem that connects
                fighters, champions, trainers,
                promoters, officials, events,
                media organizations, commercial
                partners and boxing fans.
              </p>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                A central part of the HBE mission
                is connecting Anglophone and
                Francophone boxing communities and
                creating stronger pathways for
                African fighters to compete, gain
                recognition and progress toward
                international opportunities.
              </p>

            </div>

            {/* VISION CARD */}
            <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-8 sm:p-10">

              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
                HBE Vision
              </p>

              <p className="mt-6 leading-8 text-[#5f5b55]">
                Our vision is to become one of the
                most respected professional boxing
                organizations and a globally
                recognized platform for
                championship competition, boxer
                development, international events
                and boxing entertainment.
              </p>

              <div className="mt-8 border-t border-[#d8d2ca] pt-7">

                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#171717]">
                  Connecting Boxing Markets
                </p>

                <p className="mt-4 leading-7 text-[#5f5b55]">
                  HBE seeks to build stronger
                  connections between African
                  countries, international boxing
                  markets and the wider
                  professional boxing community.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          MISSION
          ===================================== */}
      <section className="bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
            Our Mission
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
            Elevating Professional Boxing
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <p className="mt-7 max-w-4xl text-lg leading-9 text-[#5f5b55]">
            Our mission is to develop and recognize
            professional boxing talent, create
            credible championship opportunities,
            establish respected titles and
            rankings, support boxing officials and
            promoters, organize professional events
            and create stronger pathways from
            emerging fighter to recognized
            championship contender.
          </p>

        </div>

      </section>

      {/* =====================================
          AFRICA CONNECTION
          ===================================== */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
                International Development
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl">
                Connecting Africa Through Boxing
              </h2>

              <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

            </div>

            <div>

              <p className="leading-8 text-[#5f5b55]">
                Africa has exceptional boxing
                talent, yet opportunities can be
                separated by geography, language,
                infrastructure and access to
                international competition.
              </p>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                HBE is developing a platform that
                brings together Anglophone and
                Francophone fighters, trainers,
                officials, promoters, media
                organizations, sponsors and boxing
                communities under a broader
                professional boxing network.
              </p>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                The goal is to create more
                opportunities for African boxers
                to compete, build professional
                records, earn championship
                recognition and progress toward
                the international stage.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          WHAT HBE DOES
          ===================================== */}
      <section className="bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
            The HBE Platform
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
            What HBE Does
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                title:
                  "Championship Sanctioning",

                text:
                  "Professional championship bouts, title opportunities and championship recognition across HBE divisions.",
              },
              {
                title:
                  "Rankings",

                text:
                  "Structured professional rankings designed to identify contenders and support championship progression.",
              },
              {
                title:
                  "Boxer Development",

                text:
                  "Creating greater visibility and competitive opportunities for emerging and established professional fighters.",
              },
              {
                title:
                  "Champions & Titles",

                text:
                  "Recognition of HBE champions, titleholders, championship histories and successful title defenses.",
              },
              {
                title:
                  "Professional Events",

                text:
                  "Fight nights, championship contests and international boxing events bringing fighters and fans together.",
              },
              {
                title:
                  "Officials",

                text:
                  "Supporting qualified referees, judges, supervisors and professional boxing officials.",
              },
              {
                title:
                  "Media",

                text:
                  "Fight coverage, interviews, weigh-ins, highlights, press conferences and original HBE content.",
              },
              {
                title:
                  "International Boxing",

                text:
                  "Connecting African boxing communities with regional and international competition.",
              },
              {
                title:
                  "Commercial Partnerships",

                text:
                  "Building relationships with sponsors, broadcasters, promoters, venues and strategic partners.",
              },
            ].map(
              (
                item
              ) => (

                <article
                  key={
                    item.title
                  }
                  className="border border-[#e5e0d8] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="h-1 w-12 bg-[#c6a24a]" />

                  <h3 className="mt-6 text-xl font-black uppercase">
                    {
                      item.title
                    }
                  </h3>

                  <p className="mt-4 leading-7 text-[#5f5b55]">
                    {
                      item.text
                    }
                  </p>

                </article>

              )
            )}

          </div>

        </div>

      </section>

      {/* =====================================
          PRINCIPLES
          ===================================== */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
            HBE Standards
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl">
            The Principles Behind HBE
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

            {[
              [
                "Integrity",

                "Professional boxing built around credibility, transparency and respect for the sport.",
              ],
              [
                "Opportunity",

                "Creating pathways for fighters to compete, develop and advance their professional careers.",
              ],
              [
                "Excellence",

                "Promoting professional standards across championships, events, officials and operations.",
              ],
              [
                "Global Connection",

                "Building bridges between African boxing communities and the international boxing world.",
              ],
            ].map(
              (
                [
                  title,
                  text,
                ]
              ) => (

                <div
                  key={
                    title
                  }
                  className="border-l-4 border-[#c6a24a] pl-6"
                >

                  <h3 className="text-xl font-black uppercase">
                    {
                      title
                    }
                  </h3>

                  <p className="mt-4 leading-7 text-[#5f5b55]">
                    {
                      text
                    }
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>

      {/* =====================================
          LEADERSHIP
          ===================================== */}
      <section className="bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
            HBE Leadership
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl">
            Leadership & Governance
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <p className="mt-7 max-w-3xl leading-8 text-[#5f5b55]">
            HBE leadership and governance are
            responsible for protecting the
            credibility of the organization,
            supporting professional boxing
            standards and guiding the continued
            development of HBE across African and
            international boxing markets.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* CEO / FOUNDER */}
            <div className="border border-[#e5e0d8] bg-white p-7">

              <p className="text-xs font-black uppercase tracking-widest text-[#941f25]">
                CEO / Founder
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase">
                Chinedu Okeke
              </h3>

              <a
                href="tel:+2348064488619"
                className="mt-4 block text-base font-bold text-[#5f5b55] transition hover:text-[#941f25]"
              >
                +234 806 448 8619
              </a>

            </div>

            {/* VP USA */}
            <div className="border border-[#e5e0d8] bg-white p-7">

              <p className="text-xs font-black uppercase tracking-widest text-[#941f25]">
                Vice President – HBE USA
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase">
                Empress Keisha Morrisey
              </h3>

              <a
                href="tel:+16468363668"
                className="mt-4 block text-base font-bold text-[#5f5b55] transition hover:text-[#941f25]"
              >
                +1 646 836 3668
              </a>

            </div>

            {/* SENIOR ADVISER */}
            <div className="border border-[#e5e0d8] bg-white p-7">

              <p className="text-xs font-black uppercase tracking-widest text-[#941f25]">
                Senior Adviser &amp; International
                Representative
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase">
                Pst. Henry Okafor
              </h3>

              <a
                href="tel:+16783602484"
                className="mt-4 block text-base font-bold text-[#5f5b55] transition hover:text-[#941f25]"
              >
                +1 678 360 2484
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          HBE RING OFFICIALS
          ===================================== */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
              HBE Ring Officials
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
              Referees &amp; Judges
            </h2>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl leading-8 text-[#5f5b55]">
              Heritage Boxing Entertainment ring
              officials support professional boxing
              standards, fair competition, fighter
              safety and credible championship
              contests. HBE works with qualified
              referees and judges committed to
              integrity, professionalism and
              respect for the sport.
            </p>

          </div>

          {/* =================================
              OFFICIALS GRID
              ================================= */}
          <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {ringOfficials.map(
              (
                official,
                index
              ) => (

                <article
                  key={
                    `${official.name}-${index}`
                  }
                  className="group overflow-hidden border border-[#e5e0d8] bg-[#f7f4ef] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#c6a24a] hover:shadow-lg"
                >

                  {/* PHOTO */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e8e3dc]">

                    <Image
                      src={
                        official.image
                      }
                      alt={
                        `${official.name} - HBE ${official.role}`
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    />

                    {/* BOTTOM PHOTO GRADIENT */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

                    {/* LABEL */}
                    <div className="absolute bottom-4 left-4">

                      <span className="inline-flex bg-[#941f25] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                        HBE Ring Official
                      </span>

                    </div>

                  </div>

                  {/* OFFICIAL INFORMATION */}
                  <div className="border-t-4 border-[#c6a24a] bg-white p-6">

                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#941f25]">
                      {
                        official.role
                      }
                    </p>

                    <h3 className="mt-3 text-xl font-black uppercase leading-tight text-[#171717] sm:text-2xl">
                      {
                        official.name
                      }
                    </h3>

                    <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-[#817a73]">
                      Heritage Boxing Entertainment
                    </p>

                  </div>

                </article>

              )
            )}

          </div>

          {/* =================================
              OFFICIALS STANDARD
              ================================= */}
          <div className="mt-10 border-l-4 border-[#c6a24a] bg-[#f7f4ef] p-6 sm:p-8">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
              Professional Officiating
            </p>

            <p className="mt-4 max-w-4xl leading-8 text-[#5f5b55]">
              HBE referees and judges play an
              important role in maintaining the
              integrity of professional contests.
              Ring officials are expected to
              support fair competition, apply
              professional boxing standards and
              protect the safety and interests of
              participating fighters.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================
          FINAL CTA
          ===================================== */}
      <section className="bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-white p-8 text-[#171717] sm:p-12">

            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#941f25]">
              Join The HBE Platform
            </p>

            <h2 className="mt-4 max-w-4xl text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
              Be Part Of The Future Of
              Professional Boxing
            </h2>

            <p className="mt-6 max-w-3xl leading-8 text-[#5f5b55]">
              Explore HBE champions, fighters,
              rankings and events or discover
              opportunities to work with Heritage
              Boxing Entertainment as a promoter,
              broadcaster, sponsor or strategic
              partner.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/champions"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-center font-black uppercase text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                View Champions
              </Link>

              <Link
                href="/boxers"
                className="hbe-secondary-cta inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-center font-black uppercase text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] active:border-[#171717] active:bg-[#171717] active:text-white sm:w-auto"
              >
                Explore Boxers
              </Link>

              <Link
                href="/partners"
                className="inline-flex min-h-[52px] w-full items-center justify-center border-2 border-[#171717] bg-transparent px-7 py-3 text-center font-black uppercase text-[#171717] transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:!border-[#171717] hover:!bg-[#171717] hover:!text-white focus:!border-[#171717] focus:!bg-[#171717] focus:!text-white active:!border-[#171717] active:!bg-[#171717] active:!text-white sm:w-auto"
              >
                Partner With HBE
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}