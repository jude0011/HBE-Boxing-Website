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

type MediaCategory = {
  id: string;
  name: string;
};

type Boxer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

type EventRow = {
  id: string;
  name: string;
};

type Bout = {
  id: string;
};

export default function NewMediaPage() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [categories, setCategories] =
    useState<MediaCategory[]>([]);

  const [boxers, setBoxers] =
    useState<Boxer[]>([]);

  const [events, setEvents] =
    useState<EventRow[]>([]);

  const [bouts, setBouts] =
    useState<Bout[]>([]);

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [boxerId, setBoxerId] =
    useState("");

  const [eventId, setEventId] =
    useState("");

  const [boutId, setBoutId] =
    useState("");

  const [platform, setPlatform] =
    useState("YouTube");

  const [videoUrl, setVideoUrl] =
    useState("");

  const [
    thumbnailUrl,
    setThumbnailUrl,
  ] = useState("");

  const [featured, setFeatured] =
    useState(false);

  const [published, setPublished] =
    useState(true);

  const [
    publishedAt,
    setPublishedAt,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadPage =
      async () => {
        const [
          categoryResult,
          boxerResult,
          eventResult,
          boutResult,
        ] = await Promise.all([
          supabase
            .from("media_categories")
            .select("id, name")
            .order("name"),

          supabase
            .from("boxers")
            .select(`
              id,
              first_name,
              last_name
            `)
            .order("first_name"),

          supabase
            .from("events")
            .select("id, name")
            .order("event_date", {
              ascending: false,
            }),

          supabase
            .from("bouts")
            .select("id"),
        ]);

        if (categoryResult.error) {
          console.error(
            "Categories error:",
            categoryResult.error
          );
        }

        if (boxerResult.error) {
          console.error(
            "Boxers error:",
            boxerResult.error
          );
        }

        if (eventResult.error) {
          console.error(
            "Events error:",
            eventResult.error
          );
        }

        if (boutResult.error) {
          console.error(
            "Bouts error:",
            boutResult.error
          );
        }

        setCategories(
          (
            categoryResult.data as MediaCategory[]
          ) || []
        );

        setBoxers(
          (boxerResult.data as Boxer[]) ||
            []
        );

        setEvents(
          (eventResult.data as EventRow[]) ||
            []
        );

        setBouts(
          (boutResult.data as Bout[]) ||
            []
        );

        setLoading(false);
      };

    void loadPage();
  }, [supabase]);

  function generateSlug() {
    const newSlug =
      title
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

    setSlug(newSlug);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    if (!title.trim()) {
      setError(
        "Media title is required."
      );

      setSaving(false);

      return;
    }

    const publishDate =
      published
        ? publishedAt
          ? new Date(
              publishedAt
            ).toISOString()
          : new Date().toISOString()
        : null;

    const {
      error: insertError,
    } = await supabase
      .from("media")
      .insert({
        title:
          title.trim(),

        slug:
          slug.trim() || null,

        description:
          description.trim() ||
          null,

        category_id:
          categoryId || null,

        boxer_id:
          boxerId || null,

        event_id:
          eventId || null,

        bout_id:
          boutId || null,

        video_url:
          videoUrl.trim() ||
          null,

        thumbnail_url:
          thumbnailUrl.trim() ||
          null,

        featured,

        published,

        published_at:
          publishDate,

        platform:
          platform.trim() ||
          null,
      });

    if (insertError) {
      console.error(
        "Create media error:",
        insertError
      );

      setError(
        insertError.message
      );

      setSaving(false);

      return;
    }

    router.push(
      "/admin/media"
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
          Loading Media Form...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Media Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
        Add Media
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
        Add HBE interviews, highlights, videos and featured media.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        {/* BASIC INFORMATION */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Media Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                Title
              </label>

              <input
                required
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Category
              </label>

              <select
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          <div className="mt-5">

            <label className={labelClass}>
              Slug
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">

              <input
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                  )
                }
                className="w-full border border-[#d8d3cb] bg-white px-4 py-3 outline-none focus:border-[#941f25]"
              />

              <button
                type="button"
                onClick={generateSlug}
                className="shrink-0 bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase text-[#171717]"
              >
                Generate Slug
              </button>

            </div>

          </div>

          <div className="mt-5">

            <label className={labelClass}>
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              className={inputClass}
            />

          </div>

        </section>

        {/* VIDEO */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Video & Thumbnail
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                Platform
              </label>

              <select
                value={platform}
                onChange={(event) =>
                  setPlatform(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="YouTube">
                  YouTube
                </option>

                <option value="Vimeo">
                  Vimeo
                </option>

                <option value="Instagram">
                  Instagram
                </option>

                <option value="Facebook">
                  Facebook
                </option>

                <option value="TikTok">
                  TikTok
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Video URL
              </label>

              <input
                value={videoUrl}
                onChange={(event) =>
                  setVideoUrl(
                    event.target.value
                  )
                }
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>
                Thumbnail URL
              </label>

              <input
                value={thumbnailUrl}
                onChange={(event) =>
                  setThumbnailUrl(
                    event.target.value
                  )
                }
                placeholder="https://..."
                className={inputClass}
              />
            </div>

          </div>

        </section>

        {/* ASSOCIATIONS */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Related HBE Content
          </h2>

          <p className="mt-2 text-sm text-[#625d56]">
            These are optional. Use them when media belongs to a specific fighter, event or bout.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            <div>
              <label className={labelClass}>
                Boxer
              </label>

              <select
                value={boxerId}
                onChange={(event) =>
                  setBoxerId(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  No Boxer
                </option>

                {boxers.map(
                  (boxer) => (
                    <option
                      key={boxer.id}
                      value={boxer.id}
                    >
                      {boxer.first_name}{" "}
                      {boxer.last_name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Event
              </label>

              <select
                value={eventId}
                onChange={(event) =>
                  setEventId(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  No Event
                </option>

                {events.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Bout
              </label>

              <select
                value={boutId}
                onChange={(event) =>
                  setBoutId(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  No Bout
                </option>

                {bouts.map(
                  (bout) => (
                    <option
                      key={bout.id}
                      value={bout.id}
                    >
                      Bout{" "}
                      {bout.id.slice(
                        0,
                        8
                      )}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

        </section>

        {/* PUBLISHING */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Publication
          </h2>

          <div className="mt-6 space-y-5">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(
                    event.target.checked
                  )
                }
                className="h-5 w-5 accent-[#941f25]"
              />

              <span className="text-sm font-black uppercase">
                Featured Media
              </span>

            </label>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={published}
                onChange={(event) =>
                  setPublished(
                    event.target.checked
                  )
                }
                className="h-5 w-5 accent-[#941f25]"
              />

              <span className="text-sm font-black uppercase">
                Published
              </span>

            </label>

            {published && (
              <div className="max-w-md">

                <label className={labelClass}>
                  Published Date
                </label>

                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(event) =>
                    setPublishedAt(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-[#8a847c]">
                  Leave blank to use the current date and time.
                </p>

              </div>
            )}

          </div>

        </section>

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="submit"
            disabled={saving}
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase text-white disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Add Media"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/media"
              )
            }
            className="border border-[#d8d3cb] px-7 py-4 text-sm font-black uppercase"
          >
            Cancel
          </button>

        </div>

      </form>

    </main>
  );
}