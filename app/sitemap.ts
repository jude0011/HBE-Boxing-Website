import type { MetadataRoute } from "next";

import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://hbeboxing.com";

  /*
    STATIC PUBLIC PAGES
  */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${siteUrl}/hbe`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/boxers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/rankings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/champions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/media`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${siteUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${siteUrl}/boxers/apply`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  /*
    DYNAMIC BOXER PAGES
  */
  const {
    data: boxerData,
    error: boxerError,
  } = await supabase
    .from("boxers")
    .select(`
      profile_slug,
      active
    `)
    .eq("active", true)
    .not("profile_slug", "is", null);

  if (boxerError) {
    console.error(
      "Sitemap boxer error:",
      boxerError
    );
  }

  const boxerPages: MetadataRoute.Sitemap =
    (boxerData || [])
      .filter(
        (boxer) =>
          boxer.profile_slug
      )
      .map((boxer) => ({
        url:
          `${siteUrl}/boxers/${boxer.profile_slug}`,

        lastModified:
          new Date(),

        changeFrequency:
          "weekly" as const,

        priority: 0.8,
      }));

  /*
    DYNAMIC EVENT PAGES
  */
  const {
    data: eventData,
    error: eventError,
  } = await supabase
    .from("events")
    .select(`
      event_slug,
      event_date,
      status
    `)
    .not("event_slug", "is", null);

  if (eventError) {
    console.error(
      "Sitemap event error:",
      eventError
    );
  }

  const eventPages: MetadataRoute.Sitemap =
    (eventData || [])
      .filter(
        (event) =>
          event.event_slug
      )
      .map((event) => ({
        url:
          `${siteUrl}/events/${event.event_slug}`,

        lastModified:
          event.event_date
            ? new Date(
                event.event_date
              )
            : new Date(),

        changeFrequency:
          event.status === "upcoming"
            ? ("weekly" as const)
            : ("monthly" as const),

        priority:
          event.status === "upcoming"
            ? 0.9
            : 0.7,
      }));

  return [
    ...staticPages,
    ...boxerPages,
    ...eventPages,
  ];
}