import type { Metadata } from "next";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

export const metadata: Metadata = {
  title: "HBE Boxing Media | Videos, Highlights & Interviews",

  description:
    "Watch Heritage Boxing Entertainment fight highlights, boxer interviews, championship moments, videos and the latest HBE boxing news.",

  alternates: {
    canonical: `${siteUrl}/media`,
  },

  openGraph: {
    type: "website",
    url: `${siteUrl}/media`,
    siteName: "Heritage Boxing Entertainment",
    title:
      "HBE Boxing Media | Videos, Highlights & Interviews",
    description:
      "Watch HBE boxing highlights, interviews, championship moments, original videos and the latest Heritage Boxing Entertainment news.",
    images: [
      {
        url: `${siteUrl}/images/media-hero.png`,
        alt:
          "Heritage Boxing Entertainment boxing videos, highlights and media",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "HBE Boxing Media | Videos, Highlights & Interviews",
    description:
      "HBE boxing highlights, interviews, championship moments, original videos and boxing news.",
    images: [
      `${siteUrl}/images/media-hero.png`,
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

type MediaRow = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  platform: string | null;
  published: boolean | null;
  published_at: string | null;
};

type NewsRow = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  source_url: string | null;
  published: boolean | null;
  published_at: string | null;
};

function getYouTubeId(url: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname
        .replace("/", "")
        .split("?")[0];
    }

    if (parsedUrl.pathname.includes("/shorts/")) {
      return (
        parsedUrl.pathname
          .split("/shorts/")[1]
          ?.split("/")[0] || null
      );
    }

    if (
      parsedUrl.hostname.includes(
        "youtube.com"
      )
    ) {
      return parsedUrl.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default async function MediaPage() {
  /*
    LOAD VIDEOS
  */
  const {
    data: mediaData,
    error: mediaError,
  } = await supabase
    .from("media")
    .select(`
      id,
      title,
      slug,
      description,
      video_url,
      thumbnail_url,
      platform,
      published,
      published_at
    `)
    .eq("published", true)
    .order("published_at", {
      ascending: false,
    });

  if (mediaError) {
    console.error(
      "Error loading HBE media:",
      mediaError
    );
  }

  /*
    LOAD NEWS
  */
  const {
    data: newsData,
    error: newsError,
  } = await supabase
    .from("news")
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      featured_image_url,
      source_url,
      published,
      published_at
    `)
    .eq("published", true)
    .order("published_at", {
      ascending: false,
    })
    .limit(6);

  if (newsError) {
    console.error(
      "Error loading HBE news:",
      newsError
    );
  }

  const videos =
    (mediaData as MediaRow[]) || [];

  const news =
    (newsData as NewsRow[]) || [];

  const featuredVideo =
    videos[0] || null;

  const additionalVideos =
    videos.slice(1);

  const featuredVideoId =
    featuredVideo
      ? getYouTubeId(
          featuredVideo.video_url
        )
      : null;

  /*
    MEDIA PAGE SCHEMA
  */
  const mediaPageSchema = {
    "@context": "https://schema.org",

    "@type": "CollectionPage",

    "@id":
      `${siteUrl}/media#webpage`,

    url:
      `${siteUrl}/media`,

    name:
      "HBE Boxing Media | Videos, Highlights & Interviews",

    description:
      "Heritage Boxing Entertainment media center featuring fight highlights, boxer interviews, championship moments, videos and boxing news.",

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
        `${siteUrl}/images/media-hero.png`,
    },

    inLanguage: "en",
  };

  /*
    VIDEO ITEM LIST SCHEMA
  */
  const videoListSchema = {
    "@context": "https://schema.org",

    "@type": "ItemList",

    name:
      "Heritage Boxing Entertainment Videos",

    url:
      `${siteUrl}/media`,

    numberOfItems:
      videos.length,

    itemListElement:
      videos.map(
        (video, index) => {
          const videoId =
            getYouTubeId(
              video.video_url
            );

          return {
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              video.title,

            item: {
              "@type":
                "VideoObject",

              name:
                video.title,

              description:
                video.description ||
                undefined,

              thumbnailUrl:
                video.thumbnail_url
                  ? [
                      video.thumbnail_url,
                    ]
                  : videoId
                  ? [
                      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    ]
                  : undefined,

              uploadDate:
                video.published_at ||
                undefined,

              contentUrl:
                video.video_url ||
                undefined,

              embedUrl:
                videoId
                  ? `https://www.youtube.com/embed/${videoId}`
                  : undefined,

              publisher: {
                "@id":
                  `${siteUrl}/#organization`,
              },
            },
          };
        }
      ),
  };

  /*
    NEWS ITEM LIST SCHEMA
  */
  const newsListSchema = {
    "@context": "https://schema.org",

    "@type": "ItemList",

    name:
      "Latest HBE Boxing News",

    numberOfItems:
      news.length,

    itemListElement:
      news.map(
        (story, index) => ({
          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            story.title,

          item: {
            "@type":
              "NewsArticle",

            headline:
              story.title,

            description:
              story.excerpt ||
              undefined,

            image:
              story.featured_image_url
                ? [
                    story.featured_image_url,
                  ]
                : undefined,

            datePublished:
              story.published_at ||
              undefined,

            publisher: {
              "@id":
                `${siteUrl}/#organization`,
            },

            url:
              story.slug
                ? `${siteUrl}/news/${story.slug}`
                : story.source_url ||
                  undefined,
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
          "Media",

        item:
          `${siteUrl}/media`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171717]">

      {/* MEDIA PAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              mediaPageSchema
            ),
        }}
      />

      {/* VIDEO LIST SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              videoListSchema
            ),
        }}
      />

      {/* NEWS LIST SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              newsListSchema
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
            "url('/images/media-hero.png')",
        }}
      >

        {/* STANDARD 55% DARKNESS */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LIGHT SUPPORTING GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[560px] sm:items-center sm:px-6 sm:py-16 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e0c273] sm:text-sm">
              Watch HBE
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              HBE Media
            </h1>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/95 sm:text-xl">
              Fight highlights, championship moments, interviews,
              original boxing content and the latest news from
              Heritage Boxing Entertainment and the world of boxing.
            </p>

            {/* HERO BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="#videos"
                className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
              >
                Watch Videos
              </Link>

              <Link
                href="#news"
                className="hbe-secondary-cta inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] active:border-[#171717] active:bg-[#171717] active:text-white sm:w-auto"
              >
                Latest News
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* INTRO */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
            HBE Media Center
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
            Inside The World Of HBE
          </h2>

          <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            Watch HBE boxing action, highlights and original content,
            while staying connected to the latest HBE and boxing news.
          </p>

        </div>

      </section>

      {/* FEATURED MEDIA + NEWS */}
      <section
        id="videos"
        className="scroll-mt-24 bg-[#f7f4ef]"
      >

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="grid gap-10 lg:grid-cols-[1.6fr_0.8fr]">

            {/* FEATURED VIDEO */}
            <div>

              <div className="mb-6">

                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
                  Featured Video
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
                  Watch HBE
                </h2>

                <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              </div>

              {featuredVideo ? (

                <article className="overflow-hidden bg-white shadow-lg ring-1 ring-black/5">

                  {/* VIDEO */}
                  <div className="relative aspect-video overflow-hidden bg-[#171717]">

                    {featuredVideoId ? (

                      <iframe
                        src={`https://www.youtube.com/embed/${featuredVideoId}`}
                        title={
                          featuredVideo.title
                        }
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />

                    ) : featuredVideo.thumbnail_url ? (

                      <div
                        className="h-full w-full bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage:
                            `url("${featuredVideo.thumbnail_url}")`,
                        }}
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-white/60">
                        HBE Video
                      </div>

                    )}

                  </div>

                  {/* FEATURED INFO */}
                  <div className="p-6 sm:p-8">

                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                      HBE Video
                    </p>

                    <h3 className="mt-3 text-2xl font-black uppercase leading-tight sm:text-3xl">
                      {featuredVideo.title}
                    </h3>

                    {featuredVideo.description && (

                      <p className="mt-4 max-w-3xl leading-7 text-[#5f5b55]">
                        {featuredVideo.description}
                      </p>

                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

                      {featuredVideo.video_url && (

                        <a
                          href={
                            featuredVideo.video_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
                        >
                          Watch On YouTube
                        </a>

                      )}

                      {featuredVideo.published_at && (

                        <span className="text-sm font-semibold text-[#77716b]">
                          {formatDate(
                            featuredVideo.published_at
                          )}
                        </span>

                      )}

                    </div>

                  </div>

                </article>

              ) : (

                <div className="border border-[#e5e0d8] bg-white p-10 text-center">

                  <p className="font-bold text-[#5f5b55]">
                    HBE video content is being updated.
                  </p>

                </div>

              )}

            </div>

            {/* NEWS SIDE */}
            <aside
              id="news"
              className="scroll-mt-24"
            >

              <div className="mb-6">

                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
                  Latest Updates
                </p>

                <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
                  HBE & Boxing News
                </h2>

                <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              </div>

              <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-white shadow-sm">

                {news.length > 0 ? (

                  news.map(
                    (story, index) => (

                      <article
                        key={story.id}
                        className={`p-6 ${
                          index !==
                          news.length - 1
                            ? "border-b border-[#e9e4dc]"
                            : ""
                        }`}
                      >

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#941f25]">
                            Boxing News
                          </span>

                          {story.published_at && (

                            <span className="text-xs text-[#8a847d]">
                              {formatDate(
                                story.published_at
                              )}
                            </span>

                          )}

                        </div>

                        <h3 className="mt-3 text-lg font-black uppercase leading-snug text-[#171717]">
                          {story.title}
                        </h3>

                        {story.excerpt && (

                          <p className="mt-3 text-sm leading-6 text-[#625d57]">
                            {story.excerpt}
                          </p>

                        )}

                        {story.source_url && (

                          <a
                            href={
                              story.source_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex text-xs font-black uppercase tracking-[0.15em] text-[#941f25] transition hover:text-[#74181d]"
                          >
                            Read Story →
                          </a>

                        )}

                      </article>

                    )
                  )

                ) : (

                  <div className="p-8 text-center">

                    <p className="text-[#625d57]">
                      Latest boxing news is being updated.
                    </p>

                  </div>

                )}

              </div>

            </aside>

          </div>

        </div>

      </section>

      {/* VIDEO CLIPS */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="mb-10">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
              HBE Video Library
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl lg:text-5xl">
              Latest Videos & Clips
            </h2>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

          </div>

          {additionalVideos.length > 0 ? (

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {additionalVideos.map(
                (video) => {
                  const videoId =
                    getYouTubeId(
                      video.video_url
                    );

                  const thumbnail =
                    video.thumbnail_url ||
                    (
                      videoId
                        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                        : null
                    );

                  return (

                    <article
                      key={video.id}
                      className="overflow-hidden bg-[#f7f4ef] shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >

                      {/* THUMBNAIL */}
                      <div className="relative aspect-video overflow-hidden bg-[#f7f4ef]">

                        {thumbnail ? (

                          <div
                            className="h-full w-full bg-cover bg-center bg-no-repeat transition duration-500 hover:scale-105"
                            style={{
                              backgroundImage:
                                `url("${thumbnail}")`,
                            }}
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center text-sm font-bold text-[#5f5b55]">
                            HBE Video
                          </div>

                        )}

                        {/* PLAY BUTTON */}
                        {video.video_url && (

                          <a
                            href={
                              video.video_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Watch ${video.title}`}
                            className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/25"
                          >

                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#941f25] text-2xl text-white shadow-lg">
                              ▶
                            </span>

                          </a>

                        )}

                        <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#e0c273]">
                          HBE Video
                        </div>

                      </div>

                      {/* VIDEO INFO */}
                      <div className="p-6">

                        <h3 className="text-xl font-black uppercase leading-tight">
                          {video.title}
                        </h3>

                        {video.description && (

                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#625d57]">
                            {video.description}
                          </p>

                        )}

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          {video.video_url && (

                            <a
                              href={
                                video.video_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
                            >
                              Watch Video
                            </a>

                          )}

                          {video.published_at && (

                            <span className="text-xs text-[#817a73]">
                              {formatDate(
                                video.published_at
                              )}
                            </span>

                          )}

                        </div>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          ) : (

            <div className="border border-[#e5e0d8] bg-[#f7f4ef] p-10 text-center">

              <p className="font-bold text-[#5f5b55]">
                More HBE videos are coming soon.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* MEDIA INFORMATION */}
      <section className="border-t border-[#e5e0d8] bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25]">
                Heritage Boxing Entertainment
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
                Boxing Beyond The Ring
              </h2>

              <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

              <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
                HBE Media brings fans closer to the fighters,
                championships, events and stories shaping Heritage
                Boxing Entertainment.
              </p>

            </div>

            {/* CONSISTENT IVORY CARD */}
            <div className="border border-[#e1dbd2] border-t-4 border-t-[#c6a24a] bg-[#f7f4ef] p-7 sm:p-9">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Follow The Action
              </p>

              <h3 className="mt-3 text-2xl font-black uppercase">
                More HBE Content
              </h3>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                New videos, highlights, interviews and boxing news
                will continue to be added as HBE expands.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}