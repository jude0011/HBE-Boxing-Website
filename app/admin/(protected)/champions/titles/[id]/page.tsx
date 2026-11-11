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

type Division = {
  id: string;
  name: string;
};

type ChampionshipTitle = {
  id: string;
  name: string;
  short_name: string | null;
  division_id: string | null;
  title_type: string | null;
  active: boolean;
};

export default function EditChampionshipTitlePage() {
  const params = useParams();
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const titleId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [divisions, setDivisions] =
    useState<Division[]>([]);

  const [name, setName] =
    useState("");

  const [shortName, setShortName] =
    useState("");

  const [divisionId, setDivisionId] =
    useState("");

  const [titleType, setTitleType] =
    useState("");

  const [active, setActive] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadPage =
      async () => {
        if (!titleId) {
          return;
        }

        const [
          titleResult,
          divisionResult,
        ] = await Promise.all([
          supabase
            .from("titles")
            .select(`
              id,
              name,
              short_name,
              division_id,
              title_type,
              active
            `)
            .eq("id", titleId)
            .single(),

          supabase
            .from("divisions")
            .select("id, name")
            .order("name"),
        ]);

        if (titleResult.error) {
          console.error(
            "Title load error:",
            titleResult.error
          );

          setError(
            titleResult.error.message
          );

          setLoading(false);

          return;
        }

        if (divisionResult.error) {
          console.error(
            "Division load error:",
            divisionResult.error
          );
        }

        const title =
          titleResult.data as ChampionshipTitle;

        setName(
          title.name || ""
        );

        setShortName(
          title.short_name || ""
        );

        setDivisionId(
          title.division_id || ""
        );

        setTitleType(
          title.title_type || ""
        );

        setActive(
          title.active ?? true
        );

        setDivisions(
          (divisionResult.data as Division[]) ||
            []
        );

        setLoading(false);
      };

    void loadPage();
  }, [supabase, titleId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    const {
      error: updateError,
    } = await supabase
      .from("titles")
      .update({
        name:
          name.trim(),

        short_name:
          shortName.trim() ||
          null,

        division_id:
          divisionId || null,

        title_type:
          titleType.trim() ||
          null,

        active,
      })
      .eq("id", titleId);

    if (updateError) {
      console.error(
        "Title update error:",
        updateError
      );

      setError(
        updateError.message
      );

      setSaving(false);

      return;
    }

    router.push(
      "/admin/champions"
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
          Loading Championship...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Championship Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
        Edit Championship Title
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
        Update the title name, division,
        championship type and active status.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Championship Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>

              <label className={labelClass}>
                Championship Name
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
                Short Name
              </label>

              <input
                value={shortName}
                onChange={(event) =>
                  setShortName(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                Division
              </label>

              <select
                value={divisionId}
                onChange={(event) =>
                  setDivisionId(
                    event.target.value
                  )
                }
                className={inputClass}
              >

                <option value="">
                  Select Division
                </option>

                {divisions.map(
                  (division) => (
                    <option
                      key={division.id}
                      value={division.id}
                    >
                      {division.name}
                    </option>
                  )
                )}

              </select>

            </div>

            <div>

              <label className={labelClass}>
                Title Type
              </label>

              <input
                value={titleType}
                onChange={(event) =>
                  setTitleType(
                    event.target.value
                  )
                }
                placeholder="HBE Championship"
                className={inputClass}
              />

            </div>

          </div>

          <div className="mt-7 border-t border-[#eee9e2] pt-6">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={active}
                onChange={(event) =>
                  setActive(
                    event.target.checked
                  )
                }
                className="h-5 w-5 accent-[#941f25]"
              />

              <span className="text-sm font-black uppercase tracking-wide text-[#171717]">
                Active Championship
              </span>

            </label>

            <p className="mt-2 text-sm text-[#625d56]">
              Turn this off if HBE is no longer
              awarding this championship.
            </p>

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
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Championship"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/champions"
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