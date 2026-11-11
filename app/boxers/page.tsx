import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

export const metadata: Metadata = {
  title: "HBE Boxers | Professional Fighters Across Africa",

  description:
    "Explore Heritage Boxing Entertainment professional fighters, boxer profiles, records, divisions and championship pathways across Africa and international boxing markets.",

  alternates: {
    canonical: `${siteUrl}/boxers`,
  },

  openGraph: {
    type: "website",
    url: `${siteUrl}/boxers`,
    siteName: "Heritage Boxing Entertainment",
    title:
      "HBE Boxers | Professional Fighters Across Africa",
    description:
      "Meet professional fighters representing Heritage Boxing Entertainment across boxing divisions, championship pathways and international markets.",
    images: [
      {
        url: `${siteUrl}/images/boxers-hero.png`,
        alt:
          "Heritage Boxing Entertainment professional fighters",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "HBE Boxers | Professional Fighters Across Africa",
    description:
      "Explore HBE professional fighters, boxing records, divisions and championship pathways.",
    images: [
      `${siteUrl}/images/boxers-hero.png`,
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function BoxersPage() {
  const { data: boxers, error } = await supabase
    .from("boxer_profiles")
    .select("*")
    .eq("active", true)
    .order("full_name", {
      ascending: true,
    });

  if (error) {
    return (
      <main className="min-h-screen bg-white px-4 py-16 text-black sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <h1 className="text-3xl font-black uppercase">
            Database Connection Error
          </h1>

          <p className="mt-4 text-red-700">
            {error.message}
          </p>

        </div>

      </main>
    );
  }

  /*
    BOXERS DIRECTORY SCHEMA
  */
  const boxersPageSchema = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id":
      `${siteUrl}/boxers#webpage`,

    url:
      `${siteUrl}/boxers`,

    name:
      "HBE Boxers | Professional Fighters Across Africa",

    description:
      "The official Heritage Boxing Entertainment fighter directory featuring professional boxer profiles, records, divisions and championship pathways.",

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
        `${siteUrl}/images/boxers-hero.png`,
    },

    inLanguage: "en",
  };

  /*
    BOXER LIST SCHEMA

    Each boxer points to his or her
    individual HBE profile page.
  */
  const boxerListSchema = {
    "@context": "https://schema.org",

    "@type": "ItemList",

    name:
      "Heritage Boxing Entertainment Professional Fighters",

    url:
      `${siteUrl}/boxers`,

    numberOfItems:
      boxers?.length || 0,

    itemListElement:
      (boxers || [])
        .filter(
          (boxer) =>
            boxer.profile_slug
        )
        .map(
          (boxer, index) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            url:
              `${siteUrl}/boxers/${boxer.profile_slug}`,

            item: {
              "@type":
                "Person",

              "@id":
                `${siteUrl}/boxers/${boxer.profile_slug}#person`,

              name:
                boxer.full_name,

              url:
                `${siteUrl}/boxers/${boxer.profile_slug}`,

              image:
                boxer.photo_url ||
                undefined,

              alternateName:
                boxer.nickname ||
                undefined,

              memberOf: {
                "@id":
                  `${siteUrl}/#organization`,
              },
            },
          })
        ),
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef]">

      {/* BOXERS PAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              boxersPageSchema
            ),
        }}
      />

      {/* BOXER LIST SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              boxerListSchema
            ),
        }}
      />

      {/* BOXERS HERO */}
      <section
        className="relative isolate overflow-hidden bg-cover bg-[position:72%_center] bg-no-repeat sm:bg-center"
        style={{
          backgroundImage:
            "url('/images/boxers-hero.png')",
        }}
      >

        {/* STANDARD 55% DARKNESS */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LIGHT SUPPORTING GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[560px] sm:items-center sm:px-6 sm:py-16 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e0c273] sm:text-sm">
              HBE Fighters
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              HBE Boxers
            </h1>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/95 sm:text-xl">
              Explore professional fighters competing across
              HBE divisions and representing the future of
              championship boxing across Africa and the
              international stage.
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
                href="/boxers/apply"
                className="hbe-secondary-cta inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] active:border-[#171717] active:bg-[#171717] active:text-white sm:w-auto"
              >
                Apply To HBE
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* BOXER DIRECTORY */}
      <section className="bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="mb-12">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
              HBE Fighter Roster
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase text-[#171717] sm:text-4xl lg:text-5xl">
              Professional Fighters
            </h2>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
              Meet the fighters representing Heritage Boxing
              Entertainment across professional boxing
              divisions.
            </p>

          </div>

          {boxers && boxers.length > 0 ? (

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {boxers.map((boxer) => (

                <article
                  key={boxer.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* BOXER PHOTO */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#efebe5] sm:aspect-[3/4]">

                    {boxer.photo_url ? (

                      <Image
                        src={
                          boxer.photo_url
                        }
                        alt={
                          `${boxer.full_name} professional boxer with Heritage Boxing Entertainment`
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain object-center transition duration-500 hover:scale-[1.03] sm:object-cover sm:object-top lg:object-center"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center px-6 text-center text-[#777]">
                        Photo coming soon
                      </div>

                    )}

                  </div>

                  {/* BOXER INFORMATION */}
                  <div className="p-6 sm:p-7">

                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                      {boxer.division}
                    </p>

                    <h2 className="mt-3 text-2xl font-black uppercase leading-tight text-[#171717]">
                      {boxer.full_name}
                    </h2>

                    {boxer.nickname ? (

                      <p className="mt-2 italic text-[#5f5b55]">
                        &quot;
                        {boxer.nickname}
                        &quot;
                      </p>

                    ) : null}

                    <div className="mt-5 border-t border-[#eee9e2] pt-5">

                      <p className="text-base font-bold text-[#171717]">
                        Record: {boxer.record}
                      </p>

                      <p className="mt-2 text-[#5f5b55]">
                        {boxer.state_region
                          ? `${boxer.state_region}, `
                          : ""}
                        {boxer.country}
                      </p>

                    </div>

                    {/* PROFILE BUTTON */}
                    {boxer.profile_slug ? (

                      <Link
                        href={`/boxers/${boxer.profile_slug}`}
                        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
                      >
                        View Profile
                      </Link>

                    ) : (

                      <div className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center border border-[#d8d2ca] bg-[#f7f4ef] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#7a746d] sm:w-auto">
                        Profile Coming Soon
                      </div>

                    )}

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="border border-[#e5e0d8] bg-white p-8 text-center sm:p-10">

              <p className="text-lg font-bold text-[#171717]">
                HBE boxer profiles are being updated.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* BECOME AN HBE BOXER */}
      <section className="border-t border-[#e5e0d8] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

            {/* LEFT SIDE */}
            <div>

              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
                Fighter Opportunities
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-black uppercase leading-tight text-[#171717] sm:text-5xl lg:text-6xl">
                Want To Become
                <br />
                An HBE Boxer?
              </h2>

              <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#5f5b55] sm:text-lg">
                Professional and debut fighters can submit
                their boxing profile to Heritage Boxing
                Entertainment for consideration.
              </p>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6f6962]">
                Submit your experience, fight record,
                division, contact information and boxer
                profile for review by HBE.
              </p>

            </div>

            {/* RIGHT SIDE */}
            <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-[#f7f4ef] p-7 sm:p-9">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Boxer Application
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-[#171717] sm:text-3xl">
                Join The HBE Fighter Network
              </h3>

              <p className="mt-5 leading-7 text-[#5f5b55]">
                Complete the official HBE boxer application.
                Your submission will be reviewed before any
                fighter profile is published.
              </p>

              <Link
                href="/boxers/apply"
                className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                Apply To HBE
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}