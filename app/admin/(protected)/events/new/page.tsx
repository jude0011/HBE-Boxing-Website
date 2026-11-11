"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

type Country = {
  id: string;
  name: string;
};

export default function NewEventPage() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [countries, setCountries] =
    useState<Country[]>([]);

  const [name, setName] =
    useState("");

  const [eventSlug, setEventSlug] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [venue, setVenue] =
    useState("");

  const [city, setCity] =
    useState("");

  const [countryId, setCountryId] =
    useState("");

  const [posterFile, setPosterFile] =
    useState<File | null>(null);

  const [heroImageFile, setHeroImageFile] =
    useState<File | null>(null);

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("upcoming");

  const [ticketUrl, setTicketUrl] =
    useState("");

  const [broadcastUrl, setBroadcastUrl] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadCountries =
      async () => {
        const {
          data,
          error: countryError,
        } = await supabase
          .from("countries")
          .select("id, name")
          .order("name");

        if (countryError) {
          console.error(
            "Countries load error:",
            countryError
          );

          setError(
            countryError.message
          );

          setLoading(false);

          return;
        }

        setCountries(
          (data as Country[]) ||
            []
        );

        setLoading(false);
      };

    void loadCountries();
  }, [supabase]);

  function generateSlug() {
    const slug =
      name
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(/^-|-$/g, "");

    setEventSlug(slug);
  }

  async function uploadEventImage(
    file: File,
    imageType: "poster" | "hero"
  ) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Images must be JPG, PNG or WEBP."
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        "Images must be 10 MB or smaller."
      );
    }

    const baseSlug =
      eventSlug.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      "event";

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const storagePath =
      `${baseSlug}/${imageType}-${crypto.randomUUID()}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("event-media")
      .upload(
        storagePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("event-media")
      .getPublicUrl(storagePath);

    return {
      storagePath,
      publicUrl:
        publicUrlData.publicUrl,
    };
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    if (!name.trim()) {
      setError(
        "Event name is required."
      );

      setSaving(false);

      return;
    }

    const finalSlug =
      eventSlug.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    let uploadedPosterPath = "";
    let uploadedHeroPath = "";

    try {
      let finalPosterUrl: string | null =
        null;

      let finalHeroImageUrl: string | null =
        null;

      if (posterFile) {
        const uploadedPoster =
          await uploadEventImage(
            posterFile,
            "poster"
          );

        uploadedPosterPath =
          uploadedPoster.storagePath;

        finalPosterUrl =
          uploadedPoster.publicUrl;
      }

      if (heroImageFile) {
        const uploadedHero =
          await uploadEventImage(
            heroImageFile,
            "hero"
          );

        uploadedHeroPath =
          uploadedHero.storagePath;

        finalHeroImageUrl =
          uploadedHero.publicUrl;
      }

      const {
        error: insertError,
      } = await supabase
        .from("events")
        .insert({
          name:
            name.trim(),

          event_slug:
            finalSlug || null,

          event_date:
            eventDate || null,

          venue:
            venue.trim() ||
            null,

          city:
            city.trim() ||
            null,

          country_id:
            countryId || null,

          poster_url:
            finalPosterUrl,

          hero_image_url:
            finalHeroImageUrl,

          description:
            description.trim() ||
            null,

          status:
            status.trim(),

          ticket_url:
            ticketUrl.trim() ||
            null,

          broadcast_url:
            broadcastUrl.trim() ||
            null,

          updated_at:
            new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }
    } catch (submitError) {
      console.error(
        "Create event error:",
        submitError
      );

      const pathsToRemove = [
        uploadedPosterPath,
        uploadedHeroPath,
      ].filter(Boolean);

      if (pathsToRemove.length > 0) {
        await supabase.storage
          .from("event-media")
          .remove(pathsToRemove);
      }

      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not create the event."
      );

      setSaving(false);

      return;
    }


    router.push(
      "/admin/events"
    );

    router.refresh();
  }

  const inputClass =
    "mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 text-[#171717] outline-none transition focus:border-[#941f25]";

  const labelClass =
    "text-xs font-black uppercase tracking-[0.12em] text-[#625d56]";

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading Event Form...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Event Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
        Create Event
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
        Create a new Heritage Boxing Entertainment event.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        {/* EVENT INFORMATION */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Event Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>

              <label className={labelClass}>
                Event Name
              </label>

              <input
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="HBE Championship Night"
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                Event Date
              </label>

              <input
                type="datetime-local"
                value={eventDate}
                onChange={(event) =>
                  setEventDate(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

          </div>

          <div className="mt-5">

            <label className={labelClass}>
              Event Slug
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">

              <input
                value={eventSlug}
                onChange={(event) =>
                  setEventSlug(
                    event.target.value
                  )
                }
                placeholder="hbe-championship-night"
                className="w-full border border-[#d8d3cb] bg-white px-4 py-3 text-[#171717] outline-none focus:border-[#941f25]"
              />

              <button
                type="button"
                onClick={generateSlug}
                className="shrink-0 bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39]"
              >
                Generate Slug
              </button>

            </div>

          </div>

        </section>

        {/* LOCATION */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Location
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <div>

              <label className={labelClass}>
                Venue
              </label>

              <input
                value={venue}
                onChange={(event) =>
                  setVenue(
                    event.target.value
                  )
                }
                placeholder="Arena or venue name"
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                City
              </label>

              <input
                value={city}
                onChange={(event) =>
                  setCity(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                Country
              </label>

              <select
                value={countryId}
                onChange={(event) =>
                  setCountryId(
                    event.target.value
                  )
                }
                className={inputClass}
              >

                <option value="">
                  Select Country
                </option>

                {countries.map(
                  (country) => (
                    <option
                      key={country.id}
                      value={country.id}
                    >
                      {country.name}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </section>

        {/* MEDIA */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Event Media
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#625d56]">
            Upload the event poster and hero image directly from your computer. JPG, PNG or WEBP files up to 10 MB.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                Event Poster
              </label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setPosterFile(
                    event.target.files?.[0] || null
                  )
                }
                className="mt-2 block w-full border border-[#d8d3cb] bg-white px-4 py-3 text-sm text-[#171717]"
              />

              {posterFile && (
                <p className="mt-2 text-xs font-semibold text-[#625d56]">
                  Selected: {posterFile.name}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Hero Image
              </label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setHeroImageFile(
                    event.target.files?.[0] || null
                  )
                }
                className="mt-2 block w-full border border-[#d8d3cb] bg-white px-4 py-3 text-sm text-[#171717]"
              />

              {heroImageFile && (
                <p className="mt-2 text-xs font-semibold text-[#625d56]">
                  Selected: {heroImageFile.name}
                </p>
              )}
            </div>

          </div>

        </section>

        {/* EVENT STATUS */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Event Status
          </h2>

          <div className="mt-6">

            <label className={labelClass}>
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              className={inputClass}
            >

              <option value="draft">
                Draft
              </option>

              <option value="upcoming">
                Upcoming
              </option>

              <option value="published">
                Published
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </section>

        {/* LINKS */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Tickets & Broadcast
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>

              <label className={labelClass}>
                Ticket URL
              </label>

              <p className="mt-2 text-xs leading-5 text-[#7a746d]">
                Paste the public page where fans can buy tickets. Leave blank if tickets are not available yet.
              </p>

              <input
                value={ticketUrl}
                onChange={(event) =>
                  setTicketUrl(
                    event.target.value
                  )
                }
                placeholder="https://..."
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                Broadcast URL
              </label>

              <p className="mt-2 text-xs leading-5 text-[#7a746d]">
                Paste the YouTube, Facebook, streaming, PPV or broadcaster link where fans can watch the event.
              </p>

              <input
                value={broadcastUrl}
                onChange={(event) =>
                  setBroadcastUrl(
                    event.target.value
                  )
                }
                placeholder="https://..."
                className={inputClass}
              />

            </div>

          </div>

        </section>

        {/* DESCRIPTION */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Event Description
          </h2>

          <textarea
            rows={7}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Enter event details..."
            className={inputClass}
          />

        </section>

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="submit"
            disabled={saving}
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] disabled:opacity-60"
          >
            {saving
              ? "Creating..."
              : "Create Event"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/events"
              )
            }
            className="border border-[#d8d3cb] px-7 py-4 text-sm font-black uppercase tracking-wide text-[#171717]"
          >
            Cancel
          </button>

        </div>

      </form>

    </main>
  );
}