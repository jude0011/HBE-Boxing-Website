"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { createClient } from "@/app/lib/supabase/client";

type ChampionshipTitle = {
  id: string;
  name: string;
};

type Boxer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
};

type ChampionshipReign = {
  id: string;

  title_id: string | null;
  boxer_id: string | null;

  won_date: string | null;
  ended_date: string | null;

  current_champion: boolean | null;
  title_defenses: number | null;

  opponent_name: string | null;
  won_by: string | null;

  event_name: string | null;
  location: string | null;

  notes: string | null;
};

function formatDate(
  date: string | null
) {
  if (!date) {
    return "—";
  }

  return new Date(
    `${date}T00:00:00Z`
  ).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

export default function ChampionsAdminPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [
    titles,
    setTitles,
  ] = useState<
    ChampionshipTitle[]
  >([]);

  const [
    boxers,
    setBoxers,
  ] = useState<Boxer[]>([]);

  const [
    reigns,
    setReigns,
  ] = useState<
    ChampionshipReign[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      const [
        titlesResult,
        boxersResult,
        reignsResult,
      ] = await Promise.all([
        supabase
          .from("titles")
          .select(
            "id, name"
          )
          .order("name"),

        supabase
          .from("boxers")
          .select(
            "id, first_name, last_name, nickname"
          )
          .order(
            "last_name"
          ),

        supabase
          .from(
            "title_reigns"
          )
          .select("*")
          .order(
            "current_champion",
            {
              ascending:
                false,
            }
          )
          .order(
            "won_date",
            {
              ascending:
                false,
              nullsFirst:
                false,
            }
          ),
      ]);

      if (
        titlesResult.error
      ) {
        console.error(
          titlesResult.error
        );
      }

      if (
        boxersResult.error
      ) {
        console.error(
          boxersResult.error
        );
      }

      if (
        reignsResult.error
      ) {
        setError(
          reignsResult.error.message
        );

        setLoading(false);
        return;
      }

      setTitles(
        (
          titlesResult.data as ChampionshipTitle[]
        ) || []
      );

      setBoxers(
        (
          boxersResult.data as Boxer[]
        ) || []
      );

      setReigns(
        (
          reignsResult.data as ChampionshipReign[]
        ) || []
      );

      setLoading(false);
    }

    void loadData();
  }, [supabase]);

  function getBoxer(
    boxerId: string | null
  ) {
    if (!boxerId) {
      return null;
    }

    return (
      boxers.find(
        (boxer) =>
          boxer.id ===
          boxerId
      ) || null
    );
  }

  function getBoxerName(
    boxerId: string | null
  ) {
    const boxer =
      getBoxer(
        boxerId
      );

    if (!boxer) {
      return "Unknown Boxer";
    }

    return `${boxer.first_name || ""} ${
      boxer.last_name || ""
    }`.trim();
  }

  function getTitleName(
    titleId: string | null
  ) {
    if (!titleId) {
      return "HBE Championship";
    }

    return (
      titles.find(
        (title) =>
          title.id ===
          titleId
      )?.name ||
      "HBE Championship"
    );
  }

  const currentChampions =
    reigns.filter(
      (reign) =>
        reign.current_champion
    );

  const historicalReigns =
    reigns.filter(
      (reign) =>
        !reign.current_champion
    );

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-6 sm:p-8 lg:p-10">
        <p className="font-black uppercase text-[#625d56]">
          Loading Championships...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
            Championship Management
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
            HBE Champions
          </h1>

          <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

          <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
            Manage championship titles,
            current champions and complete
            championship history.
          </p>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <Link
            href="/admin/champions/new"
            className="inline-flex items-center justify-center border border-[#171717] bg-white px-6 py-4 text-sm font-black uppercase tracking-wide text-[#171717]"
          >
            Add Championship Title
          </Link>

          <Link
            href="/admin/champions/reigns/new"
            className="inline-flex items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
          >
            Add Championship History
          </Link>

        </div>

      </div>

      {error && (
        <div className="mt-7 border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="border border-[#e2ddd5] bg-white p-6">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#817a73]">
            Championship Titles
          </p>

          <p className="mt-2 text-3xl font-black">
            {titles.length}
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-6">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#817a73]">
            Current Champions
          </p>

          <p className="mt-2 text-3xl font-black text-green-700">
            {
              currentChampions.length
            }
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-6">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#817a73]">
            Historical Reigns
          </p>

          <p className="mt-2 text-3xl font-black">
            {
              historicalReigns.length
            }
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-6">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#817a73]">
            Total Reigns
          </p>

          <p className="mt-2 text-3xl font-black">
            {reigns.length}
          </p>

        </div>

      </section>

      {/* CURRENT CHAMPIONS */}
      <section className="mt-12">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
              Active Championships
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">
              Current Champions
            </h2>

          </div>

          <span className="bg-green-100 px-4 py-2 text-xs font-black uppercase text-green-700">
            {
              currentChampions.length
            }{" "}
            Current
          </span>

        </div>

        {currentChampions.length ===
        0 ? (

          <div className="mt-6 border border-[#e2ddd5] bg-[#f7f4ef] p-8">

            <p className="font-bold text-[#625d56]">
              No current champions found.
            </p>

          </div>

        ) : (

          <div className="mt-6 grid gap-5 lg:grid-cols-2">

            {currentChampions.map(
              (reign) => {
                const boxer =
                  getBoxer(
                    reign.boxer_id
                  );

                return (
                  <article
                    key={
                      reign.id
                    }
                    className="border border-[#e2ddd5] bg-white"
                  >

                    <div className="border-b border-[#e2ddd5] bg-[#f7f4ef] p-6">

                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#941f25]">
                        Current Champion
                      </p>

                      <h3 className="mt-2 text-xl font-black uppercase">
                        {getTitleName(
                          reign.title_id
                        )}
                      </h3>

                    </div>

                    <div className="p-6">

                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#817a73]">
                        Champion
                      </p>

                      <p className="mt-2 text-xl font-black">
                        {getBoxerName(
                          reign.boxer_id
                        )}
                      </p>

                      {boxer?.nickname && (

                        <p className="mt-1 italic text-[#625d56]">
                          &ldquo;
                          {
                            boxer.nickname
                          }
                          &rdquo;
                        </p>

                      )}

                      <div className="mt-5 grid grid-cols-2 gap-4">

                        <div>

                          <p className="text-[11px] font-black uppercase text-[#817a73]">
                            Won
                          </p>

                          <p className="mt-1 font-bold">
                            {formatDate(
                              reign.won_date
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-[11px] font-black uppercase text-[#817a73]">
                            Defenses
                          </p>

                          <p className="mt-1 font-bold">
                            {reign.title_defenses ??
                              0}
                          </p>

                        </div>

                      </div>

                      <Link
                        href={`/admin/champions/reigns/${reign.id}`}
                        className="mt-6 inline-flex bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase text-[#171717] transition hover:bg-[#b08d39]"
                      >
                        Edit Reign
                      </Link>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* ALL CHAMPIONSHIP REIGNS */}
      <section className="mt-12">

        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
          Championship Database
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">
          All Championship Reigns
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-[#625d56]">
          Every championship record is
          listed separately. A boxer can
          appear multiple times if they
          have held multiple championships
          or multiple reigns.
        </p>

        {reigns.length === 0 ? (

          <div className="mt-6 border border-[#e2ddd5] bg-[#f7f4ef] p-8">
            No championship history found.
          </div>

        ) : (

          <div className="mt-6 overflow-x-auto border border-[#e2ddd5] bg-white">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-[#171717] text-left text-white">

                <tr>

                  <th className="px-5 py-4 text-xs font-black uppercase">
                    Boxer
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase">
                    Championship
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase">
                    Won
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase">
                    Ended
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase">
                    Defenses
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase">
                    Opponent
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-black uppercase">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {reigns.map(
                  (reign) => (

                    <tr
                      key={
                        reign.id
                      }
                      className="border-t border-[#e5e0d8]"
                    >

                      <td className="px-5 py-5 font-black">
                        {getBoxerName(
                          reign.boxer_id
                        )}
                      </td>

                      <td className="px-5 py-5 font-bold">
                        {getTitleName(
                          reign.title_id
                        )}
                      </td>

                      <td className="px-5 py-5">
                        {formatDate(
                          reign.won_date
                        )}
                      </td>

                      <td className="px-5 py-5">
                        {reign.current_champion
                          ? "—"
                          : formatDate(
                              reign.ended_date
                            )}
                      </td>

                      <td className="px-5 py-5 font-bold">
                        {reign.title_defenses ??
                          0}
                      </td>

                      <td className="px-5 py-5">
                        {reign.opponent_name ||
                          "—"}
                      </td>

                      <td className="px-5 py-5">

                        {reign.current_champion ? (

                          <span className="inline-flex bg-green-100 px-3 py-2 text-xs font-black uppercase text-green-700">
                            Current
                          </span>

                        ) : (

                          <span className="inline-flex bg-[#efebe5] px-3 py-2 text-xs font-black uppercase text-[#625d56]">
                            Historical
                          </span>

                        )}

                      </td>

                      <td className="px-5 py-5">

                        <Link
                          href={`/admin/champions/reigns/${reign.id}`}
                          className="inline-flex bg-[#c6a24a] px-4 py-3 text-xs font-black uppercase text-[#171717] transition hover:bg-[#b08d39]"
                        >
                          Edit
                        </Link>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* TITLES */}
      <section className="mt-12">

        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
          Title Management
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl">
          Championship Titles
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {titles.map(
            (title) => (

              <article
                key={
                  title.id
                }
                className="border border-[#e2ddd5] bg-white p-6"
              >

                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#817a73]">
                  HBE Championship
                </p>

                <h3 className="mt-2 text-lg font-black uppercase">
                  {title.name}
                </h3>

                <Link
                  href={`/admin/champions/titles/${title.id}`}
                  className="mt-5 inline-flex bg-[#c6a24a] px-4 py-3 text-xs font-black uppercase text-[#171717] transition hover:bg-[#b08d39]"
                >
                  Edit Title
                </Link>

              </article>

            )
          )}

        </div>

      </section>

    </main>
  );
}