"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/app/lib/supabase/client";

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
  created_at: string;
  platform: string | null;
};

type MediaCategory = {
  id: string;
  name: string;
  slug: string | null;
};

export default function AdminMediaPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [media, setMedia] =
    useState<MediaRow[]>([]);

  const [
    categories,
    setCategories,
  ] =
    useState<
      MediaCategory[]
    >([]);

  const [
    isSuperAdmin,
    setIsSuperAdmin,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    message,
    setMessage,
  ] =
    useState("");

  async function loadData() {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (user) {
      const {
        data:
          adminData,
        error:
          adminError,
      } =
        await supabase
          .from(
            "admin_users"
          )
          .select(
            "role"
          )
          .eq(
            "id",
            user.id
          )
          .single();

      if (
        adminError
      ) {
        console.error(
          "Admin role error:",
          adminError
        );
      }

      setIsSuperAdmin(
        adminData?.role ===
          "super_admin"
      );
    }

    const [
      mediaResult,
      categoryResult,
    ] =
      await Promise.all([
        supabase
          .from(
            "media"
          )
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          ),

        supabase
          .from(
            "media_categories"
          )
          .select(
            "id, name, slug"
          )
          .order(
            "name"
          ),
      ]);

    if (
      mediaResult.error
    ) {
      console.error(
        "Media load error:",
        mediaResult.error
      );

      setMessage(
        mediaResult.error.message
      );
    }

    if (
      categoryResult.error
    ) {
      console.error(
        "Media categories error:",
        categoryResult.error
      );
    }

    setMedia(
      (
        mediaResult.data as MediaRow[]
      ) || []
    );

    setCategories(
      (
        categoryResult.data as MediaCategory[]
      ) || []
    );

    setLoading(false);
  }

  useEffect(() => {
    const initializePage =
      async () => {
        await loadData();
      };

    void initializePage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getCategoryName(
    categoryId:
      string | null
  ) {
    if (!categoryId) {
      return "Uncategorized";
    }

    return (
      categories.find(
        (category) =>
          category.id ===
          categoryId
      )?.name ||
      "Uncategorized"
    );
  }

  async function deleteMedia(
    item: MediaRow
  ) {
    if (
      !isSuperAdmin
    ) {
      setMessage(
        "Only the Super Admin can permanently delete media."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `PERMANENTLY delete "${item.title}"? This cannot be undone.`
      );

    if (
      !confirmed
    ) {
      return;
    }

    setMessage("");

    const {
      error,
    } =
      await supabase
        .from(
          "media"
        )
        .delete()
        .eq(
          "id",
          item.id
        );

    if (error) {
      console.error(
        "Delete media error:",
        error
      );

      setMessage(
        error.message
      );

      return;
    }

    setMessage(
      "Media permanently deleted."
    );

    await loadData();
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading Media...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl p-4 sm:p-6 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
            Media Management
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
            HBE Media
          </h1>

          <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

          <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
            Manage HBE videos,
            interviews, highlights,
            thumbnails, featured media
            and publication status.
          </p>

        </div>

        <Link
          href="/admin/media/new"
          className="inline-flex items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
        >
          + Add Media
        </Link>

      </div>

      {/* SUPER ADMIN NOTICE */}
      {isSuperAdmin && (

        <div className="mt-6 border border-[#e2ddd5] bg-white px-5 py-4">

          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#941f25]">
            Super Admin Controls Enabled
          </p>

          <p className="mt-1 text-sm text-[#625d56]">
            Permanent-delete controls
            are visible only to the
            Super Admin.
          </p>

        </div>

      )}

      {/* MESSAGE */}
      {message && (

        <div className="mt-6 border border-[#d8d3cb] bg-white p-4 text-sm font-semibold text-[#171717]">
          {message}
        </div>

      )}

      {/* SUMMARY */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Total Media
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {media.length}
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Published
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {
              media.filter(
                (item) =>
                  item.published
              ).length
            }
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Featured
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {
              media.filter(
                (item) =>
                  item.featured
              ).length
            }
          </p>

        </div>

      </div>

      {/* MEDIA ITEMS */}
      <div className="mt-8 space-y-5">

        {media.length >
        0 ? (

          media.map(
            (item) => {
              const categoryName =
                getCategoryName(
                  item.category_id
                );

              return (

                <article
                  key={
                    item.id
                  }
                  className="overflow-hidden border border-[#e2ddd5] bg-white shadow-sm"
                >

                  <div className="grid min-w-0 lg:grid-cols-[320px_minmax(0,1fr)_260px]">

                    {/* THUMBNAIL */}
                    <div className="relative aspect-video w-full overflow-hidden bg-[#ece8e2] lg:aspect-auto lg:min-h-[180px]">

                      {item.thumbnail_url ? (

                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            item.thumbnail_url
                          }
                          alt={
                            item.title
                          }
                          className="absolute inset-0 h-full w-full object-cover object-center"
                        />

                      ) : (

                        <div className="flex aspect-video h-full w-full items-center justify-center p-6 text-center lg:aspect-auto lg:min-h-[180px]">

                          <span className="text-xs font-black uppercase tracking-wider text-[#8a847c]">
                            No Thumbnail
                          </span>

                        </div>

                      )}

                    </div>

                    {/* INFO */}
                    <div className="min-w-0 p-5 sm:p-6">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl font-black uppercase text-[#171717] sm:text-2xl">
                          {
                            item.title
                          }
                        </h2>

                        <span className="bg-[#f7f4ef] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#625d56]">
                          {
                            categoryName
                          }
                        </span>

                        {item.featured && (

                          <span className="bg-[#fff4d6] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#8a6919]">
                            Featured
                          </span>

                        )}

                        <span
                          className={
                            item.published
                              ? "bg-green-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-green-700"
                              : "bg-yellow-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-yellow-700"
                          }
                        >
                          {item.published
                            ? "Published"
                            : "Draft"}
                        </span>

                      </div>

                      {item.platform && (

                        <p className="mt-3 text-sm font-bold uppercase tracking-wide text-[#941f25]">
                          {
                            item.platform
                          }
                        </p>

                      )}

                      {item.description && (

                        <p className="mt-4 line-clamp-3 max-w-3xl leading-6 text-[#625d56]">
                          {
                            item.description
                          }
                        </p>

                      )}

                      <div className="mt-5 flex flex-wrap gap-4 text-sm">

                        {item.video_url && (

                          <span className="font-bold text-[#171717]">
                            ✓ Video URL
                          </span>

                        )}

                        {item.thumbnail_url && (

                          <span className="font-bold text-[#171717]">
                            ✓ Thumbnail
                          </span>

                        )}

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center border-t border-[#eee9e2] p-5 sm:p-6 lg:border-l lg:border-t-0">

                      <div className="w-full space-y-3">

                        <Link
                          href={`/admin/media/${item.id}`}
                          className="inline-flex w-full items-center justify-center bg-[#c6a24a] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39]"
                        >
                          Edit Media
                        </Link>

                        {isSuperAdmin && (

                          <button
                            type="button"
                            onClick={() =>
                              deleteMedia(
                                item
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

              );
            }
          )

        ) : (

          <div className="border border-[#e2ddd5] bg-white p-8 text-[#625d56]">
            No media items have been
            created yet.
          </div>

        )}

      </div>

    </main>
  );
}