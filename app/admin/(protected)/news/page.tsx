"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/app/lib/supabase/client";

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
  created_at?: string | null;
  updated_at?: string | null;
};

function formatDate(
  value: string | null
) {
  if (!value) {
    return "Not Published";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not Published";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

export default function AdminNewsPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [news, setNews] =
    useState<NewsRow[]>([]);

  const [
    isSuperAdmin,
    setIsSuperAdmin,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  async function loadData() {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (user) {
      const {
        data: admin,
      } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsSuperAdmin(
        admin?.role ===
          "super_admin"
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("news")
      .select("*")
      .order(
        "published_at",
        {
          ascending: false,
          nullsFirst: false,
        }
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      console.error(
        "News load error:",
        error
      );

      setMessage(
        error.message
      );
    }

    setNews(
      (data as NewsRow[]) ||
        []
    );

    setLoading(false);
  }

  useEffect(() => {
    const initialize =
      async () => {
        await loadData();
      };

    void initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deleteNews(
    story: NewsRow
  ) {
    if (!isSuperAdmin) {
      setMessage(
        "Only the Super Admin can permanently delete news."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `PERMANENTLY delete "${story.title}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("news")
      .delete()
      .eq("id", story.id);

    if (error) {
      setMessage(
        error.message
      );

      return;
    }

    setMessage(
      "News story permanently deleted."
    );

    await loadData();
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading News...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
            News Management
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
            HBE & Boxing News
          </h1>

          <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

          <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
            Manage HBE announcements, boxing news,
            published stories and Latest Updates.
          </p>

        </div>

        <Link
          href="/admin/news/new"
          className="inline-flex items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
        >
          + Add News
        </Link>

      </div>

      {/* SUMMARY */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Total Stories
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {news.length}
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Published
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {
              news.filter(
                (story) =>
                  story.published
              ).length
            }
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Drafts
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {
              news.filter(
                (story) =>
                  !story.published
              ).length
            }
          </p>

        </div>

      </div>

      {message && (
        <div className="mt-6 border border-[#d8d3cb] bg-white p-4 text-sm font-semibold text-[#171717]">
          {message}
        </div>
      )}

      {/* NEWS */}
      <div className="mt-8 space-y-5">

        {news.length > 0 ? (

          news.map(
            (story) => (

              <article
                key={story.id}
                className="overflow-hidden border border-[#e2ddd5] bg-white shadow-sm"
              >

                <div className="grid lg:grid-cols-[220px_1fr_auto]">

                  {/* IMAGE */}
                  <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden bg-[#ece8e2]">

                    {story.featured_image_url ? (

                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          story.featured_image_url
                        }
                        alt={
                          story.title
                        }
                        className="absolute inset-0 h-full w-full object-cover"
                      />

                    ) : (

                      <span className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                        No Featured Image
                      </span>

                    )}

                  </div>

                  {/* INFO */}
                  <div className="p-6">

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-black uppercase text-[#171717] sm:text-2xl">
                        {story.title}
                      </h2>

                      <span
                        className={
                          story.published
                            ? "bg-green-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-green-700"
                            : "bg-yellow-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-yellow-700"
                        }
                      >
                        {story.published
                          ? "Published"
                          : "Draft"}
                      </span>

                    </div>

                    <p className="mt-3 text-sm font-bold text-[#941f25]">
                      {formatDate(
                        story.published_at
                      )}
                    </p>

                    {story.excerpt && (
                      <p className="mt-4 max-w-3xl leading-7 text-[#625d56]">
                        {story.excerpt}
                      </p>
                    )}

                    {story.source_url && (
                      <a
                        href={
                          story.source_url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex text-xs font-black uppercase tracking-wide text-[#941f25] hover:underline"
                      >
                        View Source
                      </a>
                    )}

                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center border-t border-[#eee9e2] p-6 lg:border-l lg:border-t-0">

                    <div className="w-full space-y-3">

                      <Link
                        href={`/admin/news/${story.id}`}
                        className="inline-flex w-full min-w-[170px] items-center justify-center bg-[#c6a24a] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39]"
                      >
                        Edit News
                      </Link>

                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() =>
                            deleteNews(
                              story
                            )
                          }
                          className="inline-flex w-full items-center justify-center border border-red-300 bg-red-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-red-700 transition hover:bg-red-700 hover:text-white"
                        >
                          Permanent Delete
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </article>

            )
          )

        ) : (

          <div className="border border-[#e2ddd5] bg-white p-8">

            <p className="font-bold text-[#625d56]">
              No news stories found.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}