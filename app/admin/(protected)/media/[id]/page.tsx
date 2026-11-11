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

type MediaRow = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  category_id: string | null;
  boxer_id: string | null;
  event_id: string | null;
  bout_id: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  platform: string | null;
};

export default function EditMediaPage() {
  const params = useParams();
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const mediaId =
    typeof params.id === "string"
      ? params.id
      : "";

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
    useState("");

  const [videoUrl, setVideoUrl] =
    useState("");

  const [
    thumbnailUrl,
    setThumbnailUrl,
  ] = useState("");

  const [featured, setFeatured] =
    useState(false);

  const [published, setPublished] =
    useState(false);

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
        if (!mediaId) {
          return;
        }

        const [
          mediaResult,
          categoryResult,
          boxerResult,
          eventResult,
          boutResult,
        ] = await Promise.all([
          supabase
            .from("media")
            .select("*")
            .eq(
              "id",
              mediaId
            )
            .single(),

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
            .order(
              "event_date",
              {
                ascending: false,
              }
            ),

          supabase
            .from("bouts")
            .select("id"),
        ]);

        if (mediaResult.error) {
          console.error(
            "Media load error:",
            mediaResult.error
          );

          setError(
            mediaResult.error.message
          );

          setLoading(false);

          return;
        }

        const item =
          mediaResult.data as MediaRow;

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

        setTitle(
          item.title || ""
        );

        setSlug(
          item.slug || ""
        );

        setDescription(
          item.description || ""
        );

        setCategoryId(
          item.category_id || ""
        );

        setBoxerId(
          item.boxer_id || ""
        );

        setEventId(
          item.event_id || ""
        );

        setBoutId(
          item.bout_id || ""
        );

        setPlatform(
          item.platform || ""
        );

        setVideoUrl(
          item.video_url || ""
        );

        setThumbnailUrl(
          item.thumbnail_url || ""
        );

        setFeatured(
          item.featured ?? false
        );

        setPublished(
          item.published ?? false
        );

        setPublishedAt(
          formatDateForInput(
            item.published_at
          )
        );

        setLoading(false);
      };

    void loadPage();
  }, [mediaId, supabase]);

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

    const publishDate =
      published
        ? publishedAt
          ? new Date(
              publishedAt
            ).toISOString()
          : new Date().toISOString()
        : null;

    const {
      error: updateError,
    } = await supabase
      .from("media")
      .update({
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
      })
      .eq("id", mediaId);

    if (updateError) {
      console.error(
        "Media update error:",
        updateError
      );

      setError(
        updateError.message
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
    "mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 text-[#171717] outline-none focus:border-[#941f25]";

  const labelClass =
    "text-xs font-black uppercase tracking-[0.12em] text-[#625d56]";

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-10">
        <p className="font-black uppercase text-[#625d56]">
          Loading Media...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Media Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase">
        Edit Media
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

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

            <div className="mt-2 flex gap-3">

              <input
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                  )
                }
                className="w-full border border-[#d8d3cb] px-4 py-3"
              />

              <button
                type="button"
                onClick={generateSlug}
                className="bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase"
              >
                Generate
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

        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Video & Thumbnail
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                Platform
              </label>

              <input
                value={platform}
                onChange={(event) =>
                  setPlatform(
                    event.target.value
                  )
                }
                className={inputClass}
              />
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
                className={inputClass}
              />

            </div>

          </div>

        </section>

        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Related Content
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

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

        </section>

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

              <span className="font-black uppercase">
                Featured
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

              <span className="font-black uppercase">
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

              </div>
            )}

          </div>

        </section>

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">

          <button
            type="submit"
            disabled={saving}
            className="bg-[#c6a24a] px-7 py-4 text-sm font-black uppercase text-[#171717] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Media"}
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