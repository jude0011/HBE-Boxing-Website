"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

export default function NewNewsPage() {
  const router =
    useRouter();

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [content, setContent] =
    useState("");

  const [
    featuredImageUrl,
    setFeaturedImageUrl,
  ] = useState("");

  const [
    sourceUrl,
    setSourceUrl,
  ] = useState("");

  const [
    published,
    setPublished,
  ] = useState(true);

  const [
    publishedAt,
    setPublishedAt,
  ] = useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  function generateSlug() {
    const generated =
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

    setSlug(generated);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    if (!title.trim()) {
      setError(
        "News title is required."
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
      .from("news")
      .insert({
        title:
          title.trim(),

        slug:
          slug.trim() || null,

        excerpt:
          excerpt.trim() ||
          null,

        content:
          content.trim() ||
          null,

        featured_image_url:
          featuredImageUrl.trim() ||
          null,

        source_url:
          sourceUrl.trim() ||
          null,

        published,

        published_at:
          publishDate,
      });

    if (insertError) {
      console.error(
        "Create news error:",
        insertError
      );

      setError(
        insertError.message
      );

      setSaving(false);

      return;
    }

    router.push(
      "/admin/news"
    );

    router.refresh();
  }

  const inputClass =
    "mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 text-[#171717] outline-none transition focus:border-[#941f25]";

  const labelClass =
    "text-xs font-black uppercase tracking-[0.12em] text-[#625d56]";

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        News Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
        Add News
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        {/* STORY */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Story Information
          </h2>

          <div className="mt-6">

            <label className={labelClass}>
              Headline
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
                className="w-full border border-[#d8d3cb] px-4 py-3 outline-none focus:border-[#941f25]"
              />

              <button
                type="button"
                onClick={
                  generateSlug
                }
                className="shrink-0 bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase text-[#171717]"
              >
                Generate Slug
              </button>

            </div>

          </div>

          <div className="mt-5">

            <label className={labelClass}>
              Excerpt
            </label>

            <textarea
              rows={4}
              value={excerpt}
              onChange={(event) =>
                setExcerpt(
                  event.target.value
                )
              }
              placeholder="Short summary shown in Latest Updates..."
              className={inputClass}
            />

          </div>

          <div className="mt-5">

            <label className={labelClass}>
              Full Article / Content
            </label>

            <textarea
              rows={12}
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value
                )
              }
              placeholder="Enter the full HBE news story..."
              className={inputClass}
            />

          </div>

        </section>

        {/* MEDIA */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Image & Source
          </h2>

          <div className="mt-6">

            <label className={labelClass}>
              Featured Image URL
            </label>

            <input
              type="url"
              value={
                featuredImageUrl
              }
              onChange={(event) =>
                setFeaturedImageUrl(
                  event.target.value
                )
              }
              placeholder="https://..."
              className={inputClass}
            />

          </div>

          {featuredImageUrl && (
            <div className="mt-5 overflow-hidden border border-[#e2ddd5] bg-[#f7f4ef] p-5">

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  featuredImageUrl
                }
                alt="News preview"
                className="max-h-[320px] w-full object-cover"
              />

            </div>
          )}

          <div className="mt-5">

            <label className={labelClass}>
              Source URL
            </label>

            <input
              type="url"
              value={sourceUrl}
              onChange={(event) =>
                setSourceUrl(
                  event.target.value
                )
              }
              placeholder="https://..."
              className={inputClass}
            />

            <p className="mt-2 text-xs text-[#8a847c]">
              Optional external source or original story link.
            </p>

          </div>

        </section>

        {/* PUBLISH */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Publication
          </h2>

          <label className="mt-6 flex items-center gap-3">

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
            <div className="mt-6 max-w-md">

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
                Leave blank to publish using the current date and time.
              </p>

            </div>
          )}

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
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-[#74181d] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Add News"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/news"
              )
            }
            className="border border-[#d8d3cb] bg-white px-7 py-4 text-sm font-black uppercase"
          >
            Cancel
          </button>

        </div>

      </form>

    </main>
  );
}