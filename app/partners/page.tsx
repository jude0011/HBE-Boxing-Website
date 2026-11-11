import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

export const metadata: Metadata = {
  title:
    "HBE Boxing Partnerships | Sponsors, Brands & Media Partners",

  description:
    "Explore sponsorship, brand, media, broadcast, venue, fighter and strategic partnership opportunities with Heritage Boxing Entertainment.",

  alternates: {
    canonical: `${siteUrl}/partners`,
  },

  openGraph: {
    type: "website",
    url: `${siteUrl}/partners`,
    siteName:
      "Heritage Boxing Entertainment",
    title:
      "HBE Boxing Partnerships | Sponsors, Brands & Media Partners",
    description:
      "Partner with Heritage Boxing Entertainment through sponsorship, media, broadcast, venue, brand and strategic boxing opportunities.",
    images: [
      {
        url:
          `${siteUrl}/images/partners-hero.png`,
        alt:
          "Heritage Boxing Entertainment partnerships and sponsorship opportunities",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "HBE Boxing Partnerships | Sponsors, Brands & Media Partners",
    description:
      "Explore sponsorship, brand, media, venue and strategic partnership opportunities with HBE.",
    images: [
      `${siteUrl}/images/partners-hero.png`,
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

type PartnerRow = {
  id: string;
  name: string;
  partner_type: string | null;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  display_order: number | null;
  active: boolean | null;
};

const opportunities = [
  {
    title: "Event Sponsorship",
    description:
      "Align your brand with HBE fight nights, championships and live boxing experiences.",
  },
  {
    title: "Championship Sponsorship",
    description:
      "Support championship bouts, title opportunities and major HBE boxing moments.",
  },
  {
    title: "Broadcast & Media",
    description:
      "Work with HBE across digital media, broadcast opportunities, video content and event coverage.",
  },
  {
    title: "Brand Partnerships",
    description:
      "Create meaningful collaborations between HBE, professional fighters and consumer brands.",
  },
  {
    title: "Venue Partnerships",
    description:
      "Partner with HBE to host professional boxing events, championships and special fight nights.",
  },
  {
    title: "Corporate Partnerships",
    description:
      "Build long-term commercial relationships that support HBE growth, athletes and international expansion.",
  },
];

export default async function PartnersPage() {
  const {
    data: partnerData,
    error,
  } = await supabase
    .from("partners")
    .select(`
      id,
      name,
      partner_type,
      logo_url,
      website_url,
      description,
      display_order,
      active
    `)
    .eq("active", true)
    .order("display_order", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    console.error(
      "Error loading HBE partners:",
      error
    );
  }

  const partners =
    (partnerData as PartnerRow[]) || [];

  /*
    PARTNERS PAGE SCHEMA
  */
  const partnersPageSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${siteUrl}/partners#webpage`,

    url:
      `${siteUrl}/partners`,

    name:
      "HBE Boxing Partnerships | Sponsors, Brands & Media Partners",

    description:
      "Heritage Boxing Entertainment partnership opportunities for sponsors, brands, broadcasters, venues, promoters and strategic partners.",

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
        `${siteUrl}/images/partners-hero.png`,
    },

    inLanguage: "en",
  };

  /*
    CURRENT PARTNERS ITEM LIST
  */
  const partnersListSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "ItemList",

    name:
      "Heritage Boxing Entertainment Partners",

    url:
      `${siteUrl}/partners`,

    numberOfItems:
      partners.length,

    itemListElement:
      partners.map(
        (partner, index) => ({
          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            partner.name,

          item: {
            "@type":
              "Organization",

            name:
              partner.name,

            description:
              partner.description ||
              undefined,

            url:
              partner.website_url ||
              undefined,

            logo:
              partner.logo_url ||
              undefined,

            memberOf: {
              "@id":
                `${siteUrl}/#organization`,
            },
          },
        })
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
          "Partners",

        item:
          `${siteUrl}/partners`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171717]">

      {/* PARTNERS PAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              partnersPageSchema
            ),
        }}
      />

      {/* PARTNERS LIST SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              partnersListSchema
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
        className="relative isolate overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/partners-hero.png')",
        }}
      >

        {/* STANDARD 55% DARKNESS */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LIGHT SUPPORTING GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[560px] sm:items-center sm:px-6 sm:py-16 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e0c273] sm:text-sm">
              Partner With HBE
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              Build With Heritage Boxing Entertainment
            </h1>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/95 sm:text-xl">
              Partner with HBE through sponsorship, media, events,
              venues, brand collaborations and strategic opportunities
              across professional boxing.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/contact"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                Become A Partner
              </Link>

              <Link
                href="#partners"
                className="hbe-secondary-cta inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] active:border-[#171717] active:bg-[#171717] active:text-white sm:w-auto"
              >
                View Partners
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* INTRO */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
            Strategic Partnerships
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
            Grow With HBE
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <p className="mt-7 max-w-4xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            Heritage Boxing Entertainment creates opportunities for
            brands, sponsors, promoters, broadcasters, venues and
            corporate partners to connect with professional boxing,
            fighters and audiences across Africa and international
            markets.
          </p>

        </div>

      </section>

      {/* PARTNERSHIP OPPORTUNITIES */}
      <section className="bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="mb-10">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
              Partnership Opportunities
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
              Ways To Partner
            </h2>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {opportunities.map(
              (opportunity) => (

                <article
                  key={
                    opportunity.title
                  }
                  className="border border-[#e5e0d8] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
                >

                  <div className="h-1 w-12 bg-[#c6a24a]" />

                  <h3 className="mt-6 text-xl font-black uppercase leading-tight">
                    {
                      opportunity.title
                    }
                  </h3>

                  <p className="mt-4 leading-7 text-[#5f5b55]">
                    {
                      opportunity.description
                    }
                  </p>

                </article>

              )
            )}

          </div>

        </div>

      </section>

      {/* FIGHTER PARTNERSHIPS */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
                Fighter Partnerships
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
                Partner With HBE Fighters
              </h2>

              <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

              <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
                Brands can work with HBE fighters through sponsorship,
                apparel, endorsements, appearances, promotional
                campaigns and digital content collaborations.
              </p>

              <Link
                href="/boxers"
                className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                View HBE Boxers
              </Link>

            </div>

            {/* CONSISTENT IVORY CARD */}
            <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-[#f7f4ef] p-7 sm:p-9">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Brand Opportunities
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase">
                Beyond Fight Night
              </h3>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                Fighter partnerships can create visibility before,
                during and after events through athlete storytelling,
                social content, media appearances and long-term brand
                relationships.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CURRENT PARTNERS */}
      <section
        id="partners"
        className="scroll-mt-24 bg-[#f7f4ef]"
      >

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="mb-10">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
              HBE Partners
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
              Our Partners
            </h2>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          </div>

          {partners.length > 0 ? (

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {partners.map((partner) => {
                const card = (

                  <article className="flex h-full flex-col border border-[#e5e0d8] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                    {/* LOGO */}
                    <div className="relative flex min-h-[150px] items-center justify-center border-b border-[#eee9e2] pb-6">

                      {partner.logo_url ? (

                        <div className="relative h-24 w-full max-w-[220px]">

                          <Image
                            src={
                              partner.logo_url
                            }
                            alt={`${partner.name} partner logo`}
                            fill
                            sizes="220px"
                            className="object-contain"
                          />

                        </div>

                      ) : (

                        <div className="text-center text-sm font-bold uppercase tracking-wide text-[#88817a]">
                          Partner Logo
                        </div>

                      )}

                    </div>

                    <div className="flex flex-1 flex-col pt-6">

                      {partner.partner_type && (

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                          {
                            partner.partner_type
                          }
                        </p>

                      )}

                      <h3 className="mt-3 text-xl font-black uppercase leading-tight">
                        {
                          partner.name
                        }
                      </h3>

                      {partner.description && (

                        <p className="mt-4 flex-1 text-sm leading-7 text-[#5f5b55]">
                          {
                            partner.description
                          }
                        </p>

                      )}

                      {partner.website_url && (

                        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#941f25]">
                          Visit Partner →
                        </p>

                      )}

                    </div>

                  </article>

                );

                if (
                  partner.website_url
                ) {
                  return (

                    <a
                      key={
                        partner.id
                      }
                      href={
                        partner.website_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {card}
                    </a>

                  );
                }

                return (

                  <div
                    key={
                      partner.id
                    }
                    className="h-full"
                  >
                    {card}
                  </div>

                );
              })}

            </div>

          ) : (

            <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-white p-8 text-center sm:p-12">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Partnership Network
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase sm:text-3xl">
                Partner Announcements Coming Soon
              </h3>

              <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#5f5b55]">
                HBE partner organizations and sponsors will be featured
                here as partnerships are officially announced.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="border-t border-[#e5e0d8] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-[#f7f4ef] p-8 text-center sm:p-10 lg:p-12">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
              Partner With HBE
            </p>

            <h2 className="mx-auto mt-4 max-w-5xl text-3xl font-black uppercase leading-tight text-[#171717] sm:text-4xl lg:text-5xl">
              Build The Future Of Boxing With Heritage Boxing Entertainment
            </h2>

            <div className="mx-auto mt-5 h-1 w-20 bg-[#c6a24a]" />

            <p className="mx-auto mt-7 max-w-4xl text-base leading-8 text-[#5f5b55] sm:text-lg">
              Connect with HBE to discuss sponsorship, media, venue,
              broadcast, brand and strategic partnership opportunities.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
            >
              Start A Partnership Conversation
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}