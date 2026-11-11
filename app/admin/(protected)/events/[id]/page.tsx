"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

type Country = {
  id: string;
  name: string;
};

type EventRow = {
  id: string;
  name: string;
  event_slug: string | null;
  event_date: string | null;
  venue: string | null;
  city: string | null;
  country_id: string | null;
  poster_url: string | null;
  hero_image_url: string | null;
  description: string | null;
  status: string | null;
  ticket_url: string | null;
  broadcast_url: string | null;
  completed_at: string | null;
  results_summary: string | null;
  main_event_winner: string | null;
  main_event_loser: string | null;
  result_method: string | null;
  result_round: number | null;
  result_time: string | null;
  result_notes: string | null;
};

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const eventId =
    typeof params.id === "string"
      ? params.id
      : "";

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

  const [posterUrl, setPosterUrl] =
    useState("");

  const [
    heroImageUrl,
    setHeroImageUrl,
  ] = useState("");

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

  const [
    broadcastUrl,
    setBroadcastUrl,
  ] = useState("");

  const [
    completedAt,
    setCompletedAt,
  ] = useState("");

  const [
    resultsSummary,
    setResultsSummary,
  ] = useState("");

  const [
    mainEventWinner,
    setMainEventWinner,
  ] = useState("");

  const [
    mainEventLoser,
    setMainEventLoser,
  ] = useState("");

  const [
    resultMethod,
    setResultMethod,
  ] = useState("");

  const [
    resultRound,
    setResultRound,
  ] = useState("");

  const [
    resultTime,
    setResultTime,
  ] = useState("");

  const [
    resultNotes,
    setResultNotes,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  function formatDateForInput(
    value: string | null
  ) {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    const hours =
      String(
        date.getHours()
      ).padStart(2, "0");

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  useEffect(() => {
    const loadPage =
      async () => {
        if (!eventId) {
          return;
        }

        const [
          eventResult,
          countryResult,
        ] = await Promise.all([
          supabase
            .from("events")
            .select(`
              id,
              name,
              event_slug,
              event_date,
              venue,
              city,
              country_id,
              poster_url,
              hero_image_url,
              description,
              status,
              ticket_url,
              broadcast_url,
              completed_at,
              results_summary,
              main_event_winner,
              main_event_loser,
              result_method,
              result_round,
              result_time,
              result_notes
            `)
            .eq("id", eventId)
            .single(),

          supabase
            .from("countries")
            .select("id, name")
            .order("name"),
        ]);

        if (eventResult.error) {
          console.error(
            "Event load error:",
            eventResult.error
          );

          setError(
            eventResult.error.message
          );

          setLoading(false);

          return;
        }

        if (countryResult.error) {
          console.error(
            "Country load error:",
            countryResult.error
          );
        }

        const event =
          eventResult.data as EventRow;

        setCountries(
          (countryResult.data as Country[]) ||
            []
        );

        setName(
          event.name || ""
        );

        setEventSlug(
          event.event_slug || ""
        );

        setEventDate(
          formatDateForInput(
            event.event_date
          )
        );

        setVenue(
          event.venue || ""
        );

        setCity(
          event.city || ""
        );

        setCountryId(
          event.country_id || ""
        );

        setPosterUrl(
          event.poster_url || ""
        );

        setHeroImageUrl(
          event.hero_image_url || ""
        );

        setDescription(
          event.description || ""
        );

        setStatus(
          event.status ||
            "upcoming"
        );

        setTicketUrl(
          event.ticket_url || ""
        );

        setBroadcastUrl(
          event.broadcast_url || ""
        );

        setCompletedAt(
          formatDateForInput(
            event.completed_at
          )
        );

        setResultsSummary(
          event.results_summary || ""
        );

        setMainEventWinner(
          event.main_event_winner || ""
        );

        setMainEventLoser(
          event.main_event_loser || ""
        );

        setResultMethod(
          event.result_method || ""
        );

        setResultRound(
          event.result_round
            ? String(event.result_round)
            : ""
        );

        setResultTime(
          event.result_time || ""
        );

        setResultNotes(
          event.result_notes || ""
        );

        setLoading(false);
      };

    void loadPage();
  }, [eventId, supabase]);

  function generateSlug() {
    const slug =
      name
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        );

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

    try {
      let finalPosterUrl =
        posterUrl.trim() || null;

      let finalHeroImageUrl =
        heroImageUrl.trim() || null;

      if (posterFile) {
        const uploadedPoster =
          await uploadEventImage(
            posterFile,
            "poster"
          );

        finalPosterUrl =
          uploadedPoster.publicUrl;
      }

      if (heroImageFile) {
        const uploadedHero =
          await uploadEventImage(
            heroImageFile,
            "hero"
          );

        finalHeroImageUrl =
          uploadedHero.publicUrl;
      }

      const {
        error: updateError,
      } = await supabase
        .from("events")
        .update({
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

          completed_at:
            status === "completed"
              ? completedAt || new Date().toISOString()
              : null,

          results_summary:
            status === "completed"
              ? resultsSummary.trim() || null
              : null,

          main_event_winner:
            status === "completed"
              ? mainEventWinner.trim() || null
              : null,

          main_event_loser:
            status === "completed"
              ? mainEventLoser.trim() || null
              : null,

          result_method:
            status === "completed"
              ? resultMethod.trim() || null
              : null,

          result_round:
            status === "completed" && resultRound
              ? Number(resultRound)
              : null,

          result_time:
            status === "completed"
              ? resultTime.trim() || null
              : null,

          result_notes:
            status === "completed"
              ? resultNotes.trim() || null
              : null,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", eventId);

      if (updateError) {
        throw updateError;
      }
    } catch (submitError) {
      console.error(
        "Event update error:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not update the event."
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
          Loading Event...
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
        Edit Event
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
        Update event information, venue, media,
        ticket links, broadcast details and status.
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
            Upload a new poster or hero image directly from your computer. If you do not select a new image, the current image will remain unchanged.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                Event Poster
              </label>

              {posterUrl && (
                <div className="mt-3 border border-[#e2ddd5] bg-[#f7f4ef] p-3">
                  <div
                    role="img"
                    aria-label={`${name} current event poster`}
                    className="mx-auto h-72 w-full bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage:
                        `url("${posterUrl}")`,
                    }}
                  />
                </div>
              )}

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setPosterFile(
                    event.target.files?.[0] || null
                  )
                }
                className="mt-3 block w-full border border-[#d8d3cb] bg-white px-4 py-3 text-sm text-[#171717]"
              />

              {posterFile && (
                <p className="mt-2 text-xs font-semibold text-[#625d56]">
                  New poster: {posterFile.name}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Hero Image
              </label>

              {heroImageUrl && (
                <div className="mt-3 border border-[#e2ddd5] bg-[#f7f4ef] p-3">
                  <div
                    role="img"
                    aria-label={`${name} current hero image`}
                    className="h-72 w-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage:
                        `url("${heroImageUrl}")`,
                    }}
                  />
                </div>
              )}

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setHeroImageFile(
                    event.target.files?.[0] || null
                  )
                }
                className="mt-3 block w-full border border-[#d8d3cb] bg-white px-4 py-3 text-sm text-[#171717]"
              />

              {heroImageFile && (
                <p className="mt-2 text-xs font-semibold text-[#625d56]">
                  New hero image: {heroImageFile.name}
                </p>
              )}
            </div>

          </div>

        </section>

        {/* STATUS */}
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

        {/* RESULTS - COMPLETED EVENTS ONLY */}
        {status === "completed" && (
          <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
              Post-Event
            </p>

            <h2 className="mt-2 text-xl font-black uppercase">
              Official Results
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#625d56]">
              Record the official event result details that should appear after the event is completed.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Event Completed Date
                </label>

                <input
                  type="datetime-local"
                  value={completedAt}
                  onChange={(event) =>
                    setCompletedAt(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Result Method
                </label>

                <select
                  value={resultMethod}
                  onChange={(event) =>
                    setResultMethod(
                      event.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select Method
                  </option>

                  <option value="KO">
                    KO
                  </option>

                  <option value="TKO">
                    TKO
                  </option>

                  <option value="Unanimous Decision">
                    Unanimous Decision
                  </option>

                  <option value="Split Decision">
                    Split Decision
                  </option>

                  <option value="Majority Decision">
                    Majority Decision
                  </option>

                  <option value="Draw">
                    Draw
                  </option>

                  <option value="No Contest">
                    No Contest
                  </option>

                  <option value="Disqualification">
                    Disqualification
                  </option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Main Event Winner
                </label>

                <input
                  value={mainEventWinner}
                  onChange={(event) =>
                    setMainEventWinner(
                      event.target.value
                    )
                  }
                  placeholder="Winner name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Main Event Loser
                </label>

                <input
                  value={mainEventLoser}
                  onChange={(event) =>
                    setMainEventLoser(
                      event.target.value
                    )
                  }
                  placeholder="Opponent name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Round
                </label>

                <input
                  type="number"
                  min="1"
                  value={resultRound}
                  onChange={(event) =>
                    setResultRound(
                      event.target.value
                    )
                  }
                  placeholder="Example: 5"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Time
                </label>

                <input
                  value={resultTime}
                  onChange={(event) =>
                    setResultTime(
                      event.target.value
                    )
                  }
                  placeholder="Example: 2:41"
                  className={inputClass}
                />
              </div>

            </div>

            <div className="mt-5">
              <label className={labelClass}>
                Results Summary
              </label>

              <textarea
                rows={5}
                value={resultsSummary}
                onChange={(event) =>
                  setResultsSummary(
                    event.target.value
                  )
                }
                placeholder="Summarize the event results, key fights and notable outcomes."
                className={inputClass}
              />
            </div>

            <div className="mt-5">
              <label className={labelClass}>
                Result Notes
              </label>

              <textarea
                rows={4}
                value={resultNotes}
                onChange={(event) =>
                  setResultNotes(
                    event.target.value
                  )
                }
                placeholder="Optional additional notes."
                className={inputClass}
              />
            </div>

          </section>
        )}

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
            className="bg-[#c6a24a] px-7 py-4 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Event"}
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