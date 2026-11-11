import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import PublicChrome from "./components/PublicChrome";

const geistSans = Geist({
  variable:
    "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",
    subsets: ["latin"],
  });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(
    /\/$/,
    ""
  );

export const metadata: Metadata = {
  title: {
    default:
      "Heritage Boxing Entertainment | Professional Boxing Across Africa",
    template:
      "%s | Heritage Boxing Entertainment",
  },

  description:
    "Heritage Boxing Entertainment promotes professional fighters, championship boxing, rankings, events, media and partnerships across Africa and international markets.",

  keywords: [
    "Heritage Boxing Entertainment",
    "HBE Boxing",
    "African boxing",
    "boxing Africa",
    "professional boxing Africa",
    "professional boxers Africa",
    "boxing events Africa",
    "boxing champions Africa",
    "boxing rankings Africa",
    "boxing Nigeria",
    "African boxers",
    "championship boxing",
    "boxing promotion Africa",
  ],

  applicationName:
    "Heritage Boxing Entertainment",

  authors: [
    {
      name:
        "Heritage Boxing Entertainment",
    },
  ],

  creator:
    "Heritage Boxing Entertainment",

  publisher:
    "Heritage Boxing Entertainment",

  category: "sports",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-image-preview":
        "large",

      "max-snippet": -1,

      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",

    locale: "en_US",

    siteName:
      "Heritage Boxing Entertainment",

    title:
      "Heritage Boxing Entertainment | Professional Boxing Across Africa",

    description:
      "Professional fighters, championships, rankings, events, media and boxing opportunities across Africa and international markets.",
  },

  twitter: {
    card: "summary",

    title:
      "Heritage Boxing Entertainment | HBE Boxing",

    description:
      "Professional boxing, fighters, championships, rankings and events across Africa and international markets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
    ORGANIZATION SCHEMA

    This is only added when
    NEXT_PUBLIC_SITE_URL exists.

    That prevents localhost from
    accidentally becoming your
    production SEO URL.
  */
  const organizationSchema =
    siteUrl
      ? {
          "@context":
            "https://schema.org",

          "@type":
            "SportsOrganization",

          "@id":
            `${siteUrl}/#organization`,

          name:
            "Heritage Boxing Entertainment",

          alternateName:
            "HBE",

          url: siteUrl,

          description:
            "Heritage Boxing Entertainment promotes professional fighters, championship boxing, events, rankings, media and strategic boxing opportunities across Africa and international markets.",

          sport: "Boxing",

          areaServed: [
            "Africa",
            "Nigeria",
            "International",
          ],

          email:
            "hbeboxing@gmail.com",

          telephone:
            "+2348064488619",

          sameAs: [
            "https://www.facebook.com/share/1FrBP32M78/",
            "https://www.instagram.com/hbeboxing",
            "https://youtube.com/@hbeboxing",
            "https://www.tiktok.com/@hbeboxingafrica",
          ],
        }
      : null;

  /*
    WEBSITE SCHEMA
  */
  const websiteSchema =
    siteUrl
      ? {
          "@context":
            "https://schema.org",

          "@type":
            "WebSite",

          "@id":
            `${siteUrl}/#website`,

          url: siteUrl,

          name:
            "Heritage Boxing Entertainment",

          alternateName:
            "HBE Boxing",

          publisher: {
            "@id":
              `${siteUrl}/#organization`,
          },

          inLanguage: "en",
        }
      : null;

  return (
    <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
      >

        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  organizationSchema
                ),
            }}
          />
        )}

        {websiteSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                JSON.stringify(
                  websiteSchema
                ),
            }}
          />
        )}

        <PublicChrome>
          {children}
        </PublicChrome>

      </body>

    </html>
  );
}