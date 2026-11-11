import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

import {
  Mail,
  Phone,
} from "lucide-react";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hbeboxing.com";

export const metadata: Metadata = {
  title: "Contact HBE",

  description:
    "Contact Heritage Boxing Entertainment for fighter opportunities, boxing events, sponsorships, partnerships, media, broadcast opportunities and general inquiries.",

  alternates: {
    canonical: `${siteUrl}/contact`,
  },

  openGraph: {
    type: "website",
    url: `${siteUrl}/contact`,
    siteName:
      "Heritage Boxing Entertainment",

    title:
      "Contact HBE | Heritage Boxing Entertainment",

    description:
      "Contact Heritage Boxing Entertainment for fighter opportunities, boxing events, partnerships, sponsorships, media and professional boxing inquiries.",
  },

  twitter: {
    card: "summary",

    title:
      "Contact HBE | Heritage Boxing Entertainment",

    description:
      "Contact HBE for fighter opportunities, boxing events, partnerships, sponsorships, media and professional boxing inquiries.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const HBE_PHONE_DISPLAY =
  "+234 806 448 8619";

const HBE_PHONE_LINK =
  "+2348064488619";

const HBE_WHATSAPP_DISPLAY =
  "+234 806 448 8619";

const HBE_WHATSAPP_LINK =
  "2348064488619";

const HBE_EMAIL =
  "hbeboxing@gmail.com";

export default function ContactPage() {
  /*
    CONTACT PAGE SCHEMA
  */
  const contactPageSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "ContactPage",

    "@id":
      `${siteUrl}/contact#webpage`,

    url:
      `${siteUrl}/contact`,

    name:
      "Contact HBE | Heritage Boxing Entertainment",

    description:
      "Contact Heritage Boxing Entertainment for fighter opportunities, boxing events, sponsorships, partnerships, media, broadcast opportunities and general inquiries.",

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

    inLanguage:
      "en",
  };

  /*
    CONTACT POINT SCHEMA
  */
  const contactPointSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    "@id":
      `${siteUrl}/#organization`,

    name:
      "Heritage Boxing Entertainment",

    url:
      siteUrl,

    email:
      HBE_EMAIL,

    telephone:
      HBE_PHONE_LINK,

    contactPoint: [
      {
        "@type":
          "ContactPoint",

        telephone:
          HBE_PHONE_LINK,

        email:
          HBE_EMAIL,

        contactType:
          "general inquiries",

        availableLanguage: [
          "English",
        ],
      },
      {
        "@type":
          "ContactPoint",

        telephone:
          HBE_PHONE_LINK,

        contactType:
          "partnership inquiries",

        availableLanguage: [
          "English",
        ],
      },
      {
        "@type":
          "ContactPoint",

        telephone:
          HBE_PHONE_LINK,

        contactType:
          "fighter inquiries",

        availableLanguage: [
          "English",
        ],
      },
    ],

    sameAs: [
      "https://www.facebook.com/share/1FrBP32M78/",
      "https://www.instagram.com/hbeboxing",
      "https://youtube.com/@hbeboxing",
      "https://www.tiktok.com/@hbeboxingafrica",
    ],
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
          "Contact",

        item:
          `${siteUrl}/contact`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-[#171717]">

      {/* CONTACT PAGE SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              contactPageSchema
            ),
        }}
      />

      {/* CONTACT INFORMATION SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              contactPointSchema
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
      <section className="border-b border-[#e5e0d8] bg-[#f7f4ef]">

        <div className="mx-auto flex min-h-[360px] max-w-7xl items-start px-4 pb-10 pt-12 sm:min-h-0 sm:block sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
              Heritage Boxing Entertainment
            </p>

            <h1 className="mt-4 text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-[#171717] sm:text-5xl lg:text-6xl">
              Contact HBE
            </h1>

            <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
              Connect with Heritage Boxing
              Entertainment for general
              inquiries, fighter opportunities,
              events, sponsorships,
              partnerships, media, broadcast
              opportunities and professional
              boxing relationships.
            </p>

          </div>

        </div>

      </section>

      {/* CONTACT SECTION */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">

            {/* LEFT SIDE - CONTACT FORM */}
            <div>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Send A Message
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase leading-tight sm:text-4xl">
                Contact The HBE Team
              </h2>

              <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

              <p className="mt-6 max-w-2xl leading-8 text-[#5f5b55]">
                Complete the form below and
                your inquiry will be sent to
                the Heritage Boxing
                Entertainment team.
              </p>

              {/* WORKING CONTACT FORM */}
              <ContactForm />

            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-8">

              {/* DIRECT CONTACT */}
              <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-[#f7f4ef] p-7 sm:p-8">

                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                  Contact Information
                </p>

                <h3 className="mt-3 text-2xl font-black uppercase">
                  Reach The HBE Team
                </h3>

                <p className="mt-5 leading-8 text-[#5f5b55]">
                  Contact Heritage Boxing
                  Entertainment directly by
                  phone, WhatsApp or email.
                </p>

                <div className="mt-7 space-y-5">

                  {/* PHONE */}
                  <a
                    href={`tel:${HBE_PHONE_LINK}`}
                    className="flex items-start gap-4 border-b border-[#ddd7cf] pb-5 transition hover:text-[#941f25]"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
                      <Phone size={20} />
                    </div>

                    <div>

                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                        Phone
                      </p>

                      <p className="mt-1 font-bold">
                        {HBE_PHONE_DISPLAY}
                      </p>

                    </div>

                  </a>

                  {/* WHATSAPP */}
                  <a
                    href={`https://wa.me/${HBE_WHATSAPP_LINK}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 border-b border-[#ddd7cf] pb-5 transition hover:text-[#941f25]"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
                      <FaWhatsapp size={22} />
                    </div>

                    <div>

                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                        WhatsApp
                      </p>

                      <p className="mt-1 font-bold">
                        {HBE_WHATSAPP_DISPLAY}
                      </p>

                    </div>

                  </a>

                  {/* EMAIL */}
                  <a
                    href={`mailto:${HBE_EMAIL}`}
                    className="flex items-start gap-4 transition hover:text-[#941f25]"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
                      <Mail size={20} />
                    </div>

                    <div>

                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7a746d]">
                        Email
                      </p>

                      <p className="mt-1 break-all font-bold">
                        {HBE_EMAIL}
                      </p>

                    </div>

                  </a>

                </div>

              </div>

              {/* FIGHTERS */}
              <div className="border border-[#e5e0d8] bg-white p-7 sm:p-8">

                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                  Fighters
                </p>

                <h3 className="mt-3 text-2xl font-black uppercase">
                  Want To Join HBE?
                </h3>

                <p className="mt-4 leading-8 text-[#5f5b55]">
                  Professional and debut
                  fighters should use the
                  official HBE boxer application
                  instead of the general contact
                  form.
                </p>

                <Link
                  href="/boxers/apply"
                  className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center bg-[#941f25] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] active:bg-[#74181d] sm:w-auto"
                >
                  Apply To HBE
                </Link>

              </div>

              {/* PARTNERS */}
              <div className="border border-[#e5e0d8] border-t-4 border-t-[#c6a24a] bg-[#f7f4ef] p-7 sm:p-8">

                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                  Partnerships
                </p>

                <h3 className="mt-3 text-2xl font-black uppercase">
                  Partner With HBE
                </h3>

                <p className="mt-5 leading-8 text-[#5f5b55]">
                  Explore sponsorship,
                  broadcast, media, event and
                  commercial partnership
                  opportunities with Heritage
                  Boxing Entertainment.
                </p>

                <Link
                  href="/partners"
                  className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center border-2 border-[#171717] bg-transparent px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-[#171717] transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:!border-[#171717] hover:!bg-[#171717] hover:!text-white focus:!border-[#171717] focus:!bg-[#171717] focus:!text-white active:!border-[#171717] active:!bg-[#171717] active:!text-white sm:w-auto"
                >
                  Partnership Opportunities
                </Link>

              </div>

              {/* SOCIAL */}
              <div className="border border-[#e5e0d8] bg-white p-7 sm:p-8">

                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                  Follow HBE
                </p>

                <h3 className="mt-3 text-2xl font-black uppercase">
                  Stay Connected
                </h3>

                <p className="mt-4 leading-8 text-[#5f5b55]">
                  Follow Heritage Boxing
                  Entertainment for fighter
                  news, events, championship
                  updates and HBE media.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <a
                    href="https://www.facebook.com/share/1FrBP32M78/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="HBE Boxing on Facebook"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a24a]/40 bg-white text-[#171717] transition hover:border-[#941f25] hover:bg-[#941f25] hover:text-white"
                  >
                    <FaFacebookF size={20} />
                  </a>

                  <a
                    href="https://www.instagram.com/hbeboxing?vrfl=MXJ6NWx4bWdkcTAw"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="HBE Boxing on Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a24a]/40 bg-white text-[#171717] transition hover:border-[#941f25] hover:bg-[#941f25] hover:text-white"
                  >
                    <FaInstagram size={20} />
                  </a>

                  <a
                    href="https://youtube.com/@hbeboxing?si=Pefz_afKly26l9UN"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="HBE Boxing on YouTube"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a24a]/40 bg-white text-[#171717] transition hover:border-[#941f25] hover:bg-[#941f25] hover:text-white"
                  >
                    <FaYoutube size={20} />
                  </a>

                  <a
                    href="https://www.tiktok.com/@hbeboxingafrica?_r=1&_t=ZS-9Aqrk5kiLSO"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="HBE Boxing on TikTok"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a24a]/40 bg-white text-[#171717] transition hover:border-[#941f25] hover:bg-[#941f25] hover:text-white"
                  >
                    <FaTiktok size={20} />
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}